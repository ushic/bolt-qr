<template>
  <div class="flex flex-col items-center">
    <div v-if="permissionError" class="text-red-400 mb-4 text-center px-4">
      {{ permissionError }}
    </div>
    
    <QrScannerOptions
      v-if="!showScanner"
      @camera-click="startCamera"
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
import QrScannerOptions from './QrScannerOptions.vue'
import QrScannerCamera from './QrScannerCamera.vue'
import { useQrScanner } from '@/composables/useQrScanner'
import { useCamera } from '@/composables/useCamera'

const showScanner = ref(false)
const { handleScanSuccess } = useQrScanner()
const { permissionError, requestCameraPermission } = useCamera()

const startCamera = async () => {
  const hasPermission = await requestCameraPermission()
  if (hasPermission) {
    showScanner.value = true
  }
}

const stopScanner = () => {
  showScanner.value = false
}

const onScanSuccess = (decodedText) => {
  handleScanSuccess(decodedText)
  stopScanner()
}
</script>
