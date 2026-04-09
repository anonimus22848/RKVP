import { defineStore } from 'pinia';
import api from '@/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async register(credentials) {
      try {
        const res = await api.post('/auth/register', credentials);
        this.token = res.data.token;
        this.user = res.data.user;
        localStorage.setItem('token', this.token);
        return res.data;
      } catch (err) {
        throw err.response?.data || { error: 'Registration failed' };
      }
    },
    async login(credentials) {
      try {
        const res = await api.post('/auth/login', credentials);
        this.token = res.data.token;
        this.user = res.data.user;
        localStorage.setItem('token', this.token);
        return res.data;
      } catch (err) {
        throw err.response?.data || { error: 'Login failed' };
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },
    async fetchMe() {
      if (!this.token) return;
      try {
        const res = await api.get('/auth/me');
        this.user = res.data;
      } catch (err) {
        this.logout();
        throw err;
      }
    },
  },
});