<template>
  <div>
    <nav>
      <template v-for="(item, index) in visibleMenuItems" :key="item.name">
        <router-link v-if="item.type === 'link'" :to="item.to">{{ item.label }}</router-link>
        <button v-else-if="item.type === 'button'" @click="item.action" class="logout-btn">{{ item.label }}</button>
        <span v-if="index < visibleMenuItems.length - 1" class="separator"> | </span>
      </template>
    </nav>
    <div class="role-indicator">
      Текущий режим:
      <strong v-if="!authStore.isAuthenticated">Гость</strong>
      <strong v-else-if="authStore.user?.role === 'admin'">Администратор ({{ authStore.user.login }})</strong>
      <strong v-else>Пользователь ({{ authStore.user?.login }})</strong>
    </div>
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from './stores/auth';
import { useCartStore } from './stores/cart';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();
const cartTotalCount = computed(() => cartStore.totalCount);
cartStore.loadCart();

function logout() {
  authStore.logout();
  router.push('/auth/login');
}

const menuItems = [
  { name: 'catalog', label: 'Каталог', type: 'link', to: '/catalog', visible: () => true },
  { name: 'profile', label: 'Профиль', type: 'link', to: '/profile', visible: () => authStore.isAuthenticated },
  { name: 'cart', label: `Корзина (${cartTotalCount.value})`, type: 'link', to: '/cart', visible: () => authStore.isAuthenticated },
  { name: 'favorites', label: 'Избранное', type: 'link', to: '/favorites', visible: () => authStore.isAuthenticated },
  { name: 'adminUsers', label: 'Управление пользователями', type: 'link', to: '/admin/users', visible: () => authStore.user?.role === 'admin' },
  { name: 'adminProducts', label: 'Управление товарами', type: 'link', to: '/admin/products', visible: () => authStore.user?.role === 'admin' },
  { name: 'login', label: 'Вход', type: 'link', to: '/auth/login', visible: () => !authStore.isAuthenticated },
  { name: 'register', label: 'Регистрация', type: 'link', to: '/auth/register', visible: () => !authStore.isAuthenticated },
  { name: 'logout', label: 'Выйти', type: 'button', action: logout, visible: () => authStore.isAuthenticated },
];

const visibleMenuItems = computed(() => {
  const cartItem = menuItems.find(i => i.name === 'cart');
  if (cartItem) cartItem.label = `Корзина (${cartTotalCount.value})`;
  return menuItems.filter(item => item.visible());
});
</script>

<style>
* {
  box-sizing: border-box;
}

nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px 2px;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
}

nav a, nav button {
  text-decoration: none;
  color: #42b983;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px 6px;
  white-space: nowrap;
}

nav button {
  color: #dc3545;
}

nav a:hover { color: #369870; }

.separator {
  color: #ccc;
}

.role-indicator {
  text-align: center;
  padding: 8px 16px;
  background: #f0f0f0;
  font-size: 0.9rem;
  border-bottom: 1px solid #ddd;
}

/* Мобильные устройства (375px и меньше) */
@media (max-width: 480px) {
  nav {
    gap: 6px 4px;
    padding: 10px 8px;
  }

  nav a, nav button {
    font-size: 0.85rem;
    padding: 6px 8px;
  }

  .separator {
    display: none;
  }

  .role-indicator {
    font-size: 0.8rem;
    padding: 6px 10px;
  }
}
</style>