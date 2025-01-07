<template>
  <div class="space-y-4">
    <div v-if="codes.length === 0" class="text-white/60 text-center py-8">
      No QR codes scanned yet
    </div>
    
    <div
      v-for="code in codes"
      :key="code.id"
      class="bg-white/10 p-4 rounded-lg relative group"
    >
      <QrCodeDetails
        :code="code.code"
        :timestamp="code.timestamp"
        class="pr-8"
      />
      
      <button
        @click="deleteCode(code.id)"
        class="absolute top-4 right-4 text-white/60 hover:text-white"
      >
        <component :is="Icons.Trash" class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useQrHistory } from '@/stores/qrHistory'
import QrCodeDetails from '@/components/transfer/QrCodeDetails.vue'
import { Icons } from '@/components/icons'

const qrHistory = useQrHistory()
const codes = computed(() => qrHistory.getCodes())

const deleteCode = (id) => {
  qrHistory.deleteCode(id)
}
</script>
