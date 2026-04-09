<template>
  <div class="profile">
    <h1>Личный кабинет</h1>
    <p>Добро пожаловать, {{ authStore.user?.name || authStore.user?.login }}!</p>
    <p>Email: {{ authStore.user?.email }}</p>
    <button @click="logout">Выйти</button>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

function logout() {
  authStore.logout();
  router.push('/auth/login');
}
</script>

<style scoped>
.profile {
  text-align: center;
  margin-top: 50px;
}
button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}
</style>