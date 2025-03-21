<!-- src/components/UserCard.vue -->
<template>
  <div class="card">
    <div class="user-row">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="profile-icon">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <h4>{{ user.username || 'Unknown User' }}</h4>
    </div>
    <button class="icon-btn delete-btn" @click="emit('delete', user.id)" title="Stop sharing">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    default: () => ({ id: null, username: '', name: '', shared_with_id: null })
  }
})

const emit = defineEmits(['delete'])
</script>

<style scoped>
.card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s;
}

.card:hover {
  background: rgba(255, 255, 255, 0.2);
}

.user-row {
  display: flex;
  align-items: center;
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

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.delete-btn:hover svg {
  stroke: #ff4444;
}
</style>