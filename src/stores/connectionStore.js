import { ref } from 'vue'

const STORAGE_KEY = 'mqttConnection'
const savedConnection = ref(
  JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
)

export function useConnectionStore() {
  const saveConnection = (connection) => {
    savedConnection.value = connection
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connection))
  }

  const getConnection = () => savedConnection.value

  const clearConnection = () => {
    savedConnection.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    saveConnection,
    getConnection,
    clearConnection
  }
}
