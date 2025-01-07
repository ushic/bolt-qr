import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQrHistory } from '@/stores/qrHistory'

export function useQrScanner() {
  const router = useRouter()
  const qrHistory = useQrHistory()
  const lastScannedCode = ref(null)
  const isProcessing = ref(false)
  const scanError = ref(null)

  const handleScanSuccess = (decodedText) => {
    if (isProcessing.value) return
    
    lastScannedCode.value = decodedText
    isProcessing.value = true
    scanError.value = null
    
    try {
      // Add to history
      qrHistory.addCode(decodedText)

      // Navigate to transfer page
      router.push('/transfer')
    } catch (error) {
      console.error('Error processing QR code:', error)
      scanError.value = error.message
    } finally {
      isProcessing.value = false
    }
  }

  return {
    lastScannedCode,
    isProcessing,
    scanError,
    handleScanSuccess
  }
}
