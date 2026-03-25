import Keycloak from 'keycloak-js'
import type { KeycloakUser } from './types'

export interface KeycloakConfig {
  url: string
  realm: string
  clientId: string
}

/**
 * Factory that creates a Keycloak service instance.
 * Call once at app startup and export the result for use across the app.
 *
 * @example
 * // admin: require login
 * export const auth = createKeycloakService({ ... })
 * await auth.init('login-required')
 *
 * @example
 * // web: silent check (no redirect)
 * export const auth = createKeycloakService({ ... })
 * await auth.init('check-sso')
 */
export function createKeycloakService(config: KeycloakConfig) {
  const keycloak = new Keycloak(config)

  async function init(
    onLoad: 'login-required' | 'check-sso' = 'login-required',
  ): Promise<boolean> {
    try {
      const authenticated = await keycloak.init({
        onLoad,
        checkLoginIframe: false,
        silentCheckSsoRedirectUri:
          onLoad === 'check-sso'
            ? `${window.location.origin}/silent-check-sso.html`
            : undefined,
      })

      if (authenticated) {
        // Proactively refresh the token 70 s before expiry
        setInterval(async () => {
          try {
            await keycloak.updateToken(70)
          } catch {
            console.error('[Keycloak] token refresh failed — logging out')
            keycloak.logout()
          }
        }, 60_000)
      }

      return authenticated
    } catch (error) {
      console.error('[Keycloak] init failed:', error)
      return false
    }
  }

  /** Raw Bearer token string, undefined if not authenticated. */
  function getToken(): string | undefined {
    return keycloak.token
  }

  /** Parsed JWT payload (user claims). */
  function getUserInfo(): KeycloakUser | undefined {
    return keycloak.tokenParsed as KeycloakUser | undefined
  }

  /** Returns true if the user has the given realm role. */
  function hasRole(role: string): boolean {
    return keycloak.hasRealmRole(role)
  }

  /** Redirect to the Keycloak login page. */
  function login(): void {
    keycloak.login()
  }

  /** Redirect to Keycloak logout. */
  function logout(): void {
    keycloak.logout()
  }

  return { keycloak, init, getToken, getUserInfo, hasRole, login, logout }
}

export type KeycloakService = ReturnType<typeof createKeycloakService>
