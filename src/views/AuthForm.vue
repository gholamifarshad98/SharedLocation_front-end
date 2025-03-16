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
          <label for="username">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            placeholder="username"
            required
            :disabled="loading"
          />
        </div>
        <div class="input-group" v-if="mode === 'register'">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="email@example.com"
            required
            :disabled="loading"
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
            :disabled="loading"
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
  username: '',
  email: '',
  password: ''
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  try {
    const url = props.mode === 'login' 
      ? 'http://localhost:8000/api/login/' 
      : 'http://localhost:8000/api/register/'
    const data = props.mode === 'login' 
      ? { username: form.value.username, password: form.value.password }
      : form.value  // Send email only for register
    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    console.log('Auth Response:', response.data)  // Debug log
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('username', response.data.username)
    localStorage.setItem('userId', response.data.user_id.toString())  // Store user_id as string
    router.push('/main')
  } catch (err) {
    console.error('Auth Error:', err.response ? err.response.data : err.message)  // Debug log
    const errorMsg = err.response?.data?.error || 
                     (err.response?.status === 400 ? 'Invalid input. Please check your details.' : 
                     'An error occurred. Please try again.')
    error.value = errorMsg
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

.input-group input:disabled {
  background: #f0f2f5;
  cursor: not-allowed;
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

.auth-button:hover:not(:disabled) {
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
  font-size: 0.9rem;
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