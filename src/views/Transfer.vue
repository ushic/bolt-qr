<template>
  <div class="min-h-screen p-4">
    <StatusBar />
    <div class="max-w-md mx-auto">
      <h1 class="text-2xl text-white font-bold mb-6">جزئیات پرداخت</h1>
      <QrCodeList />
    </div>
  </div>
</template>

<script setup>
import StatusBar from '@/components/StatusBar.vue'
import QrCodeList from '@/components/transfer/QrCodeList.vue'
</script>
