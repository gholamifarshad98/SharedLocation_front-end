<!-- src/views/MainView.vue -->
<template>
    <div class="main-container">
      <side-panel class="side-panel" />
      <map-view class="map-view" :selected-user="selectedUser" />
    </div>
  </template>
  
  <script setup>
  import { ref, provide } from 'vue'
  import SidePanel from '../components/SidePanel.vue'
  import MapView from '../components/MapView.vue'
  
  const selectedUser = ref(null)
  
  const selectUser = (user) => {
    selectedUser.value = user
  }
  
  provide('selectUser', selectUser)
  </script>
  
  <style scoped>
  .main-container {
    display: flex;
    flex-direction: row; /* Ensures horizontal layout */
    height: 100vh; /* Full viewport height */
    width: 100vw; /* Full viewport width */
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: absolute; /* Ensures it sticks to the body */
    top: 0;
    left: 0;
  }
  
  .side-panel {
    width: 300px; /* Fixed width for side panel */
    flex-shrink: 0; /* Prevents shrinking */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* Matches your previous design */
    height: 100%; /* Full height of container */
  }
  
  .map-view {
    flex: 1; /* Takes remaining space */
    height: 100%; /* Full height of container */
  }
  </style>