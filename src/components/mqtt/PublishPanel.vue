<template>
  <div class="space-y-4">
    <form @submit.prevent="handlePublish" class="space-y-4">
      <div>
        <label class="block text-white/80 text-sm mb-2">Topic</label>
        <input 
          v-model="form.topic"
          type="text"
          class="w-full bg-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="home/sensors/temperature"
          required
        />
      </div>

      <div>
        <label class="block text-white/80 text-sm mb-2">Message</label>
        <textarea
          v-model="form.message"
          class="w-full bg-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 min-h-[100px]"
          placeholder="Enter message..."
          required
        ></textarea>
      </div>

      <div>
        <label class="block text-white/80 text-sm mb-2">QoS Level</label>
        <select 
          v-model="form.qos"
          class="w-full bg-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option 
            v-for="level in QOS_LEVELS" 
            :key="level.value" 
            :value="level.value"
          >
            {{ level.label }}
          </option>
        </select>
      </div>

      <button 
        type="submit"
        class="w-full bg-white text-[#1a2847] py-3 px-8 rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
        :disabled="isPublishing"
      >
        {{ isPublishing ? 'Publishing...' : 'Publish' }}
      </button>
    </form>

    <!-- Published Messages History -->
    <div class="space-y-2">
      <h3 class="text-white/80 text-sm font-medium">Published Messages</h3>
      <div v-if="publishHistory.length === 0" class="text-white/60 text-sm">
        No messages published
      </div>
      <div 
        v-for="msg in publishHistory"
        :key="msg.timestamp"
        class="bg-white/10 p-3 rounded-lg space-y-1"
      >
        <div class="flex justify-between text-sm">
          <span class="text-white/80">{{ msg.topic }}</span>
          <span 
            :class="msg.status === 'delivered' ? 'text-green-400' : 'text-red-400'"
          >
            {{ msg.status }}
          </span>
        </div>
        <p class="text-white break-all">{{ msg.message }}</p>
        <div class="flex justify-between text-xs text-white/60">
          <span>QoS: {{ msg.qos }}</span>
          <span>{{ new Date(msg.timestamp).toLocaleString() }}</span>
        </div>
        <p v-if="msg.error" class="text-red-400 text-sm">
          {{ msg.error }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMqttStore } from '@/stores/mqttStore'
import { QOS_LEVELS } from '@/config/mqtt'

const mqtt = useMqttStore()

const form = ref({
  topic: '',
  message: '',
  qos: 0
})

const isPublishing = ref(false)
const publishHistory = computed(() => mqtt.publishHistory)

const handlePublish = async () => {
  isPublishing.value = true
  try {
    await mqtt.publish(form.value.topic, form.value.message, form.value.qos)
    form.value.message = ''
  } catch (error) {
    console.error('Publish error:', error)
  } finally {
    isPublishing.value = false
  }
}
</script>
