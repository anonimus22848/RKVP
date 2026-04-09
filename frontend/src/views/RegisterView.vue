<template>
  <div class="auth-form">
    <h2>Регистрация</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="form.login" placeholder="Логин" required />
      <input v-model="form.email" type="email" placeholder="Email" required />
      <input v-model="form.password" type="password" placeholder="Пароль (мин. 6 символов)" required />
      <input v-model="form.name" placeholder="Имя (необязательно)" />
      <button type="submit">Зарегистрироваться</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
    <router-link to="/auth/login">Уже есть аккаунт? Войти</router-link>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const form = reactive({ login: '', email: '', password: '', name: '' });
const error = ref('');

async function handleRegister() {
  try {
    await authStore.register(form);
    router.push('/profile');
  } catch (err) {
    error.value = err.error || 'Ошибка регистрации';
  }
}
</script>

<style scoped>
.auth-form {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
input, button {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}
button {
  background: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
.error {
  color: red;
}
</style>