import { defineStore } from 'pinia'

export interface HotelHistory {
  hotelId: string
  hotelName: string
  englishName: string
  img: string
}

export const useHotelHistoryStore = defineStore('hotelHistory', {
  state: () => ({
    history: [] as HotelHistory[]
  }),
  actions: {
    // 添加酒店到历史记录，去重并限制条数为 3
    addHotel(hotel: HotelHistory) {
      // 先移除已存在的记录（如果有）
      this.history = this.history.filter(item => item.hotelId !== hotel.hotelId)
      // 添加到记录最前面
      this.history.unshift(hotel)
      // 超过 3 条则截断
      if (this.history.length > 3) {
        this.history = this.history.slice(0, 3)
      }
      // 持久化到 localStorage
      localStorage.setItem('hotelHistory', JSON.stringify(this.history))
    },
    // 从 localStorage 加载历史数据
    loadHistory() {
      const data = localStorage.getItem('hotelHistory')
      if (data) {
        this.history = JSON.parse(data)
      }
    }
  }
})
