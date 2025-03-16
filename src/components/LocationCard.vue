<!-- src/components/LocationCard.vue -->
<template>
  <div class="card" v-if="user">
    <div class="card-content" @click="handleClick">
      <h4>{{ user.name || 'Unnamed User' }}</h4>
      <p>Click to view location</p>
    </div>
    <button class="update-btn" @click.stop="updateLocation" title="Update to my location">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import axios from 'axios'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({ name: '', id: null }) // Default to avoid undefined
  }
})

const selectUser = inject('selectUser')

const handleClick = () => {
  if (props.user.id) {
    selectUser(props.user)
  } else {
    console.warn('No user ID available to select')
  }
}

const updateLocation = async () => {
  try {
    if (!navigator.geolocation) {
      throw new Error('Geolocation not supported')
    }
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    const { latitude, longitude } = position.coords
    const response = await axios.post(
      'http://localhost:8000/api/locations/',
      { latitude, longitude },
      { headers: { Authorization: `Token ${localStorage.getItem('token')}` } }
    )
    console.log('Location Updated for User:', props.user.name, response.data)
    // Optionally update the user prop or notify parent
  } catch (error) {
    console.error('Update Location Error:', error.response ? error.response.data : error.message)
  }
}
</script>

<style scoped>
.card {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card:hover {
  background: rgba(255, 255, 255, 0.2);
}

.card-content {
  flex: 1;
}

h4 {
  margin: 0 0 5px 0;
  color: white;
}

p {
  margin: 0;
  font-size: 0.9rem;
  color: #e2e8f0;
}

.update-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
}

.update-btn:hover {
  opacity: 0.8;
}
</style>