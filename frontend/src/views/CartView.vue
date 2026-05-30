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
          <img v-if="item.image_url" :src="item.image_url" class="item-img" alt="" />
          <div v-else class="item-img-placeholder">📦</div>
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
        <button @click="checkout" class="checkout-btn">Оформить заказ</button>
      </div>
    </div>

    
    <div v-if="showSuccess" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-content">
          <div class="success-icon">✓</div>
          <h2>Ваш заказ успешно оформлен!</h2>
          <p>Номер заказа: #{{ orderNumber }}</p>
          <p class="total">Сумма: {{ totalPrice }} ₽</p>
          <p class="thanks">Спасибо за покупку!</p>
          <button @click="closeModal" class="modal-btn">Продолжить покупки</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import api from '@/api';

const cartStore = useCartStore();
const router = useRouter();
const showSuccess = ref(false);
const orderNumber = ref(null);
const totalPrice = ref(0);

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

// ОФОРМЛЕНИЕ ЗАКАЗА
async function checkout() {
  try {
    // Отправляем данные на бэкенд
    const response = await api.post('/orders', {
      totalPrice: cartStore.totalPrice,
      items: cartStore.items,
    });

    // Сохраняем данные заказа
    orderNumber.value = response.data.id;
    totalPrice.value = response.data.total_price;

    // Показываем модальное окно
    showSuccess.value = true;

    // Очищаем корзину
    cartStore.clearCart();

  } catch (err) {
    alert(err.response?.data?.error || 'Ошибка при оформлении заказа');
    console.error(err);
  }
}

// Закрытие модального окна
function closeModal() {
  showSuccess.value = false;
  router.push('/catalog'); // перенаправляем в каталог
}
</script>

<style scoped>
.cart { max-width: 1000px; margin: 20px auto; padding: 20px; }
.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
}
.item-img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
  flex-shrink: 0;
}
.item-img-placeholder {
  width: 70px;
  height: 70px;
  background: #f5f5f5;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  flex-shrink: 0;
}
.item-info { flex: 2; }
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
  border-radius: 4px;
}
.qty { min-width: 30px; text-align: center; }
.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
.item-total { flex: 1; text-align: right; font-weight: bold; }
.cart-summary { margin-top: 30px; text-align: right; }
.checkout-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1rem;
}
.empty-cart { text-align: center; margin-top: 50px; }
.continue { display: inline-block; margin-top: 20px; color: #42b983; }

/* МОДАЛЬНОЕ ОКНО */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.success-icon {
  font-size: 3rem;
  color: #42b983;
  margin-bottom: 16px;
}

.modal h2 {
  color: #333;
  margin: 12px 0;
}

.modal p {
  color: #666;
  margin: 8px 0;
}

.total {
  font-size: 1.2rem;
  font-weight: bold;
  color: #42b983;
  margin: 16px 0 !important;
}

.thanks {
  font-size: 0.95rem;
  color: #999;
}

.modal-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 24px;
  cursor: pointer;
  border-radius: 6px;
  margin-top: 20px;
  font-size: 1rem;
}

.modal-btn:hover {
  background: #369870;
}

@media (max-width: 480px) {
  .cart-item { flex-wrap: wrap; }
  .item-total { text-align: left; }
  .modal { padding: 24px; max-width: 90%; }
}
</style>