<!-- src/components/AllowedUserCard.vue -->
<template>
    <div class="card">
      <h4>{{ user.name }}</h4>
      <p>Last Viewed: {{ user.lastViewed }}</p>
      <button @click="handleDelete">Delete</button>
    </div>
  </template>
  
  <script setup>
  // eslint-disable-next-line no-unused-vars
  const props = defineProps({
    user: {
      type: Object,
      required: true
    }
  })
  
  const emit = defineEmits(['delete'])
  
  const handleDelete = () => {
    emit('delete')
  }
  </script>
  
  <style scoped>
  .card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
  }
  h4 {
    margin: 0 0 5px 0;
    color: white;
  }
  p {
    margin: 0 0 10px 0;
    font-size: 0.9rem;
    color: #e2e8f0;
  }
  button {
    padding: 5px 10px;
    background: #ff4444;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>