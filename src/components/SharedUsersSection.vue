<!-- src/components/SharedUsersSection.vue -->
<template>
    <div class="section">
      <h3>Shared Users</h3>
      <user-card
        v-for="user in sharedUsers"
        :key="user.id"
        :user="user"
        @delete="deleteUser(user.id)"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import UserCard from './UserCard.vue'
  import axios from 'axios'
  
  const sharedUsers = ref([])
  
  onMounted(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/shared-users/', {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
      })
      console.log('Shared Users Response:', response.data)  // Debug log
      sharedUsers.value = response.data.map(user => ({
        id: user.id,
        name: user.shared_with.username,
        lastUpdate: user.last_update,
        location: { lat: 0, lng: 0 }  // Fetch actual location separately if needed
      }))
    } catch (error) {
      console.error('Shared Users Error:', error.response ? error.response.data : error.message)
    }
  })
  
  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:8000/api/shared-users/${id}/`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    })
    sharedUsers.value = sharedUsers.value.filter(user => user.id !== id)
  }
  </script>
  
  <style scoped>
  .section {
    margin-bottom: 20px;
  }
  h3 {
    color: white;
    margin-bottom: 10px;
  }
  </style>