<!-- src/components/SidePanel.vue -->
<template>
  <div class="side-panel">
    <my-location-section ref="myLocation" />
    <shared-users-section :users="sharedUsers" @refresh="fetchSharedUsers" />
    <allowed-users-section :users="allowedUsers" />
    <button @click="showAllowModal = true" class="allow-button">Allow User</button>
    <allow-user-form 
      v-if="showAllowModal" 
      @user-allowed="handleUserAllowed" 
      @close="showAllowModal = false" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, inject, provide } from 'vue'
import MyLocationSection from './MyLocationSection.vue'
import SharedUsersSection from './SharedUsersSection.vue'
import AllowedUsersSection from './AllowedUsersSection.vue'
import AllowUserForm from './AllowUserForm.vue'
import axios from 'axios'

const myLocation = ref(null)
const sharedUsers = ref([])
const allowedUsers = ref([])
const showAllowModal = ref(false)
const selectUser = inject('selectUser') // From MainView.vue

onMounted(async () => {
  const map = inject('mapRef') // From MainView.vue
  if (myLocation.value && map) {
    myLocation.value.setMapView(map)
  } else {
    console.error('SidePanel: Refs not properly set', { myLocation: !!myLocation.value, map: !!map })
  }
  await Promise.all([fetchSharedUsers(), fetchAllowedUsers()])
})

const fetchSharedUsers = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/shared-users/', {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    })
    console.log('Shared Users:', response.data)
    sharedUsers.value = response.data.map(shared => ({
      id: shared.id,
      username: shared.shared_with.username,
      name: shared.shared_with.username,
      shared_with_id: shared.shared_with.id
    }))
  } catch (error) {
    console.error('Fetch Shared Users Error:', error.response ? error.response.data : error.message)
    sharedUsers.value = []
  }
}

const fetchAllowedUsers = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/allowed-users/', {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    })
    console.log('Allowed Users Response:', response.data)
    const usersWithLocations = await Promise.all(
      response.data.map(async (allowed) => {
        try {
          const locResponse = await axios.get(`http://localhost:8000/api/locations/${allowed.owner.id}/`, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` }
          })
          console.log(`Location for ${allowed.owner.username}:`, locResponse.data)
          return {
            id: allowed.owner.id,
            username: allowed.owner.username,
            name: allowed.owner.username,
            last_updated: locResponse.data[0]?.last_updated || null
          }
        } catch (locError) {
          console.error(`Location fetch error for ${allowed.owner.username}:`, locError.response?.data || locError.message)
          return null
        }
      })
    )
    allowedUsers.value = usersWithLocations.filter(user => user && user.last_updated)
  } catch (error) {
    console.error('Fetch Allowed Users Error:', error.response ? error.response.data : error.message)
    allowedUsers.value = []
  }
}

const handleUserAllowed = () => { // Removed unused 'newUser' parameter
  fetchAllowedUsers() // Refresh allowed users after adding permission
}

provide('selectUser', selectUser)
</script>

<style scoped>
.side-panel {
  width: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
}

.allow-button {
  padding: 10px 20px;
  background-color: #ffffff;
  color: #667eea;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  margin-top: 20px;
  width: 100%;
}

.allow-button:hover {
  background-color: #e2e8f0;
}
</style>