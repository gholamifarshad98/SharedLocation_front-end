<!-- src/components/AllowUserForm.vue -->
<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <form @submit.prevent="handleSubmit" class="form-container">
        <div class="input-group">
          <label for="username">Allow User by Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter username"
            required
            class="form-input"
            :disabled="loading"
          />
        </div>
        <div class="button-group">
          <button type="submit" :disabled="loading" class="submit-button">
            <span v-if="!loading">Allow</span>
            <span v-else>Loading...</span>
          </button>
          <button type="button" @click="closeModal" class="close-button" :disabled="loading">
            Close
          </button>
        </div>
      </form>
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="success" class="success-message">{{ success }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const emit = defineEmits(['user-allowed', 'close'])

const username = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const response = await axios.post(
      'http://localhost:8000/api/allowed-users/',
      { username: username.value.trim() }, // Trim to avoid whitespace issues
      { headers: { Authorization: `Token ${localStorage.getItem('token')}` } }
    )
    success.value = `User "${username.value}" can now view your location.`
    emit('user-allowed', response.data)
    username.value = '' // Clear input on success
    setTimeout(() => closeModal(), 2000) // Auto-close after 2s
  } catch (err) {
    const errMsg = err.response?.data?.error
    if (errMsg === 'User not found') {
      error.value = `Username "${username.value}" does not exist.`
    } else if (errMsg === 'Cannot allow yourself') {
      error.value = 'You cannot allow yourself to view your own location.'
    } else {
      error.value = errMsg || 'Failed to allow user. Please try again.'
    }
    console.error('Allow User Error:', err.response || err.message)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  if (!loading.value) {
    emit('close')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

label {
  color: white;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.form-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;
}

.form-input::placeholder {
  color: #ccc;
}

.form-input:disabled {
  background: rgba(255, 255, 255, 0.1);
  color: #999;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.submit-button {
  padding: 10px 20px;
  background-color: #ffffff;
  color: #667eea;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: #e2e8f0;
}

.submit-button:disabled {
  background-color: #999;
  color: #666;
  cursor: not-allowed;
}

.close-button {
  padding: 10px 20px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.close-button:hover:not(:disabled) {
  background-color: #cc3333;
}

.close-button:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.error-message {
  color: #ff4444;
  margin-top: 10px;
  font-size: 0.9rem;
  text-align: center;
}

.success-message {
  color: #00cc00;
  margin-top: 10px;
  font-size: 0.9rem;
  text-align: center;
}
</style>