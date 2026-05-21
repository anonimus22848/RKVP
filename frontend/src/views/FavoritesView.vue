<template>
  <div class="favorites">
    <h1>Избранное</h1>
    <div v-if="favoritesStore.items.length === 0" class="empty">
      <p>У вас пока нет избранных товаров</p>
      <router-link to="/catalog">Перейти в каталог</router-link>
    </div>
    <div class="products-grid">
      <div v-for="product in favoritesStore.items" :key="product.id" class="product-card">
        <img
          v-if="product.image_url"
          :src="product.image_url"
          class="product-img"
          alt=""
        />
        <div v-else class="product-img-placeholder">📦</div>
        <router-link :to="`/product/${product.id}`">
          <h3>{{ product.name }}</h3>
        </router-link>
        <p class="brand">{{ product.brand }}</p>
        <p class="price">{{ product.price }} ₽</p>
        <button @click="favoritesStore.removeFavorite(product.id)" class="remove">Удалить</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFavoritesStore } from '@/stores/favorites';
import { onMounted } from 'vue';

const favoritesStore = useFavoritesStore();
onMounted(() => favoritesStore.fetchFavorites());
</script>

<style scoped>
.favorites { max-width: 1200px; margin: 20px auto; padding: 20px; }
.empty { text-align: center; margin-top: 40px; }
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
.product-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; }
.product-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
}
.product-img-placeholder {
  width: 100%;
  height: 160px;
  background: #f5f5f5;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin-bottom: 10px;
}
.price { font-size: 1.2rem; font-weight: bold; color: #42b983; }
.brand { color: #666; font-size: 0.9rem; }
.remove { background: #dc3545; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px; }
</style>