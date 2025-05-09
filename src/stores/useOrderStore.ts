import { defineStore } from 'pinia'

const STORAGE_KEY = 'pendingOrder'

export interface PendingOrder {
  orderId: string
  hotelId: string
  roomTypeId: string
  startDate: string
  endDate: string
  bookCount: number
  userPhone: string
  timestamp: number
}

export const useOrderStore = defineStore('order', {
  state: () => {
    const raw = localStorage.getItem(STORAGE_KEY)
    let pending: PendingOrder | null = null
    if (raw) {
      try {
        pending = JSON.parse(raw) as PendingOrder
      } catch {
        console.warn('pendingOrder 解析失败，已移除')
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    return { pendingOrder: pending }
  },

  getters: {
    hasPending: (state) => state.pendingOrder !== null
  },

  actions: {
    saveOrder(order: PendingOrder) {
      this.pendingOrder = order
      localStorage.setItem(STORAGE_KEY, JSON.stringify(order))
    },
    clearOrder() {
      this.pendingOrder = null
      localStorage.removeItem(STORAGE_KEY)
    }
  }
})
