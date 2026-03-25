import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { initKeycloak } from './services/keycloak'

async function bootstrap() {
  const authenticated = await initKeycloak()

  // initKeycloak uses 'login-required', so Keycloak will redirect
  // the browser to the login page if not authenticated.
  // We only reach here when the user IS authenticated.
  if (!authenticated) return

  createApp(App).mount('#app')
}

bootstrap()
