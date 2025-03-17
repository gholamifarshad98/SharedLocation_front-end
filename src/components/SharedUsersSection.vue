<!-- src/components/SharedUsersSection.vue -->
<template>
  <div class="shared-users-section">
    <h3>Shared Users</h3>
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
  </div>
</template>

<script setup>
import UserCard from './UserCard.vue'
import axios from 'axios'

defineProps({
  users: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['refresh'])

const deleteUser = async (id) => {
  try {
    await axios.delete(`http://localhost:8000/api/shared-users/${id}/`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    })
    console.log(`Deleted shared user with id ${id}`)
    emit('refresh') // Tell SidePanel to re-fetch
  } catch (error) {
    console.error('Delete Shared User Error:', error.response ? error.response.data : error.message)
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
</style>