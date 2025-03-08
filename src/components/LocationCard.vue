<!-- src/components/LocationCard.vue -->
<template>
    <div class="card" @click="handleClick">
      <h4>{{ user.name }}</h4>
      <p>Click to view location</p>
    </div>
  </template>
  
  <script setup>
  import { inject } from 'vue'
  
  const props = defineProps({
    user: {
      type: Object,
      required: true
    }
  })
  
  const selectUser = inject('selectUser')
  
  const handleClick = () => {
    selectUser(props.user)
  }
  </script>
  
  <style scoped>
  .card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 15px;
    cursor: pointer;
    transition: background 0.3s;
  }
  .card:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  h4 {
    margin: 0 0 5px 0;
    color: white;
  }
  p {
    margin: 0;
    font-size: 0.9rem;
    color: #e2e8f0;
  }
  </style>