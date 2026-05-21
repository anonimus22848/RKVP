<template>
  <div class="product-detail">
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="product-layout">
      <div class="product-image">
        <img
          v-if="product.image_url"
          :src="product.image_url"
          alt=""
        />
        <div v-else class="img-placeholder">📦</div>
      </div>
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <p class="brand">{{ product.brand }}</p>
        <p class="price">{{ product.price }} ₽</p>
        <p class="description">{{ product.description }}</p>
        <div class="actions">
          <button @click="addToCart" class="add-to-cart">Добавить в корзину</button>
          <button @click="toggleFavorite(product)" class="favorite-btn">
            {{ favoritesStore.isFavorite(product.id) ? '❤️ В избранном' : '🤍 В избранное' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api';
import { useCartStore } from '@/stores/cart';
import { useFavoritesStore } from '@/stores/favorites';

const route = useRoute();
const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();
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

async function toggleFavorite(p) {
  if (favoritesStore.isFavorite(p.id)) {
    await favoritesStore.removeFavorite(p.id);
  } else {
    await favoritesStore.addFavorite(p);
  }
}
</script>

<style scoped>
.product-detail {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
}
.product-layout {
  display: flex;
  gap: 40px;
}
.product-image {
  flex-shrink: 0;
  width: 350px;
}
.product-image img {
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #ddd;
}
.img-placeholder {
  width: 100%;
  height: 300px;
  background: #f5f5f5;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
}
.product-info { flex: 1; }
.brand { color: #666; }
.price { font-size: 2rem; font-weight: bold; color: #42b983; }
.description { color: #444; line-height: 1.6; margin: 16px 0; }
.actions { display: flex; gap: 12px; flex-wrap: wrap; }
.add-to-cart {
  background: #42b983;
  color: white;
  border: none;
  padding: 12px 24px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 1rem;
}
.favorite-btn {
  background: white;
  border: 1px solid #ddd;
  padding: 12px 24px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 1rem;
}
.loading, .error { text-align: center; margin-top: 60px; }

@media (max-width: 480px) {
  .product-layout { flex-direction: column; }
  .product-image { width: 100%; }
}
</style>