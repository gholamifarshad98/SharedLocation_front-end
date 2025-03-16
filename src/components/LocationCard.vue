<!-- src/components/LocationCard.vue -->
<template>
  <div class="card" v-if="user">
    <div class="user-row">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="profile-icon">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <h4>{{ user.username || 'Unknown User' }}</h4>
    </div>
    <p class="last-updated">Last Updated: {{ user.last_updated ? formatDate(user.last_updated) : 'Never' }}</p>
    <div class="button-row">
      <button class="icon-btn view-btn" @click="handleViewClick" title="View on map">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </button>
      <button class="icon-btn update-btn" @click="updateLocation" title="Update to my location">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 4v6h-6"></path>
          <path d="M1 20v-6h6"></path>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import axios from 'axios'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({ 
      username: '', 
      name: '', 
      id: null, 
      last_updated: null 
    })
  }
})

// Define emits to communicate with parent component
const emit = defineEmits(['location-updated'])

const selectUser = inject('selectUser')

const handleViewClick = () => {
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
    console.log('Location Updated for User:', props.user.username, response.data)
    
    // Instead of mutating the prop, emit an event with the updated data
    emit('location-updated', {
      id: props.user.id,
      last_updated: response.data.last_updated,
      latitude,
      longitude
    })
  } catch (error) {
    console.error('Update Location Error:', error.response ? error.response.data : error.message)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  return date.toLocaleString()
}
</script>

<style scoped>
.card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  transition: background 0.3s;
}

.card:hover {
  background: rgba(255, 255, 255, 0.2);
}

.user-row {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.profile-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

h4 {
  margin: 0;
  color: white;
  font-size: 1.1rem;
}

.last-updated {
  margin: 0 0 10px 0;
  font-size: 0.9rem;
  color: #b0b7c3;
}

.button-row {
  display: flex;
  gap: 10px;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn:hover svg {
  stroke: #5a6fd1;
}

.update-btn:hover svg {
  stroke: #5a6fd1;
}
</style>