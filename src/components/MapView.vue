<!-- src/components/MapView.vue -->
<template>
    <div class="map-container">
      <h2>{{ selectedUser ? selectedUser.name : 'Select a user' }}</h2>
      <div ref="map" class="map"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import 'leaflet/dist/leaflet.css'
  import L from 'leaflet'
  
  const props = defineProps({
    selectedUser: {
      type: Object,
      default: null
    }
  })
  
  const map = ref(null)
  let leafletMap = null
  
  onMounted(() => {
    leafletMap = L.map(map.value).setView([0, 0], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(leafletMap)
  })
  
  watch(() => props.selectedUser, (newUser) => {
    if (newUser && newUser.location) {
      leafletMap.setView([newUser.location.lat, newUser.location.lng], 13)
      L.marker([newUser.location.lat, newUser.location.lng])
        .addTo(leafletMap)
        .bindPopup(newUser.name)
        .openPopup()
    }
  })
  </script>
  
  <style scoped>
  .map-container {
    flex: 1;
    padding: 20px;
    background: #f0f2f5;
  }
  .map {
    height: 80vh;
    width: 100%;
  }
  h2 {
    margin-bottom: 20px;
    color: #2c3e50;
  }
  </style>