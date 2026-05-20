import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import ProfileView from '@/views/ProfileView.vue';
import CatalogView from '@/views/CatalogView.vue';
import ProductDetailView from '@/views/ProductDetailView.vue';
import CartView from '@/views/CartView.vue';
import AdminProductsView from '@/views/AdminProductsView.vue';
import FavoritesView from '@/views/FavoritesView.vue';
import AdminUsersView from '@/views/AdminUsersView.vue';

const routes = [
  { path: '/', redirect: '/catalog' },
  { path: '/auth/login', component: LoginView, meta: { guestOnly: true } },
  { path: '/auth/register', component: RegisterView, meta: { guestOnly: true } },
  { path: '/catalog', component: CatalogView },
  { path: '/product/:id', component: ProductDetailView },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/cart', component: CartView, meta: { requiresAuth: true } },
  { path: '/favorites', component: FavoritesView, meta: { requiresAuth: true } },
  { path: '/admin/products', component: AdminProductsView, meta: { requiresAuth: true, adminOnly: true } },
  { path: '/admin/users', component: AdminUsersView, meta: { requiresAuth: true, adminOnly: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login');
  } else if (to.meta.adminOnly && authStore.user?.role !== 'admin') {
    next('/profile');
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    next('/profile');
  } else {
    next();
  }
});

export default router;