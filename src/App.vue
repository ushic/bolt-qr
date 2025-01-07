<template>
  <div class="min-h-screen bg-[#4d82dc]" dir="rtl">
    <router-view />
    <Navigation />
  </div>
</template>

<script setup>
import Navigation from './components/Navigation.vue'
</script>
