// src/main.js
import '@fortawesome/fontawesome-free/css/all.min.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import 'modern-css-reset'

// Axios defaults
axios.defaults.baseURL = 'http://localhost:8000'
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

createApp(App)
  .use(router)
  .mount('#app')