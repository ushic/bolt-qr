<template>
  <div class="min-h-screen p-4 pb-24 font-vazir">
    <StatusBar />
    <div class="max-w-md mx-auto space-y-8">
      <div>
        <h2 class="text-xl text-white font-bold mb-4">تنظیمات ارتباطی</h2>
        <ConnectionPanel />
      </div>
      
      <template v-if="mqtt.connectionStatus === 'connected'">
        <h2 class="text-xl text-white font-bold mb-4">Subscriptions</h2>
        <SubscriptionPanel />
        
        <h2 class="text-xl text-white font-bold mb-4">Publish Message</h2>
        <PublishPanel />
      </template>
    </div>
  </div>
</template>

<script setup>
import StatusBar from '@/components/StatusBar.vue'
import ConnectionPanel from '@/components/mqtt/ConnectionPanel.vue'
import SubscriptionPanel from '@/components/mqtt/SubscriptionPanel.vue'
import PublishPanel from '@/components/mqtt/PublishPanel.vue'
import { useMqttStore } from '@/stores/mqttStore'

const mqtt = useMqttStore()
</script>
