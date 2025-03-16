<!-- src/components/AllowedUserCard.vue -->
<template>
  <div class="card">
    <h4>{{ user.allowed_to.username }}</h4>
    <p>Last Viewed: {{ user.last_viewed || 'Never' }}</p>
    <div class="button-group">
      <button class="delete-btn" @click="handleDelete" title="Remove Permission">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete'])

const handleDelete = () => {
  emit('delete', props.user.id)
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
  gap: 10px;
}

button {
  padding: 8px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  transform: scale(1.1);
}

.delete-btn {
  background-color: #ff4444;
  color: white;
}

.delete-btn:hover {
  background-color: #cc3333;
}
</style>