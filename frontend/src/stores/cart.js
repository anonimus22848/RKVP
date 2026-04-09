import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], // каждый элемент: { id, name, price, quantity }
  }),
  getters: {
    totalCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },
  actions: {
    addItem(product) {
      const existing = this.items.find(item => item.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
      // Сохраняем в localStorage для сохранения после перезагрузки
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    removeItem(productId) {
      this.items = this.items.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) this.removeItem(productId);
        else localStorage.setItem('cart', JSON.stringify(this.items));
      }
    },
    loadCart() {
      const saved = localStorage.getItem('cart');
      if (saved) this.items = JSON.parse(saved);
    },
  },
});