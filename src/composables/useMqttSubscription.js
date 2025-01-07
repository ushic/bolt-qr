import { ref } from 'vue'

export function useMqttSubscription(mqttClient) {
  const subscriptions = ref(new Set())

  const subscribe = (topic) => {
    if (mqttClient.value?.connected) {
      console.log(`Subscribe to topic '${topic}'`)
      mqttClient.value.subscribe(topic, (err) => {
        if (!err) {
          subscriptions.value.add(topic)
        }
      })
    }
  }

  const unsubscribe = (topic) => {
    if (mqttClient.value?.connected) {
      mqttClient.value.unsubscribe(topic, (err) => {
        if (!err) {
          subscriptions.value.delete(topic)
        }
      })
    }
  }

  const clearSubscriptions = () => {
    subscriptions.value.clear()
  }

  return {
    subscriptions,
    subscribe,
    unsubscribe,
    clearSubscriptions
  }
}
