
import { defineStore } from 'pinia';
import api from '@/api';

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    items: [], // массив объектов товаров
  }),
  getters: {
    isFavorite: (state) => (productId) => state.items.some(item => item.id === productId),
  },
  actions: {
    async fetchFavorites() {
      try {
        const res = await api.get('/favorites');
        this.items = res.data;
      } catch (err) {
        console.error('Failed to load favorites', err);
      }
    },
    async addFavorite(product) {
      try {
        await api.post(`/favorites/${product.id}`);
        this.items.push(product);
      } catch (err) {
        console.error('Failed to add favorite', err);
      }
    },
    async removeFavorite(productId) {
      try {
        await api.delete(`/favorites/${productId}`);
        this.items = this.items.filter(item => item.id !== productId);
      } catch (err) {
        console.error('Failed to remove favorite', err);
      }
    },
  },
});