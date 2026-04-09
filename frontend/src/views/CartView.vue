<template>
  <div class="cart">
    <h1>Корзина</h1>
    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <p>Ваша корзина пуста</p>
      <router-link to="/catalog" class="continue">Перейти в каталог</router-link>
    </div>
    <div v-else>
      <div class="cart-items">
        <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.price }} ₽</p>
          </div>
          <div class="item-controls">
            <button @click="decreaseQuantity(item.id)" class="qty-btn">-</button>
            <span class="qty">{{ item.quantity }}</span>
            <button @click="increaseQuantity(item.id)" class="qty-btn">+</button>
            <button @click="removeItem(item.id)" class="remove-btn">Удалить</button>
          </div>
          <div class="item-total">
            {{ item.price * item.quantity }} ₽
          </div>
        </div>
      </div>
      <div class="cart-summary">
        <h3>Итого: {{ cartStore.totalPrice }} ₽</h3>
        <button class="checkout-btn">Оформить заказ</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();

function increaseQuantity(id) {
  const item = cartStore.items.find(i => i.id === id);
  if (item) cartStore.updateQuantity(id, item.quantity + 1);
}

function decreaseQuantity(id) {
  const item = cartStore.items.find(i => i.id === id);
  if (item && item.quantity > 1) {
    cartStore.updateQuantity(id, item.quantity - 1);
  } else {
    cartStore.removeItem(id);
  }
}

function removeItem(id) {
  cartStore.removeItem(id);
}
</script>

<style scoped>
.cart {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
}
.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
}
.item-info {
  flex: 2;
}
.item-controls {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}
.qty-btn {
  width: 30px;
  height: 30px;
  background: #f0f0f0;
  border: none;
  cursor: pointer;
}
.qty {
  min-width: 30px;
  text-align: center;
}
.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
.item-total {
  flex: 1;
  text-align: right;
  font-weight: bold;
}
.cart-summary {
  margin-top: 30px;
  text-align: right;
}
.checkout-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
}
.empty-cart {
  text-align: center;
  margin-top: 50px;
}
.continue {
  display: inline-block;
  margin-top: 20px;
  color: #42b983;
}
</style>