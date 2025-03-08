<!-- src/components/UserCard.vue -->
<template>
    <div class="card">
      <h4>{{ user.name }}</h4>
      <p>Last Update: {{ user.lastUpdate }}</p>
      <div class="button-group">
        <button class="view-btn" @click="viewLocation" title="View Location">
          <i class="fas fa-eye"></i>
        </button>
        <button class="edit-btn" @click="editUser" title="Edit User">
          <i class="fas fa-pen"></i>
        </button>
        <button class="delete-btn" @click="handleDelete" title="Delete User">
          <i class="fas fa-trash"></i>
        </button>
      </div>
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
  
  const emit = defineEmits(['delete'])
  
  const selectUser = inject('selectUser')
  
  const viewLocation = () => {
    selectUser(props.user)
  }
  
  const handleDelete = () => {
    emit('delete')
  }
  
  const editUser = () => {
    // Placeholder for edit functionality - implement as needed
    console.log('Edit user:', props.user.name)
    // You could emit an 'edit' event or open a modal here
  }
  </script>
  
  <style scoped>
  .card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  h4 {
    margin: 0 0 5px 0;
    color: white;
    font-size: 1.1rem;
  }
  
  p {
    margin: 0 0 10px 0;
    font-size: 0.9rem;
    color: #e2e8f0;
  }
  
  .button-group {
    display: flex;
    justify-content: flex-start;
    gap: 10px; /* Space between buttons */
  }
  
  button {
    padding: 8px;
    border: none;
    border-radius: 50%; /* Circular buttons for elegance */
    cursor: pointer;
    font-size: 1rem;
    width: 36px; /* Fixed width for uniformity */
    height: 36px; /* Fixed height for uniformity */
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }
  
  button:hover {
    transform: scale(1.1); /* Slight scale on hover for feedback */
  }
  
  .view-btn {
    background-color: #667eea; /* Matches your theme */
    color: white;
  }
  
  .view-btn:hover {
    background-color: #5a6fd1;
  }
  
  .edit-btn {
    background-color: #f1c40f; /* Yellow for edit */
    color: white;
  }
  
  .edit-btn:hover {
    background-color: #e2b607;
  }
  
  .delete-btn {
    background-color: #ff4444; /* Red for delete */
    color: white;
  }
  
  .delete-btn:hover {
    background-color: #cc3333;
  }
  </style>