import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    keywords: '',            // 用户输入的关键词
    location: '',            // 地点
    dateRange: [] as unknown as [string, string], // ["YYYY-MM-DD", "YYYY-MM-DD"]
  }),
  // 开启持久化，默认将整个 state 存到 localStorage
  persist: true,
})
