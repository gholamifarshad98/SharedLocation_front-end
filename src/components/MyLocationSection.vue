<!-- src/components/MyLocationSection.vue -->
<template>
  <div class="location-section">
    <h3>My Location</h3>
    <div v-if="myLocation.lat && myLocation.lng && !loading">
      <location-card 
        :user="userData" 
        @location-updated="handleLocationUpdate"
      />
    </div>
    <div v-else class="empty-message">
      <span v-if="loading">Loading location...</span>
      <span v-else>No location set yet.</span>
      <button @click="setCurrentLocation" :disabled="loading">Set Current Location</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import L from 'leaflet'
import LocationCard from './LocationCard.vue'
import axios from 'axios'

const myLocation = ref({ lat: 0, lng: 0 })
const userData = ref({ username: '', id: null, last_updated: null })
const mapView = inject('mapRef')
const loading = ref(false)
const marker = ref(null)

const customIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

onMounted(async () => {
  await fetchLocation()
})

const setMapView = (map) => {
  if (!map) {
    console.error('No map provided to setMapView')
    return
  }
  if (myLocation.value.lat && myLocation.value.lng) {
    map.setView([myLocation.value.lat, myLocation.value.lng], 13)
    if (marker.value && map.hasLayer(marker.value)) {
      marker.value.remove()
    }
    marker.value = L.marker([myLocation.value.lat, myLocation.value.lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(`${userData.value.username}<br>Last Updated: ${userData.value.last_updated}`)
  }
}

const fetchLocation = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://localhost:8000/api/locations/', {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    })
    console.log('Fetched Locations:', response.data)
    if (response.data.length > 0) {
      const latest = response.data[0]
      myLocation.value = { lat: latest.latitude, lng: latest.longitude }
      userData.value = { 
        username: latest.user.username, 
        name: latest.user.username,
        id: latest.user.id,
        last_updated: latest.last_updated
      }
      if (mapView.value) {
        setMapView(mapView.value)
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
    myLocation.value = { lat: latitude, lng: longitude }
    userData.value = { 
      username: localStorage.getItem('username'), 
      name: localStorage.getItem('username'),
      id: Number(localStorage.getItem('userId')),
      last_updated: response.data.last_updated
    }
    if (mapView.value) {
      setMapView(mapView.value)
    }
  } catch (error) {
    console.error('Set Location Error:', error.response ? error.response.data : error.message)
  } finally {
    loading.value = false
  }
}

const handleLocationUpdate = (updatedData) => {
  userData.value = {
    ...userData.value,
    last_updated: updatedData.last_updated
  }
  if (updatedData.latitude && updatedData.longitude) {
    myLocation.value = {
      lat: updatedData.latitude,
      lng: updatedData.longitude
    }
    if (mapView.value) {
      setMapView(mapView.value)
    }
  }
}

defineExpose({ setMapView })
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