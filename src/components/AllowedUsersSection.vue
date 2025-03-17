<!-- src/components/AllowedUsersSection.vue -->
<template>
  <div class="allowed-users-section">
    <h3>Allowed User Locations</h3>
    <div v-if="users.length === 0" class="empty-message">
      No users have allowed you to view their locations yet.
    </div>
    <location-card
      v-for="user in users"
      :key="user.id"
      :user="user"
    />
  </div>
</template>

<script setup>
defineProps({
  users: {
    type: Array,
    default: () => []
  }
})
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

.empty-message {
  color: #e2e8f0;
  font-size: 0.9rem;
  text-align: center;
}
</style>