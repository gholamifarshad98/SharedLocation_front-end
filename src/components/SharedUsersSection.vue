<!-- src/components/SharedUsersSection.vue -->
<template>
  <div class="shared-users-section">
    <h3>Trusted Users</h3>
    <div v-if="users.length === 0" class="empty-message">
      You haven't shared your location with any users yet.
    </div>
    <div v-else>
      <user-card
        v-for="user in users"
        :key="user.id"
        :user="user"
        @delete="deleteUser(user.id)"
      />
    </div>
    <button @click="emit('update:show-allow-modal', true)" class="allow-button">Add Trusted User</button>
    <allow-user-form 
      v-if="showAllowModal" 
      @user-allowed="emit('user-allowed')" 
      @close="emit('update:show-allow-modal', false)" 
    />
  </div>
</template>

<script setup>
import UserCard from './UserCard.vue'
import AllowUserForm from './AllowUserForm.vue'
import axios from 'axios'

defineProps({
  users: {
    type: Array,
    default: () => []
  },
  showAllowModal: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['refresh', 'update:show-allow-modal', 'user-allowed'])

const deleteUser = async (id) => {
  try {
    console.log('Deleting Trusted User with ID:', id)
    await axios.delete(`http://localhost:8000/api/allowed-users/${id}/`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    })
    console.log(`Deleted trusted user with id ${id}`)
    emit('refresh')
  } catch (error) {
    console.error('Delete Trusted User Error:', error.response ? error.response.data : error.message)
  }
}
</script>

<style scoped>
.shared-users-section {
  padding: 15px;
}

h3 {
  color: white;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.empty-message {
  color: #e2e8f0;
  font-size: 0.9rem;
  text-align: center;
}

.allow-button {
  padding: 10px 20px;
  background-color: #ffffff;
  color: #667eea;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  margin-top: 20px;
  width: 100%;
}

.allow-button:hover {
  background-color: #e2e8f0;
}
</style>