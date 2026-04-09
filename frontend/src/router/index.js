import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import ProfileView from '@/views/ProfileView.vue';
import { useAuthStore } from '@/stores/auth';

const routes = [
  { path: '/', redirect: '/auth/login' },
  { path: '/auth/login', component: LoginView, meta: { guestOnly: true } },
  { path: '/auth/register', component: RegisterView, meta: { guestOnly: true } },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login');
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    next('/profile');
  } else {
    next();
  }
});

export default router;