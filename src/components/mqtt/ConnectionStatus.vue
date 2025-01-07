<template>
  <div class="bg-white/10 p-4 rounded-lg space-y-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <component 
          :is="Icons.Signal"
          class="w-5 h-5"
          :class="statusIconClass"
        />
        <span class="text-white/80">Status:</span>
      </div>
      <span :class="statusClass" class="font-medium">
        {{ statusText }}
      </span>
    </div>

    <div 
      v-if="mqtt.error"
      class="text-red-400 text-sm flex items-start gap-2 border-t border-white/10 pt-2"
    >
      <span class="text-red-400">⚠️</span>
      <span>{{ mqtt.error }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMqttStore } from '@/stores/mqttStore'
import { Icons } from '@/components/icons/index.js'

const mqtt = useMqttStore()

const statusText = computed(() => {
  const status = mqtt.connectionStatus
  return {
    'connected': 'Connected',
    'connecting': 'Connecting...',
    'disconnected': 'Disconnected',
    'error': 'Connection Error'
  }[status] || status
})

const statusClass = computed(() => ({
  'text-green-400': mqtt.connectionStatus === 'connected',
  'text-yellow-400': mqtt.connectionStatus === 'connecting',
  'text-red-400': mqtt.connectionStatus === 'error',
  'text-white/60': mqtt.connectionStatus === 'disconnected'
}))

const statusIconClass = computed(() => ({
  'text-green-400': mqtt.connectionStatus === 'connected',
  'text-yellow-400': mqtt.connectionStatus === 'connecting',
  'text-red-400': mqtt.connectionStatus === 'error',
  'text-white/20': mqtt.connectionStatus === 'disconnected'
}))
</script>
