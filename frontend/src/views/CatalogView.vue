<template>
  <div class="catalog">
    <h1>Каталог периферии</h1>

    <!-- Поиск и фильтры -->
    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск товаров..."
        @keyup.enter="fetchProducts"
      />
      <select v-model="selectedBrand" @change="fetchProducts">
        <option value="">Все бренды</option>
        <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
      </select>
      <input v-model="minPrice" type="number" placeholder="Цена от" min="0" />
      <input v-model="maxPrice" type="number" placeholder="Цена до" min="0" />
      <button @click="fetchProducts">Найти</button>
      <button @click="resetFilters" class="reset-btn">Сбросить</button>
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
const selectedBrand = ref('');
const minPrice = ref('');
const maxPrice = ref('');
const brands = ref([]);
const favoritesStore = useFavoritesStore();

async function fetchProducts() {
  loading.value = true;
  error.value = '';
  try {
    const params = {};
    if (searchQuery.value) params.search = searchQuery.value;
    if (selectedBrand.value) params.brand = selectedBrand.value;
    if (minPrice.value) params.minPrice = minPrice.value;
    if (maxPrice.value) params.maxPrice = maxPrice.value;

    const response = await api.get('/products', { params });
    products.value = response.data;
  } catch (err) {
    error.value = 'Не удалось загрузить товары';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function fetchBrands() {
  try {
    const response = await api.get('/products');
    const all = response.data;
    brands.value = [...new Set(all.map(p => p.brand).filter(Boolean))].sort();
  } catch (err) {
    console.error(err);
  }
}

function resetFilters() {
  searchQuery.value = '';
  selectedBrand.value = '';
  minPrice.value = '';
  maxPrice.value = '';
  fetchProducts();
}

onMounted(async () => {
  await fetchBrands();
  await fetchProducts();
});

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
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}
.filters input,
.filters select {
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  flex: 1;
  min-width: 120px;
}
.filters button {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}
.filters button:hover { background: #369870; }
.reset-btn { background: #888 !important; }
.reset-btn:hover { background: #666 !important; }
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
.brand { color: #666; font-size: 0.9rem; }
.loading, .error, .empty {
  text-align: center;
  margin-top: 50px;
  color: #666;
}
</style>