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
const selectUser = inject('selectUser')

onMounted(async () => {
  const map = inject('mapRef')
  if (myLocation.value && map) {
    myLocation.value.setMapView(map)
  } else {
    console.error('SidePanel: Refs not properly set', { myLocation: !!myLocation.value, map: !!map })
  }
  await Promise.all([fetchSharedUsers(), fetchAllowedUsers()])
})

const fetchSharedUsers = async () => {
  try {
    const token = localStorage.getItem('token')
    console.log('Token used for shared users:', token)
    const response = await axios.get('http://localhost:8000/api/allowed-users/', {
      headers: { Authorization: `Token ${token}` }
    })
    console.log('Allowed Users (Shared Users):', response.data)
    sharedUsers.value = response.data.map(allowed => ({
      id: allowed.id,
      username: allowed.allowed_to.username,
      name: allowed.allowed_to.username,
      shared_with_id: allowed.allowed_to.id // Match UserCard prop expectations
    }))
  } catch (error) {
    console.error('Fetch Allowed Users (Shared Users) Error:', error.response ? error.response.data : error.message)
    sharedUsers.value = []
  }
}

const fetchAllowedUsers = async () => {
  try {
    const token = localStorage.getItem('token')
    console.log('Token used:', token)
    const response = await axios.get('http://localhost:8000/api/allowed-by-users/', {
      headers: { Authorization: `Token ${token}` }
    })
    console.log('Allowed By Users Response:', response.data)
    const usersWithLocations = await Promise.all(
      response.data.map(async (allowed) => {
        try {
          console.log(`Fetching location for owner ID: ${allowed.owner.id}`)
          const locResponse = await axios.get(`http://localhost:8000/api/locations/${allowed.owner.id}/`, {
            headers: { Authorization: `Token ${token}` }
          })
          console.log(`Location for ${allowed.owner.username}:`, locResponse.data)
          const mappedUser = {
            id: allowed.owner.id,
            username: allowed.owner.username,
            name: allowed.owner.username,
            last_updated: locResponse.data[0]?.last_updated || null
          }
          console.log('Mapped User:', mappedUser)
          return mappedUser
        } catch (locError) {
          console.error(`Location fetch error for ${allowed.owner.username}:`, locError.response?.data || locError.message)
          const fallbackUser = {
            id: allowed.owner.id,
            username: allowed.owner.username,
            name: allowed.owner.username,
            last_updated: null
          }
          console.log('Fallback User:', fallbackUser)
          return fallbackUser
        }
      })
    )
    allowedUsers.value = usersWithLocations.filter(user => user)
    console.log('Processed Allowed Users:', allowedUsers.value)
  } catch (error) {
    console.error('Fetch Allowed By Users Error:', error.response ? error.response.data : error.message)
    allowedUsers.value = []
  }
}

const handleUserAllowed = () => {
  fetchSharedUsers() // Refresh shared users after allowing
  fetchAllowedUsers() // Refresh allowed users too
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