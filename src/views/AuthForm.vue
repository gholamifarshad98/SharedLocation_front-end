<!-- src/views/AuthForm.vue -->
<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2>{{ mode === 'login' ? 'Welcome Back' : 'Create Account' }}</h2>
        <p>{{ mode === 'login' ? 'Sign in to continue' : 'Get started with your account' }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="input-group">
          <label for="phone">Phone Number</label>
          <input
            id="phone"
            v-model="form.phone_number"
            type="tel"
            placeholder="+1234567890"
            required
          />
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" :disabled="loading" class="auth-button">
          <span v-if="!loading">{{ mode === 'login' ? 'Sign In' : 'Sign Up' }}</span>
          <span v-else>Loading...</span>
        </button>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>

      <div class="auth-footer">
        <p>
          {{ mode === 'login' ? "Don't have an account?" : "Already have an account?" }}
          <router-link :to="mode === 'login' ? '/register' : '/login'" class="auth-link">
            {{ mode === 'login' ? 'Sign Up' : 'Sign In' }}
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: value => ['login', 'register'].includes(value)
  }
})

const router = useRouter()
const loading = ref(false)
const error = ref('')
const form = ref({
  phone_number: '',
  password: ''
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const url = props.mode === 'login' 
      ? 'http://localhost:8000/api/login/' 
      : 'http://localhost:8000/api/register/'

    const response = await axios.post(url, form.value)
    
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('phone', response.data.phone_number)
    router.push('/main') // Updated from '/home' to '/main'
    
  } catch (err) {
    error.value = err.response?.data?.error || 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 26px);
  margin: 13px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
}

.auth-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  animation: fadeIn 0.5s ease-in-out;
  max-height: 100%;
  overflow-y: auto;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h2 {
  font-size: 1.75rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #64748b;
  font-size: 0.9rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-group input:focus {
  border-color: #667eea;
  outline: none;
}

.auth-button {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

.auth-button:hover {
  background: #5a6fd1;
}

.auth-button:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

.error-message {
  color: #ff4444;
  text-align: center;
  margin-top: 1rem;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #64748b;
}

.auth-link {
  color: #667eea;
  font-weight: 500;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>