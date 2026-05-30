<template>
  <div class="admin-products">
    <h1>Управление товарами</h1>

    <div class="add-form">
      <h2>Добавить новый товар</h2>
      <form @submit.prevent="createProduct">
        <input v-model="newProduct.name" placeholder="Название*" required />
        <input v-model="newProduct.brand" placeholder="Бренд" />
        <input v-model="newProduct.price" type="number" placeholder="Цена*" required />
        <textarea v-model="newProduct.description" placeholder="Описание"></textarea>
        <input v-model="newProduct.image_url" placeholder="URL картинки (https://...)" />
        <div v-if="newProduct.image_url" class="image-preview">
          <img :src="newProduct.image_url" alt="Превью" @error="e => e.target.style.display='none'" />
        </div>
        <button type="submit">Добавить</button>
        <p v-if="createError" class="error">{{ createError }}</p>
      </form>
    </div>

    <div class="products-list">
      <h2>Существующие товары</h2>
      <div v-if="loading">Загрузка...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div v-for="product in products" :key="product.id" class="product-row">
          <img v-if="product.image_url" :src="product.image_url" class="thumb" alt="" />
          <div v-else class="thumb-placeholder">нет фото</div>
          <div class="product-info">
            <strong>{{ product.name }}</strong> — {{ product.brand }} — {{ product.price }} ₽
          </div>
          <div class="product-actions">
            <button @click="editProduct(product)" class="edit">✏️</button>
            <button @click="deleteProduct(product.id)" class="delete">🗑️</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно редактирования -->
    <div v-if="editingProduct" class="modal">
      <div class="modal-content">
        <h3>Редактировать товар</h3>
        <input v-model="editForm.name" placeholder="Название" />
        <input v-model="editForm.brand" placeholder="Бренд" />
        <input v-model="editForm.price" type="number" placeholder="Цена" />
        <textarea v-model="editForm.description" placeholder="Описание"></textarea>
        <input v-model="editForm.image_url" placeholder="URL картинки (https://...)" />
        <div v-if="editForm.image_url" class="image-preview">
          <img :src="editForm.image_url" alt="Превью" @error="e => e.target.style.display='none'" />
        </div>
        <button @click="updateProduct">Сохранить</button>
        <button @click="editingProduct = null">Отмена</button>
        <p v-if="updateError" class="error">{{ updateError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';

const products = ref([]);
const loading = ref(false);
const error = ref('');
const createError = ref('');
const updateError = ref('');

const newProduct = ref({ name: '', brand: '', price: '', description: '', image_url: '' });
const editingProduct = ref(null);
const editForm = ref({ name: '', brand: '', price: '', description: '', image_url: '' });

async function fetchProducts() {
  loading.value = true;
  try {
    const res = await api.get('/products');
    products.value = res.data;
  } catch (err) {
    error.value = 'Не удалось загрузить товары';
  } finally {
    loading.value = false;
  }
}

async function createProduct() {
  createError.value = '';
  try {
    await api.post('/products', newProduct.value);
    newProduct.value = { name: '', brand: '', price: '', description: '', image_url: '' };
    await fetchProducts();
  } catch (err) {
    createError.value = err.response?.data?.error || 'Ошибка создания';
  }
}

function editProduct(product) {
  editingProduct.value = product;
  editForm.value = { ...product };
}

async function updateProduct() {
  updateError.value = '';
  try {
    await api.put(`/products/${editingProduct.value.id}`, editForm.value);
    editingProduct.value = null;
    await fetchProducts();
  } catch (err) {
    updateError.value = err.response?.data?.error || 'Ошибка обновления';
  }
}

async function deleteProduct(id) {
  if (confirm('Удалить товар?')) {
    try {
      await api.delete(`/products/${id}`);
      await fetchProducts();
    } catch (err) {
      alert('Не удалось удалить');
    }
  }
}

onMounted(fetchProducts);
</script>

<style scoped>
.admin-products {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}
.add-form, .products-list {
  margin-bottom: 40px;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
}
input, textarea {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
button {
  margin-right: 10px;
  padding: 6px 12px;
  cursor: pointer;
}
.image-preview {
  margin-bottom: 10px;
}
.image-preview img {
  max-width: 200px;
  max-height: 150px;
  border-radius: 6px;
  border: 1px solid #ddd;
  object-fit: cover;
}
.product-row {
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #eee;
  padding: 8px 0;
}
.thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
  flex-shrink: 0;
}
.thumb-placeholder {
  width: 50px;
  height: 50px;
  background: #f0f0f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  color: #999;
  flex-shrink: 0;
}
.product-info { flex: 1; }
.product-actions button { margin-left: 8px; }
.modal {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 340px;
  max-height: 90vh;
  overflow-y: auto;
}
.error { color: red; }
</style>