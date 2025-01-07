import { ref } from 'vue'
import { maskCardNumber } from '@/utils/card'

// Initialize from localStorage if available
const STORAGE_KEY = 'savedCards'
const savedCards = ref(
  JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
)

export function useCardStore() {
  const addCard = (card) => {
    const maskedCard = {
      ...card,
      cardNumber: maskCardNumber(card.cardNumber),
      id: Date.now()
    }
    savedCards.value.unshift(maskedCard)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCards.value))
  }

  const deleteCard = (id) => {
    savedCards.value = savedCards.value.filter(card => card.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCards.value))
  }

  const getCards = () => savedCards.value

  return {
    addCard,
    deleteCard,
    getCards
  }
}
