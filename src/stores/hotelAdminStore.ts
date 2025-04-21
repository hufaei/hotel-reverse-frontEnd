import { defineStore } from 'pinia';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('adminUser') || '{}'),
    token: localStorage.getItem('adminToken') || '', 
  }),
  actions: {
    setUser(userData: any) {
      this.user = userData;
      localStorage.setItem('adminUser', JSON.stringify(userData));
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('adminToken', token);
    },
    clear() {
      this.user = {};
      localStorage.removeItem('adminUser');
      this.token = '';
      localStorage.removeItem('adminToken'); 
    }
  },
});
