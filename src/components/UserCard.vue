<!-- src/components/UserCard.vue -->
<template>
  <div class="user-card">
    <span>{{ user.username }}</span>
    <button @click="$emit('delete')" class="delete-btn">Delete</button>
  </div>
</template>

<script setup>
defineProps({
  user: Object
})
defineEmits(['delete'])
</script>

<style scoped>
.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 10px;
}

span {
  color: white;
}

.delete-btn {
  background: #ff4444;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:hover {
  background: #cc3333;
}
</style>