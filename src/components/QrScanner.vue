<template>
  <div class="flex flex-col items-center">
    <div v-if="scanError" class="text-red-400 mb-4 text-center px-4">
      {{ scanError }}
    </div>
    
    <QrScannerOptions
      v-if="!showScanner"
      @camera-click="startScanner"
      @file-select="handleFileSelect"
    />
    
    <QrScannerCamera
      v-else
      :onScanSuccess="onScanSuccess"
      :onCancel="stopScanner"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import QrScannerOptions from './qr/QrScannerOptions.vue'
import QrScannerCamera from './qr/QrScannerCamera.vue'
import { useQrScanner } from '@/composables/useQrScanner'

const showScanner = ref(false)
const scanError = ref(null)
const { handleScanSuccess } = useQrScanner()

const startScanner = async () => {
  try {
    // Request camera permission
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' }
    })
    
    // If we got here, permission was granted
    showScanner.value = true
    scanError.value = null
    
    // Clean up the temporary stream
    stream.getTracks().forEach(track => track.stop())
  } catch (error) {
    console.error('Camera permission error:', error)
    scanError.value = 'Camera access denied. Please enable camera permissions.'
  }
}

const stopScanner = () => {
  showScanner.value = false
  scanError.value = null
}

const onScanSuccess = (decodedText) => {
  handleScanSuccess(decodedText)
  stopScanner()
}

const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    const html5QrCode = new Html5Qrcode("qr-file-reader")
    const decodedText = await html5QrCode.scanFile(file, true)
    handleScanSuccess(decodedText)
    html5QrCode.clear()
  } catch (error) {
    console.error('Error scanning file:', error)
    scanError.value = 'Could not read QR code from image'
  }
}
</script>
