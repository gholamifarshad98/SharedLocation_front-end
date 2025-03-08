// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import AuthForm from '../views/AuthForm.vue'
import MainView from '../views/MainView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/register',
    name: 'Register',
    component: AuthForm,
    props: { mode: 'register' }
  },
  {
    path: '/login',
    name: 'Login',
    component: AuthForm,
    props: { mode: 'login' }
  },
  {
    path: '/main',
    name: 'MainView',
    component: MainView
    // Removed meta: { requiresAuth: true } to allow direct access
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard - modified to only protect specific routes if needed
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  
  // Only redirect to login if explicitly required and not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router