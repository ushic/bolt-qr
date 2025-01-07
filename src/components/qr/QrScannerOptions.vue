<template>
  <div class="flex flex-col items-center">
    <div class="relative mb-8">
      <div class="absolute inset-0 flex items-center justify-center">
        <component :is="Icons.Scanner" class="w-64 h-64 text-white/20" />
      </div>
      <div class="relative">
        <img src="/qr-frame.svg" alt="QR Scanner Frame" class="w-48 h-48" />
        <component 
          :is="Icons.QrCode" 
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white/40" 
        />
      </div>
    </div>
    
    <div class="flex flex-col gap-4 w-full max-w-xs">
      <button 
        @click="$emit('camera-click')"
        class="flex items-center justify-center gap-2 bg-white/10 text-white py-3 px-4 rounded-lg hover:bg-white/20 transition-colors text-right font-vazir"
      >
        <span>پرداخت با QR</span>
        <component :is="Icons.CreditCard" class="w-5 h-5 text-orange-400" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { Icons } from '@/components/icons'

defineEmits(['camera-click'])
</script>

<style scoped>
/* Add Vazirmatn font class */
.font-vazir {
  font-family: 'Vazirmatn', sans-serif;
}

/* Reverse flex direction for RTL */
button {
  flex-direction: row-reverse;
}
</style>
