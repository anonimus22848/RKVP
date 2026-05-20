<template>
  <div class="catalog">
    <h1>Каталог периферии</h1>

    <!-- Поиск -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск товаров..."
        @keyup.enter="fetchProducts"
      />
      <button @click="fetchProducts">Найти</button>
    </div>

    <div v-if="loading" class="loading">Загрузка товаров...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="products.length === 0" class="empty">Товары не найдены</div>
    <div v-else class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <router-link :to="`/product/${product.id}`">
          <h3>{{ product.name }}</h3>
        </router-link>
        <p class="brand">{{ product.brand }}</p>
        <p class="price">{{ product.price }} ₽</p>
        <p class="description">{{ product.description?.slice(0, 80) }}...</p>
        <button @click="toggleFavorite(product)" class="favorite-btn">
          {{ favoritesStore.isFavorite(product.id) ? '❤️' : '🤍' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';
import { useFavoritesStore } from '@/stores/favorites';

const products = ref([]);
const loading = ref(true);
const error = ref('');
const searchQuery = ref('');
const favoritesStore = useFavoritesStore();

async function fetchProducts() {
  loading.value = true;
  error.value = '';
  try {
    const params = searchQuery.value ? { search: searchQuery.value } : {};
    const response = await api.get('/products', { params });
    products.value = response.data;
  } catch (err) {
    error.value = 'Не удалось загрузить товары';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchProducts);

async function toggleFavorite(product) {
  if (favoritesStore.isFavorite(product.id)) {
    await favoritesStore.removeFavorite(product.id);
  } else {
    await favoritesStore.addFavorite(product);
  }
}
</script>

<style scoped>
.catalog {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}
.search-bar input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}
.search-bar button {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}
.search-bar button:hover {
  background: #369870;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: #fff;
  transition: 0.2s;
}
.product-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #42b983;
}
.brand {
  color: #666;
  font-size: 0.9rem;
}
.loading, .error, .empty {
  text-align: center;
  margin-top: 50px;
  color: #666;
}
</style>