<template>
  <div v-if="message" class="error-box">
    <span class="error-icon">⚠️</span>
    <span>{{ message }}</span>
    <button @click="$emit('dismiss')" class="dismiss-btn">✕</button>
  </div>
</template>

<script setup>
defineProps({ message: String });
defineEmits(['dismiss']);
</script>

<style scoped>
.error-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff3f3;
  border: 1px solid #f5c2c2;
  color: #c0392b;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
}
.error-icon { font-size: 1.2rem; }
.dismiss-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: #c0392b;
  cursor: pointer;
  font-size: 1rem;
}
</style>