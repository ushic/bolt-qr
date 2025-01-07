import { ref } from 'vue'
import mqtt from 'mqtt'
import { MQTT_CONFIG } from '@/config/mqtt'
import { appendMqttPath } from '@/utils/mqtt'

const client = ref(null)
const connectionStatus = ref('disconnected')
const error = ref(null)
const subscriptions = ref(new Set())
const messageHistory = ref([])
const publishHistory = ref([])
const retryCount = ref(0)
const retryTimeout = ref(null)

export function useMqttStore() {
  const connect = async ({ host, port, username, password, clientId }) => {
    if (client.value) {
      await disconnect()
    }
    
    // Reset retry count on new connection attempt
    retryCount.value = 0
    
    return attemptConnection({ host, port, username, password, clientId })
  }

  const attemptConnection = async (config) => {
    try {
      connectionStatus.value = 'connecting'
      error.value = null

      const baseUrl = `${MQTT_CONFIG.protocol}://${config.host}:${config.port}`
      const connectUrl = appendMqttPath(baseUrl)
      
      return new Promise((resolve, reject) => {
        // Clear any existing timeout
        if (retryTimeout.value) {
          clearTimeout(retryTimeout.value)
        }

        // Set connection timeout
        retryTimeout.value = setTimeout(() => {
          if (client.value) {
            client.value.end(true)
          }
          reject(new Error('Connection attempt timed out'))
        }, MQTT_CONFIG.connectTimeout)

        client.value = mqtt.connect(connectUrl, {
          clientId: config.clientId || `mqtt_${Math.random().toString(16).slice(3)}`,
          username: config.username,
          password: config.password,
          keepalive: MQTT_CONFIG.keepalive,
          clean: MQTT_CONFIG.clean,
          connectTimeout: MQTT_CONFIG.connectTimeout,
          reconnectPeriod: MQTT_CONFIG.reconnectPeriod
        })

        setupEventListeners(resolve, reject)
      })
    } catch (error) {
      return handleConnectionError(error)
    }
  }

  const handleConnectionError = async (error) => {
    retryCount.value++
    
    if (retryCount.value < MQTT_CONFIG.maxRetries) {
      console.log(`Connection attempt ${retryCount.value} failed, retrying...`)
      return attemptConnection(config)
    } else {
      const finalError = new Error(
        `Failed to connect after ${MQTT_CONFIG.maxRetries} attempts. Please check your connection settings and try again.`
      )
      handleError(finalError)
      throw finalError
    }
  }

  const disconnect = async () => {
    if (client.value) {
      try {
        // Clear any pending retry timeout
        if (retryTimeout.value) {
          clearTimeout(retryTimeout.value)
          retryTimeout.value = null
        }

        await new Promise((resolve) => {
          client.value.end(true, {}, resolve)
        })
      } catch (err) {
        console.error('Error disconnecting:', err)
      } finally {
        client.value = null
        connectionStatus.value = 'disconnected'
        error.value = null
        subscriptions.value.clear()
        messageHistory.value = []
      }
    }
  }

  const publish = async (topic, message, qos = 0) => {
    return new Promise((resolve, reject) => {
      if (!client.value?.connected) {
        reject(new Error('Not connected to broker'))
        return
      }

      client.value.publish(topic, message, { qos }, (error) => {
        const timestamp = new Date().toISOString()
        if (error) {
          publishHistory.value.unshift({
            timestamp,
            topic,
            message,
            qos,
            status: 'failed',
            error: error.message
          })
          reject(error)
        } else {
          publishHistory.value.unshift({
            timestamp,
            topic,
            message,
            qos,
            status: 'delivered'
          })
          resolve()
        }
      })
    })
  }

  const subscribe = async (topic, qos = 0) => {
    return new Promise((resolve, reject) => {
      if (!client.value?.connected) {
        reject(new Error('Not connected to broker'))
        return
      }

      client.value.subscribe(topic, { qos }, (error) => {
        if (error) reject(error)
        else {
          subscriptions.value.add(topic)
          resolve()
        }
      })
    })
  }

  const unsubscribe = async (topic) => {
    return new Promise((resolve, reject) => {
      if (!client.value?.connected) {
        reject(new Error('Not connected to broker'))
        return
      }

      client.value.unsubscribe(topic, (error) => {
        if (error) reject(error)
        else {
          subscriptions.value.delete(topic)
          resolve()
        }
      })
    })
  }

  const setupEventListeners = (resolve, reject) => {
    if (!client.value) return

    client.value.on('connect', () => {
      connectionStatus.value = 'connected'
      error.value = null
      retryCount.value = 0
      if (retryTimeout.value) {
        clearTimeout(retryTimeout.value)
        retryTimeout.value = null
      }
      resolve()
    })

    client.value.on('message', (topic, message, packet) => {
      messageHistory.value.unshift({
        timestamp: new Date().toISOString(),
        topic,
        message: message.toString(),
        qos: packet.qos
      })
    })

    client.value.on('error', handleError)
    client.value.on('error', reject)

    client.value.on('close', () => {
      connectionStatus.value = 'disconnected'
    })

    client.value.on('offline', () => {
      connectionStatus.value = 'disconnected'
      error.value = 'Connection lost'
    })
  }

  const handleError = (err) => {
    console.error('MQTT Error:', err)
    let errorMessage = `Connection failed${retryCount.value > 0 ? ` (Attempt ${retryCount.value}/${MQTT_CONFIG.maxRetries})` : ''}`
    
    if (err.message?.includes('connect ECONNREFUSED')) {
      errorMessage = 'Could not reach the broker. Please check the host and port.'
    } else if (err.message?.includes('Not authorized')) {
      errorMessage = 'Invalid credentials. Please check your username and password.'
    } else if (err.message) {
      errorMessage = err.message
    }
    
    error.value = errorMessage
    connectionStatus.value = 'error'
  }

  return {
    connectionStatus,
    error,
    subscriptions,
    messageHistory,
    publishHistory,
    connect,
    disconnect,
    publish,
    subscribe,
    unsubscribe
  }
}
