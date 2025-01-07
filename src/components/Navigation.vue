<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
    <div class="flex justify-between items-center max-w-md mx-auto">
      <router-link 
        v-for="(item, index) in navigationItems" 
        :key="index"
        :to="item.path" 
        class="text-gray-700 hover:text-blue-600 transition-colors"
      >
        <component :is="item.icon" class="h-6 w-6" />
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { Icons } from '@/components/icons'

const navigationItems = [
  { path: '/menu', icon: Icons.Home },
  { path: '/transfer', icon: Icons.Transfer },
  { path: '/', icon: Icons.Grid },
  { path: '/connection', icon: Icons.Wifi }
]
</script>

<style scoped>
/* Add RTL support for navigation */
nav {
  direction: rtl;
}

.router-link-active {
  @apply text-blue-600;
}
</style>
