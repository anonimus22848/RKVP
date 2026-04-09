<template>
  <div class="auth-form">
    <h2>Вход</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="login" placeholder="Логин" required />
      <input v-model="password" type="password" placeholder="Пароль" required />
      <button type="submit">Войти</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
    <router-link to="/auth/register">Нет аккаунта? Зарегистрироваться</router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const login = ref('');
const password = ref('');
const error = ref('');

async function handleLogin() {
  try {
    await authStore.login({ login: login.value, password: password.value });
    router.push('/profile');
  } catch (err) {
    error.value = err.error || 'Ошибка входа';
  }
}
</script>

<style scoped>
/* те же стили */
.auth-form { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
input, button { display: block; width: 100%; margin-bottom: 10px; padding: 8px; }
button { background: #42b983; color: white; border: none; cursor: pointer; }
.error { color: red; }
</style>