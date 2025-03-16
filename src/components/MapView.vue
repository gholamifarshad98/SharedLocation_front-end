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
import axios from 'axios'

const props = defineProps({
  selectedUser: { type: Object, default: null }
})

const map = ref(null)
let leafletMap = null
const markers = ref([])

onMounted(() => {
  if (!map.value) {
    console.error('Map container not found')
    return
  }
  leafletMap = L.map(map.value).setView([0, 0], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(leafletMap)
})

const fetchUserLocation = async (userId) => {
  if (!leafletMap) {
    console.error('Leaflet map not initialized')
    return
  }
  try {
    const response = await axios.get(`http://localhost:8000/api/locations/${userId}/`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    })
    console.log('User Location Response:', response.data)
    if (response.data.length > 0) {
      const latestLocation = response.data[0]
      leafletMap.setView([latestLocation.latitude, latestLocation.longitude], 13)
      markers.value.forEach(marker => marker.remove())
      markers.value = []
      const marker = L.marker([latestLocation.latitude, latestLocation.longitude])
        .addTo(leafletMap)
        .bindPopup(`${latestLocation.user.username}<br>Last Updated: ${latestLocation.last_updated}`)
        .openPopup()
      markers.value.push(marker)
    } else {
      console.warn('No location data available for user:', userId)
      leafletMap.setView([0, 0], 2) // Reset to world view
    }
  } catch (error) {
    console.error('Fetch Location Error:', error.response ? error.response.data : error.message)
  }
}

watch(() => props.selectedUser, (newUser) => {
  if (newUser && newUser.id) {
    fetchUserLocation(newUser.id)
  }
}, { immediate: true })

defineExpose({ fetchUserLocation })
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