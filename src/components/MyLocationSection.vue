<!-- src/components/MyLocationSection.vue -->
<template>
    <div class="section">
      <h3>My Location</h3>
      <location-card :user="{ name: 'Me', location: myLocation }" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import LocationCard from './LocationCard.vue'
  import { inject } from 'vue'
  
  // eslint-disable-next-line no-unused-vars
  const selectUser = inject('selectUser') // Injected for child component use
  const myLocation = ref({ lat: 0, lng: 0 })
  
  onMounted(() => {
    // Simulate getting user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        myLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      },
      (error) => console.error('Error getting location:', error)
    )
  })
  </script>
  
  <style scoped>
  .section {
    margin-bottom: 20px;
  }
  h3 {
    color: white;
    margin-bottom: 10px;
  }
  </style>