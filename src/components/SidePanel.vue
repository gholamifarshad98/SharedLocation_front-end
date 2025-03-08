<!-- src/components/SidePanel.vue -->
<template>
    <div class="side-panel">
      <my-location-section />
      <shared-users-section />
      <allowed-users-section />
    </div>
  </template>
  
  <script setup>
  import MyLocationSection from './MyLocationSection.vue'
  import SharedUsersSection from './SharedUsersSection.vue'
  import AllowedUsersSection from './AllowedUsersSection.vue'
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
  </style>