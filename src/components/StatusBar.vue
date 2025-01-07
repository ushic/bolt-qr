<template>
  <div class="flex justify-between items-center mb-8">
    <button class="text-white rounded-full bg-white/10 p-2">
      <component :is="Icons.Help" class="h-6 w-6" />
    </button>
    <div class="flex items-center gap-2">
      <img src="/logo.svg" alt="Logo" class="h-[100px] w-[100px] text-white" />
    </div>
  </div>
</template>

<script setup>
import { Icons } from '@/components/icons'
</script>
