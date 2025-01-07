import { ref } from 'vue'

export function useCamera() {
  const hasPermission = ref(false)
  const permissionError = ref(null)
  const stream = ref(null)

  const requestCameraPermission = async () => {
    try {
      // Request camera with specific constraints
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer back camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })
      
      stream.value = mediaStream
      hasPermission.value = true
      permissionError.value = null
      return true
    } catch (error) {
      console.error('Camera permission error:', error)
      
      // Provide user-friendly error messages
      switch (error.name) {
        case 'NotFoundError':
          permissionError.value = 'No camera found. Please ensure your device has a camera.'
          break
        case 'NotAllowedError':
          permissionError.value = 'Camera access denied. Please enable camera permissions.'
          break
        case 'NotReadableError':
          permissionError.value = 'Camera is in use by another application.'
          break
        default:
          permissionError.value = 'Unable to access camera. Please try again.'
      }
      return false
    }
  }

  const stopCamera = () => {
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
      stream.value = null
    }
    hasPermission.value = false
  }

  return {
    hasPermission,
    permissionError,
    stream,
    requestCameraPermission,
    stopCamera
  }
}
