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
import axios from 'axios'

const myLocation = ref({ lat: 0, lng: 0 })

onMounted(async () => {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      myLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      try {
        const response = await axios.post('http://localhost:8000/api/locations/', 
          { latitude: myLocation.value.lat, longitude: myLocation.value.lng },
          { headers: { Authorization: `Token ${localStorage.getItem('token')}` } }
        )
        console.log('Location POST Response:', response.data)
      } catch (error) {
        console.error('Location POST Error:', error.response ? error.response.data : error.message)
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