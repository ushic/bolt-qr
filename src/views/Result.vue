<template>
  <div class="min-h-screen p-4">
    <StatusBar />
    <div class="flex flex-col items-center">
      <h1 class="text-2xl text-white font-bold mb-4">Scan Result</h1>
      <div class="bg-white/10 p-4 rounded-lg">
        <p class="text-white">{{ code }}</p>
      </div>
      <button 
        @click="router.push('/')"
        class="mt-4 bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors"
      >
        Scan Again
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import StatusBar from '@/components/StatusBar.vue'

const route = useRoute()
const router = useRouter()
const code = route.query.code
</script>
