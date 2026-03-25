<script setup lang="ts">
import Editor from './components/Editor.vue'
import { getUserInfo, logout } from './services/keycloak'

const user = getUserInfo()
const username = user?.preferred_username ?? user?.name ?? 'Admin'
</script>

<template>
  <div class="app-layout">
    <nav class="app-nav">
      <span class="app-nav__user">Signed in as <strong>{{ username }}</strong></span>
      <button class="app-nav__logout" @click="logout">Logout</button>
    </nav>
    <Editor />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  padding: 0.5rem 1.5rem;
  background: #1e1e2e;
  border-bottom: 1px solid #2a2a3e;
  font-size: 0.875rem;
  color: #cdd6f4;
}

.app-nav__logout {
  padding: 0.3rem 0.8rem;
  background: transparent;
  border: 1px solid #f38ba8;
  color: #f38ba8;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.2s;
}

.app-nav__logout:hover {
  background: #f38ba820;
}
</style>
