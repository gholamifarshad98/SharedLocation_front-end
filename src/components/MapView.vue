<!-- src/components/MapView.vue -->
<template>
  <div class="map-container">
    <h2>{{ selectedUser ? selectedUser.name : 'Select a user' }}</h2>
    <div ref="map" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, inject, onUnmounted } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import axios from 'axios'

const props = defineProps({
  selectedUser: { type: Object, default: null }
})

const map = ref(null)
const mapRef = inject('mapRef')
const markers = ref([])

const customIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

onMounted(() => {
  if (!map.value) {
    console.error('Map container not found')
    return
  }
  mapRef.value = L.map(map.value).setView([0, 0], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapRef.value)
})

const fetchUserLocation = async (userId) => {
  if (!mapRef.value) {
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
      mapRef.value.setView([latestLocation.latitude, latestLocation.longitude], 13)
      // Safely remove markers
      markers.value.forEach(marker => {
        if (marker && mapRef.value.hasLayer(marker)) {
          marker.remove()
        }
      })
      markers.value = []
      const marker = L.marker([latestLocation.latitude, latestLocation.longitude], { icon: customIcon })
        .addTo(mapRef.value)
        .bindPopup(`${latestLocation.user.username}<br>Last Updated: ${latestLocation.last_updated}`)
        .openPopup()
      markers.value.push(marker)
    } else {
      console.warn('No location data available for user:', userId)
      mapRef.value.setView([0, 0], 2)
      markers.value.forEach(marker => {
        if (marker && mapRef.value.hasLayer(marker)) {
          marker.remove()
        }
      })
      markers.value = []
    }
  } catch (error) {
    console.error('Fetch Location Error:', error.response ? error.response.data : error.message)
  }
}

watch(() => props.selectedUser, (newUser) => {
  if (newUser && newUser.id) {
    fetchUserLocation(newUser.id)
  } else {
    // Clear markers if no user is selected
    if (mapRef.value) {
      markers.value.forEach(marker => {
        if (marker && mapRef.value.hasLayer(marker)) {
          marker.remove()
        }
      })
      markers.value = []
      mapRef.value.setView([0, 0], 2)
    }
  }
}, { immediate: true })

onUnmounted(() => {
  if (mapRef.value) {
    mapRef.value.remove()
    mapRef.value = null
  }
})

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