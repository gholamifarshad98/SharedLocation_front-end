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
  import { ref } from 'vue'
  import AllowedUserCard from './AllowedUserCard.vue'
  
  const allowedUsers = ref([
    { id: 1, name: 'Alice', lastViewed: '2025-03-06 09:00' },
    { id: 2, name: 'Bob', lastViewed: '2025-03-06 10:15' }
  ])
  
  const deleteUser = (id) => {
    allowedUsers.value = allowedUsers.value.filter(user => user.id !== id)
  }
  
  const addPermission = () => {
    // Simulate adding a new user (you'd replace this with actual logic)
    const newUser = {
      id: Date.now(),
      name: prompt('Enter user name:'),
      lastViewed: new Date().toISOString().slice(0, 16).replace('T', ' ')
    }
    if (newUser.name) {
      allowedUsers.value.push(newUser)
    }
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