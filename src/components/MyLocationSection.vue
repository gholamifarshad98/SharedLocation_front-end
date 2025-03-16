<!-- src/components/MyLocationSection.vue -->
<template>
  <div class="location-section">
    <h3>My Location</h3>
    <div v-if="myLocation.lat && myLocation.lng && !loading">
      <location-card :location="myLocation" />
      <button @click="viewOnMap" :disabled="loading">Click to view location</button>
    </div>
    <div v-else class="empty-message">
      <span v-if="loading">Loading location...</span>
      <span v-else>No location set yet.</span>
      <button @click="setCurrentLocation" :disabled="loading">Set Current Location</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LocationCard from './LocationCard.vue'
import axios from 'axios'

const myLocation = ref({ lat: 0, lng: 0 })
const mapView = ref(null)
const loading = ref(false)

onMounted(async () => {
  await fetchLocation()
})

const fetchLocation = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://localhost:8000/api/locations/', {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    })
    console.log('Fetched Locations:', response.data)
    if (response.data.length > 0) {
      myLocation.value = { 
        lat: response.data[0].latitude, 
        lng: response.data[0].longitude,
        name: response.data[0].user.username // Add name for LocationCard
      }
    }
  } catch (error) {
    console.error('Fetch Location Error:', error.response ? error.response.data : error.message)
  } finally {
    loading.value = false
  }
}

const setCurrentLocation = async () => {
  loading.value = true
  try {
    if (!navigator.geolocation) {
      throw new Error('Geolocation not supported')
    }
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    const { latitude, longitude } = position.coords
    const response = await axios.post(
      'http://localhost:8000/api/locations/',
      { latitude, longitude },
      { headers: { Authorization: `Token ${localStorage.getItem('token')}` } }
    )
    console.log('Location Set:', response.data)
    myLocation.value = { 
      lat: latitude, 
      lng: longitude,
      name: localStorage.getItem('username') // Use logged-in username
    }
  } catch (error) {
    console.error('Set Location Error:', error.response ? error.response.data : error.message)
  } finally {
    loading.value = false
  }
}

const viewOnMap = () => {
  const userId = localStorage.getItem('userId')
  if (userId && mapView.value) {
    mapView.value.fetchUserLocation(userId)
  } else {
    console.error('Cannot view on map: userId or mapView missing', { userId, mapView: !!mapView.value })
  }
}

defineExpose({ setMapView: (map) => (mapView.value = map) })
</script>

<style scoped>
.location-section {
  padding: 15px;
}

h3 {
  color: white;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.empty-message {
  color: #e2e8f0;
  font-size: 0.9rem;
  text-align: center;
}

button {
  padding: 10px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #5a6fd1;
}

button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}
</style>