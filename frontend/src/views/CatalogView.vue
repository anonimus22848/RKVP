<template>
  <div class="catalog">
    <h1>Каталог периферии</h1>
    <div v-if="loading" class="loading">Загрузка товаров...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <h3>{{ product.name }}</h3>
        <p class="brand">{{ product.brand }}</p>
        <p class="price">{{ product.price }} ₽</p>
        <p class="description">{{ product.description?.slice(0, 80) }}...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';

const products = ref([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const response = await api.get('/products');
    products.value = response.data;
  } catch (err) {
    error.value = 'Не удалось загрузить товары';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.catalog {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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
.loading, .error {
  text-align: center;
  margin-top: 50px;
}
</style>