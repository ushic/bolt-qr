import { ref } from 'vue'
import { useMqttStore } from '@/stores/mqttStore'
import { useMqttConnection } from './useMqttConnection'
import { generateRegistrationCode } from '@/utils/registration'

export function useRegistration() {
  const mqtt = useMqttStore()
  const { ensureConnection } = useMqttConnection()
  const registrationCode = ref(generateRegistrationCode())

  const register = async (serialNumber) => {
    await ensureConnection()

    // Publish registration code to SN topic
    await mqtt.publish(
      `SN/${serialNumber}`, 
      registrationCode.value,
      2 // Use QoS 2 for registration
    )
  }

  return {
    register,
    registrationCode
  }
}
