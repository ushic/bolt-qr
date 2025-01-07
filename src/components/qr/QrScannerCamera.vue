<template>
  <div class="qr-scanner-camera">
    <div id="qr-reader" class="mb-4 rounded-lg overflow-hidden">
      <video 
        ref="videoRef" 
        class="w-full h-full object-cover"
        autoplay 
        playsinline
      ></video>
    </div>
    <div class="flex gap-4 justify-center">
      <button 
        @click="toggleFlash"
        v-if="hasFlash"
        class="bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors"
      >
        {{ isFlashOn ? 'Turn Off Flash' : 'Turn On Flash' }}
      </button>
      <button 
        @click="onCancel" 
        class="bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'

const props = defineProps({
  onScanSuccess: {
    type: Function,
    required: true
  },
  onCancel: {
    type: Function,
    required: true
  }
})

const videoRef = ref(null)
const hasFlash = ref(false)
const isFlashOn = ref(false)
let html5QrCode = null

onMounted(async () => {
  await initializeCamera()
})

const initializeCamera = async () => {
  try {
    html5QrCode = new Html5Qrcode("qr-reader")
    
    await html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      props.onScanSuccess,
      onScanFailure
    )

    // Check if flash is available
    const devices = await navigator.mediaDevices.enumerateDevices()
    const cameras = devices.filter(device => device.kind === 'videoinput')
    if (cameras.length > 0) {
      hasFlash.value = await html5QrCode.hasFlash()
    }
  } catch (error) {
    console.error('Error initializing camera:', error)
  }
}

const toggleFlash = async () => {
  if (html5QrCode && hasFlash.value) {
    try {
      if (isFlashOn.value) {
        await html5QrCode.turnOffFlash()
      } else {
        await html5QrCode.turnOnFlash()
      }
      isFlashOn.value = !isFlashOn.value
    } catch (error) {
      console.error('Error toggling flash:', error)
    }
  }
}

const onScanFailure = (error) => {
  // Only log non-standard errors
  if (!error.includes("No QR code found")) {
    console.warn(`QR Code scanning failed: ${error}`)
  }
}

onUnmounted(async () => {
  if (html5QrCode) {
    try {
      await html5QrCode.stop()
      html5QrCode = null
    } catch (error) {
      console.error('Error stopping camera:', error)
    }
  }
})
</script>

<style scoped>
.qr-scanner-camera {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

#qr-reader {
  width: 100%;
  height: 300px;
  background: #000;
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
}

#qr-reader video {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
}

/* Remove default HTML5-QRCode styles */
#qr-reader__scan_region {
  background: transparent !important;
}

#qr-reader__dashboard {
  display: none !important;
}
</style>
