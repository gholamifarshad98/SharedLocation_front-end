<!-- src/components/AllowedUsersSection.vue -->
<template>
    <div class="section">
      <h3>Allowed Users</h3>
      <allowed-user-card
        v-for="user in allowedUsers"
        :key="user.id"
        :user="user"
        @delete="deleteUser(user.id)"
      />
      <button class="add-button" @click="addPermission">Add Permission</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import AllowedUserCard from './AllowedUserCard.vue'
  import axios from 'axios'
  
  const allowedUsers = ref([])
  
  onMounted(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/allowed-users/', {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
      })
      console.log('Allowed Users Response:', response.data)  // Debug log
      allowedUsers.value = response.data
    } catch (error) {
      console.error('Allowed Users Error:', error.response ? error.response.data : error.message)
    }
  })
  
  const addPermission = async () => {
    const username = prompt('Enter username to allow:')
    if (username) {
      const response = await axios.post('http://localhost:8000/api/allowed-users/', 
        { username },
        { headers: { Authorization: `Token ${localStorage.getItem('token')}` } }
      )
      allowedUsers.value.push(response.data)
    }
  }
  
  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:8000/api/allowed-users/${id}/`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    })
    allowedUsers.value = allowedUsers.value.filter(user => user.id !== id)
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
  .add-button {
    width: 100%;
    padding: 10px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  .add-button:hover {
    background: #5a6fd1;
  }
  </style>