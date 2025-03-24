<!-- src/views/MainView.vue -->
<template>
  <div class="main-container">
    <side-panel class="side-panel" />
    <map-view class="map-view" :selected-user="selectedUser" ref="map" />
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue'
import SidePanel from '../components/SidePanel.vue'
import MapView from '../components/MapView.vue'
import axios from 'axios'

const selectedUser = ref(null)
const mapRef = ref(null) // Map ref for injection

const selectUser = (user) => {
  selectedUser.value = user
}

provide('selectUser', selectUser)
provide('mapRef', mapRef)

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/locations/', {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    })
    console.log('Initial Locations Response:', response.data)
    if (response.data.length > 0) {
      const latest = response.data[0]
      selectedUser.value = {
        id: latest.user.id,
        name: latest.user.username
      }
    }
  } catch (error) {
    console.error('Initial User Fetch Error:', error.response ? error.response.data : error.message)
  }
})
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
}

.side-panel {
  width: 300px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 100%;
}

.map-view {
  flex: 1;
  height: 100%;
}
</style>