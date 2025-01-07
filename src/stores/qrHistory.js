import { ref } from 'vue'

const scannedCodes = ref([])

export function useQrHistory() {
  const addCode = (code) => {
    scannedCodes.value.unshift({
      id: Date.now(),
      code,
      timestamp: new Date().toISOString()
    })
  }

  const deleteCode = (id) => {
    scannedCodes.value = scannedCodes.value.filter(code => code.id !== id)
  }

  const getCodes = () => scannedCodes.value

  return {
    addCode,
    deleteCode,
    getCodes
  }
}
