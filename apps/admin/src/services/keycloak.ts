import { createKeycloakService } from 'shared'

// Admin app uses 'login-required' — redirects to Keycloak if not authenticated
const auth = createKeycloakService({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
})

export const initKeycloak = () => auth.init('login-required')
export const getToken = auth.getToken
export const getUserInfo = auth.getUserInfo
export const hasRole = auth.hasRole
export const logout = auth.logout

export default auth.keycloak
