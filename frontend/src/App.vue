<template>
  <div>
    <nav>
      <router-link to="/catalog">Каталог</router-link> |
      <router-link to="/profile">Профиль</router-link> |
      <router-link to="/auth/login">Вход</router-link> |
      <router-link to="/auth/register">Регистрация</router-link> |
      <router-link to="/cart">Корзина ({{ cartTotalCount }})</router-link> |
      <router-link to="/admin/products">Управление товарами</router-link> |
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCartStore } from './stores/cart';

const cartStore = useCartStore();
cartStore.loadCart(); // загружаем корзину при старте
const cartTotalCount = computed(() => cartStore.totalCount);
</script>

<style>
/* ... */
.cart-info {
  margin-left: 20px;
  font-weight: bold;
}
</style>