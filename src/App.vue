<template>
  <router-view />
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Basic reset and global styles */
body {
  margin: 0;
  padding: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f0f2f5;
}

#app {
  max-width: 400px;
  margin: 0rem auto;
  padding: 0px;
}

/* Form container styling */
.auth-container {
  background: white;
  padding: 0rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
html{
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

/* Form element styling */
input[type="tel"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #1877f2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #166fe5;
}

/* Link styling */
a {
  color: #1877f2;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Error message styling */
.error-message {
  color: #ff4444;
  margin-top: 1rem;
  text-align: center;
}
</style>