<!-- src/components/AllowedUsersSection.vue -->
<template>
  <div class="allowed-users-section">
    <h3>Allowed Users</h3>
    <button class="add-btn" @click="showForm = true">Add Permission</button>
    <allow-user-form
      v-if="showForm"
      @user-allowed="addAllowedUser"
      @close="showForm = false"
    />
    <div v-if="allowedUsers.length === 0" class="empty-message">
      No users allowed yet.
    </div>
    <allowed-user-card
      v-for="user in allowedUsers"
      :key="user.id"
      :user="user"
      @delete="deleteUser"
    ></allowed-user-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AllowedUserCard from './AllowedUserCard.vue'
import AllowUserForm from './AllowUserForm.vue'
import axios from 'axios'

const allowedUsers = ref([])
const showForm = ref(false)

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/allowed-users/', {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    })
    console.log('Allowed Users Response:', response.data)
    allowedUsers.value = response.data
  } catch (error) {
    console.error('Allowed Users Error:', error.response ? error.response.data : error.message)
  }
})

const addAllowedUser = (newUser) => {
  allowedUsers.value.push(newUser)
  showForm.value = false  // Close form on success
}

const deleteUser = async (id) => {
  try {
    await axios.delete(`http://localhost:8000/api/allowed-users/${id}/`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    })
    allowedUsers.value = allowedUsers.value.filter(user => user.id !== id)
  } catch (error) {
    console.error('Delete User Error:', error.response ? error.response.data : error.message)
  }
}
</script>

<style scoped>
.allowed-users-section {
  padding: 15px;
}

h3 {
  color: white;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.add-btn {
  padding: 10px 20px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  margin-bottom: 15px;
}

.add-btn:hover {
  background-color: #5a6fd1;
}

.empty-message {
  color: #e2e8f0;
  font-size: 0.9rem;
  text-align: center;
}
</style>