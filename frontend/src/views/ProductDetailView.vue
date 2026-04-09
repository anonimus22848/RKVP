<template>
  <div class="product-detail">
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <h1>{{ product.name }}</h1>
      <p class="brand">{{ product.brand }}</p>
      <p class="price">{{ product.price }} ₽</p>
      <p class="description">{{ product.description }}</p>
      <button @click="addToCart" class="add-to-cart">Добавить в корзину</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api';
import { useCartStore } from '@/stores/cart';

const route = useRoute();
const cartStore = useCartStore();
const product = ref(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const id = route.params.id;
    const response = await api.get(`/products/${id}`);
    product.value = response.data;
  } catch (err) {
    error.value = 'Товар не найден';
  } finally {
    loading.value = false;
  }
});

function addToCart() {
  cartStore.addItem({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
  });
  alert('Товар добавлен в корзину');
}
</script>

<style scoped>
.product-detail {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #42b983;
}
.add-to-cart {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
}
</style>