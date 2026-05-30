<template>
  <div class="admin-users">
    <h1>Управление пользователями</h1>
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <table class="user-table">
        <thead>
          <tr><th>ID</th><th>Логин</th><th>Роль</th><th>Действия</th></tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.login }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button v-if="user.login !== authStore.user?.login" @click="changeRole(user.id, user.role === 'admin' ? 'user' : 'admin')" class="small">
                Сделать {{ user.role === 'admin' ? 'пользователем' : 'админом' }}
              </button>
              <button v-if="user.login !== authStore.user?.login" @click="deleteUser(user.id)" class="small danger">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const users = ref([]);
const loading = ref(false);
const error = ref('');

async function fetchUsers() {
  loading.value = true;
  try {
    const res = await api.get('/admin/users'); // эндпоинт нужно добавить на бэкенде
    users.value = res.data;
  } catch (err) {
    error.value = 'Ошибка загрузки пользователей';
  } finally {
    loading.value = false;
  }
}

async function changeRole(userId, newRole) {
  try {
    await api.put(`/admin/users/${userId}/role`, { role: newRole });
    await fetchUsers();
  } catch (err) {
    alert('Не удалось изменить роль');
  }
}

async function deleteUser(userId) {
  if (confirm('Удалить пользователя?')) {
    try {
      await api.delete(`/admin/users/${userId}`);
      await fetchUsers();
    } catch (err) {
      alert('Не удалось удалить');
    }
  }
}

onMounted(fetchUsers);
</script>

<style scoped>
.admin-users { max-width: 1000px; margin: 20px auto; }
.user-table { width: 100%; border-collapse: collapse; }
.user-table th, .user-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
.small { padding: 4px 8px; margin: 0 4px; cursor: pointer; }
.danger { background: #dc3545; color: white; }
</style>