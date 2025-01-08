<template>
  <div class="space-y-4">
    <!-- Saved Cards -->
    <div v-if="savedCards.length > 0" class="space-y-2">
      <label class="block text-white/80 text-sm mb-2">انتخاب کارت</label>
      <div 
        v-for="card in savedCards" 
        :key="card.id"
        :class="[
          'flex items-center justify-between p-3 rounded-lg cursor-pointer',
          selectedCard?.id === card.id ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
        ]"
        @click="selectCard(card)"
      >
        <div>
          <div class="text-white" dir="ltr">{{ card.cardNumber }}</div>
          <div class="text-sm text-white/60">{{ card.cardholderName }}</div>
        </div>
        <button 
          v-if="selectedCard?.id !== card.id"
          @click.stop="deleteCard(card.id)"
          class="text-white/60 hover:text-white"
        >
          <component :is="Icons.Trash" class="w-5 h-5" />
        </button>
      </div>
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-white/10"></div>
        </div>
        <div class="relative flex justify-center">
          <button 
            @click="startNewCard"
            class="bg-[#1a2847] px-4 text-sm text-white/60 hover:text-white"
          >
            افزودن کارت جدید
          </button>
        </div>
      </div>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="savedCards.length === 0 || showNewCardForm">
      <div>
        <label class="block text-white/80 text-sm mb-2">شماره کارت</label>
        <input 
          v-model="form.cardNumber"
          type="text"
          maxlength="19"
          class="w-full bg-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="1234 5678 9012 3456"
          @input="formatCardNumber"
          required
        />
        <p v-if="errors.cardNumber" class="text-red-400 text-sm mt-1">{{ errors.cardNumber }}</p>
      </div>

      <div>
        <label class="block text-white/80 text-sm mb-2">نام دارنده کارت</label>
        <input 
          v-model="form.cardholderName"
          type="text"
          class="w-full bg-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="John Doe"
          required
        />
        <p v-if="errors.cardholderName" class="text-red-400 text-sm mt-1">{{ errors.cardholderName }}</p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-white/80 text-sm mb-2">تاریخ انقضاء</label>
          <input 
            v-model="form.expiry"
            type="text"
            maxlength="5"
            class="w-full bg-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="MM/YY"
            @input="formatExpiry"
            required
          />
          <p v-if="errors.expiry" class="text-red-400 text-sm mt-1">{{ errors.expiry }}</p>
        </div>

        <div>
          <label class="block text-white/80 text-sm mb-2">CVV</label>
          <input 
            v-model="form.cvv"
            type="text"
            maxlength="4"
            class="w-full bg-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="123"
            required
          />
          <p v-if="errors.cvv" class="text-red-400 text-sm mt-1">{{ errors.cvv }}</p>
        </div>
      </div>
      </div>

      <button 
        type="submit"
        class="w-full bg-white text-[#1a2847] py-3 px-8 rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
        :disabled="!isValid || isProcessing"
      >
        {{ getButtonText }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCardStore } from '@/stores/cardStore'
import { Icons } from '@/components/icons'
import { maskCardNumber } from '@/utils/card'

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const props = defineProps({
  amount: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['success', 'cancel'])

const cardStore = useCardStore()
const savedCards = computed(() => cardStore.getCards())
const showNewCardForm = ref(savedCards.value.length === 0)
const selectedCard = ref(null)
const isProcessing = ref(false)
const form = ref({
  cardNumber: '',
  cardholderName: '',
  expiry: '',
  cvv: ''
})

const errors = ref({})

const getButtonText = computed(() => {
  if (isProcessing.value) return 'در حال پردازش'
  if (selectedCard.value) return `پرداخت ${formatNumber(props.amount)} تومان`
  return `پرداخت ${formatNumber(props.amount)} تومان`
})

const formatCardNumber = () => {
  // Remove non-digits
  let value = form.value.cardNumber.replace(/\D/g, '')
  // Add space after every 4 digits
  value = value.replace(/(\d{4})(?=\d)/g, '$1 ')
  form.value.cardNumber = value
}

const formatExpiry = () => {
  let value = form.value.expiry.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2)
  }
  form.value.expiry = value
}

const validateForm = () => {
  errors.value = {}
  
  // Card number validation
  const cardNumber = form.value.cardNumber.replace(/\s/g, '')
  if (!/^\d{16}$/.test(cardNumber)) {
    errors.value.cardNumber = 'Please enter a valid 16-digit card number'
  }

  // Cardholder name validation
  if (form.value.cardholderName.length < 3) {
    errors.value.cardholderName = 'Please enter the cardholder name'
  }

  // Expiry validation
  const [month, year] = form.value.expiry.split('/')
  if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(form.value.expiry)) {
    errors.value.expiry = 'Please enter a valid expiry date (MM/YY)'
  } else {
    const now = new Date()
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
    if (expiry < now) {
      errors.value.expiry = 'Card has expired'
    }
  }

  // CVV validation
  if (!/^\d{3,4}$/.test(form.value.cvv)) {
    errors.value.cvv = 'Please enter a valid CVV'
  }

  return Object.keys(errors.value).length === 0
}

const isValid = computed(() => {
  // If a card is selected, it's always valid
  if (selectedCard.value) return true
  
  // Otherwise check form fields
  return form.value.cardNumber.length >= 19 && 
         form.value.cardholderName.length > 0 &&
         form.value.expiry.length === 5 &&
         form.value.cvv.length >= 3
})

const startNewCard = () => {
  showNewCardForm.value = true
  selectedCard.value = null
  form.value = { cardNumber: '', cardholderName: '', expiry: '', cvv: '' }
}

const selectCard = (card) => {
  selectedCard.value = card
  showNewCardForm.value = false
  // Reset form since we're using a saved card
  form.value = { 
		cardNumber: maskCardNumber(card.cardNumber), 
		cardholderName: '', 
		expiry: '', 
		cvv: '' }
}

const deleteCard = (id) => {
  cardStore.deleteCard(id)
  if (savedCards.value.length === 0) {
    showNewCardForm.value = true
  }
}

const handleSubmit = async () => {
  if (!selectedCard.value && !validateForm()) return
  
  isProcessing.value = true
  try {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Pass card data to parent for MQTT publishing
    emit('success', {
      cardNumber: form.value.cardNumber
    })
    
    // Save card if it's new
    if (!selectedCard.value) {
      cardStore.addCard({
        cardNumber: maskCardNumber(form.value.cardNumber),
        cardholderName: form.value.cardholderName,
        expiry: form.value.expiry
      })
    }
  } catch (error) {
    console.error('Payment error:', error)
  } finally {
    isProcessing.value = false
  }
}
</script>
