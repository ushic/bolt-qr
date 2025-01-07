<template>
  <div class="space-y-4">
    <form @submit.prevent="handleSubscribe" class="space-y-4">
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block text-white/80 text-sm mb-2">Topic</label>
          <input 
            v-model="topic"
            type="text"
            class="w-full bg-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="home/sensors/#"
            required
          />
        </div>
        
        <div class="w-32">
          <label class="block text-white/80 text-sm mb-2">QoS</label>
          <select 
            v-model="qos"
            class="w-full bg-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option 
              v-for="level in QOS_LEVELS"
              :key="level.value"
              :value="level.value"
            >
              {{ level.value }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex gap-2">
        <button 
          type="submit"
          class="flex-1 bg-white text-[#1a2847] py-2 px-4 rounded-lg font-medium hover:bg-white/90 transition-colors"
        >
          Subscribe
        </button>
        
        <button 
          type="button"
          @click="handleUnsubscribe"
          class="flex-1 bg-white/10 text-white py-2 px-4 rounded-lg font-medium hover:bg-white/20 transition-colors"
          :disabled="!hasSubscriptions"
        >
          Unsubscribe
        </button>
      </div>
    </form>

    <!-- Active Subscriptions -->
    <div class="space-y-2">
      <h3 class="text-white/80 text-sm font-medium">Active Subscriptions</h3>
      <div v-if="subscriptions.size === 0" class="text-white/60 text-sm">
        No active subscriptions
      </div>
      <div 
        v-for="topic in subscriptions"
        :key="topic"
        class="bg-white/10 p-2 rounded text-sm text-white"
      >
        {{ topic }}
      </div>
    </div>

    <!-- Received Messages -->
    <div class="space-y-2">
      <h3 class="text-white/80 text-sm font-medium">Received Messages</h3>
      <div v-if="messageHistory.length === 0" class="text-white/60 text-sm">
        No messages received
      </div>
      <div 
        v-for="msg in messageHistory"
        :key="msg.timestamp"
        class="bg-white/10 p-3 rounded-lg space-y-1"
      >
        <div class="flex justify-between text-sm">
          <span class="text-white/80">{{ msg.topic }}</span>
          <span class="text-white/60">QoS: {{ msg.qos }}</span>
        </div>
        <p class="text-white break-all">{{ msg.message }}</p>
        <p class="text-xs text-white/60">{{ new Date(msg.timestamp).toLocaleString() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMqttStore } from '@/stores/mqttStore'
import { QOS_LEVELS } from '@/config/mqtt'

const mqtt = useMqttStore()

const topic = ref('')
const qos = ref(0)

const subscriptions = computed(() => mqtt.subscriptions)
const messageHistory = computed(() => mqtt.messageHistory)
const hasSubscriptions = computed(() => mqtt.subscriptions.size > 0)

const handleSubscribe = async () => {
  try {
    await mqtt.subscribe(topic.value, parseInt(qos.value))
    topic.value = ''
  } catch (error) {
    console.error('Subscription error:', error)
  }
}

const handleUnsubscribe = async () => {
  try {
    await mqtt.unsubscribe(topic.value)
  } catch (error) {
    console.error('Unsubscribe error:', error)
  }
}
</script>
