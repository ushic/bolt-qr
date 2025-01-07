import { ref } from 'vue'
import { useMqttStore } from '@/stores/mqttStore'
import { useConnectionStore } from '@/stores/connectionStore'

export function useMqttConnection() {
  const mqtt = useMqttStore()
  const connectionStore = useConnectionStore()
  const isConnecting = ref(false)

  const ensureConnection = async () => {
    if (mqtt.connectionStatus === 'connected') return true
    
    const connection = connectionStore.getConnection()
    if (!connection) {
      throw new Error('No saved connection settings found. Please configure MQTT connection in Settings.')
    }

    isConnecting.value = true
    try {
      await mqtt.connect({
        ...connection,
        port: parseInt(connection.port)
      })
      return true
    } finally {
      isConnecting.value = false
    }
  }

  return {
    isConnecting,
    ensureConnection
  }
}
