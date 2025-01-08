<template>
  <div class="bg-white/10 p-4 rounded-lg space-y-4">
    <!-- Status Messages -->
    <div v-if="statusMessage" :class="[
      'text-sm p-2 rounded text-center',
      status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
    ]">
      {{ statusMessage }}
    </div>
    
    <template v-if="parsedData?.type === 'registration'">
      <div class="space-y-4">
        <h3 class="text-white text-lg font-medium">Registration Request</h3>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-white/60">Device ID:</span>
            <span class="text-white">{{ parsedData.code }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-white/60">Registration Code:</span>
            <span class="text-white">{{ registrationCode }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-white/60">Topic:</span>
            <span class="text-white">SN/{{ parsedData.code }}</span>
          </div>
        </div>
        
        <div v-if="publishStatus" :class="[
          'text-sm p-2 rounded text-center',
          publishStatus === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        ]">
          {{ publishMessage }}
        </div>
        
        <button 
          @click="handleRegister"
          class="w-full bg-white text-[#1a2847] py-3 px-8 rounded-lg font-medium hover:bg-white/90 transition-colors"
          :disabled="isRegistering"
        >
          {{ isRegistering ? 'Registering...' : 'Register Device' }}
        </button>
      </div>
    </template>
    <template v-else-if="parsedData">
      <!-- Payment details -->
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div class="text-white/60">سریال دستگاه:</div>
        <div class="text-white text-right">{{ parsedData.serialNumber }}</div>
        
        <div class="text-white/60">مبلغ (تومان):</div>
        <div class="text-white text-right">{{ formatNumber(parsedData.amount) }}</div>
        
        <div class="text-white/60">تاریخ:</div>
        <div class="text-white text-right">{{ parsedData.date }}</div>
        
        <div class="text-white/60">زمان:</div>
        <div class="text-white text-right">{{ parsedData.time }}</div>
        
        <div class="text-white/60">فروشگاه:</div>
        <div class="text-white text-right">{{ parsedData.merchantName }}</div>

				<div class="text-white/60">پذیرنده:</div>
        <div class="text-white text-right">{{ parsedData.merchantNo }}</div>

				<div class="text-white/60">ترمینال:</div>
        <div class="text-white text-right">{{ parsedData.terminalNo }}</div>
      </div>
      
      <!-- Payment button and form -->
      <div v-if="!showPaymentForm" class="mt-4">
        <button 
          @click="showPaymentForm = true"
          class="w-full bg-white text-[#1a2847] py-3 px-8 rounded-lg font-medium hover:bg-white/90 transition-colors"
        >
          پرداخت {{ formatNumber(parsedData.amount) }} تومان
        </button>
      </div>
      
      <PaymentForm
        v-else
        :amount="parsedData.amount"
        @success="handlePaymentSuccess"
        @cancel="showPaymentForm = false"
      />
    </template>
    <div v-else class="text-white break-all">
      {{ code }}
    </div>
    
    <p class="text-sm text-white/60 mt-1">
      {{ new Date(timestamp).toLocaleString() }}
    </p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { parseQrData } from '@/utils/qrParser'
import PaymentForm from '@/components/payment/PaymentForm.vue'
import { formatPaymentData } from '@/utils/payment'
import { useRegistration } from '@/composables/useRegistration'
import { useMqttConnection } from '@/composables/useMqttConnection'
import { useMqttStore } from '@/stores/mqttStore'

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    required: true
  }
})

const parsedData = computed(() => {
  // Check if it's a registration QR code
  const parts = props.code.split('|')
  if (parts.length === 2 && parts[1] === 'Register') {
    return { type: 'registration', code: parts[0] }
  }
  return parseQrData(props.code)
})

const showPaymentForm = ref(false)
const isRegistering = ref(false)
const status = ref('')
const statusMessage = ref('')
const { register, registrationCode } = useRegistration()
const mqtt = useMqttStore()
const { ensureConnection } = useMqttConnection()

const clearStatus = () => {
  status.value = ''
  statusMessage.value = ''
}

const setStatus = (type, message) => {
  status.value = type
  statusMessage.value = message
}

const handleRegister = async () => {
  if (parsedData.value?.type === 'registration') {
    isRegistering.value = true
    clearStatus()
    
    try {
      await register(parsedData.value.code)
      setStatus('success', 'دستگاه با موفقیت ثبت شد!')
    } catch (error) {
      setStatus('error', error.message)
    } finally {
      isRegistering.value = false
    }
  }
}

const handlePaymentSuccess = async (cardData) => {
  showPaymentForm.value = false
  clearStatus()
  
  try {
    await ensureConnection()
    
    const paymentData = formatPaymentData({
      serialNumber: parsedData.value.serialNumber,
      amount: parsedData.value.amount,
      cardNumber: cardData.cardNumber
    })
    
    await mqtt.publish(
      parsedData.value.serialNumber,
      paymentData,
      1 // Use QoS 1 for payments
    )
    
    setStatus('success', 'پرداخت با موفقیت انجام شد!')
  } catch (error) {
    console.error('Payment publish error:', error)
    setStatus('error', error.message)
  }
}
</script>
