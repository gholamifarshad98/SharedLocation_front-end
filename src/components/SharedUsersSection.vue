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
  import { ref } from 'vue'
  import UserCard from './UserCard.vue'
  
  const sharedUsers = ref([
    { id: 1, name: 'John', lastUpdate: '2025-03-06 10:00', location: { lat: 40.7128, lng: -74.0060 } },
    { id: 2, name: 'Jane', lastUpdate: '2025-03-06 11:30', location: { lat: 34.0522, lng: -118.2437 } }
  ])
  
  const deleteUser = (id) => {
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