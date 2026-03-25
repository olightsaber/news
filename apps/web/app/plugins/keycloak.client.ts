import { createKeycloakService } from 'shared'
import type { KeycloakService } from 'shared'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()

  const auth = createKeycloakService({
    url: config.public.keycloakUrl as string,
    realm: config.public.keycloakRealm as string,
    clientId: config.public.keycloakClientId as string,
  })

  // 'check-sso' — silently checks for an existing session without redirecting.
  // Users can browse the site without being logged in.
  await auth.init('check-sso')

  return {
    provide: {
      auth: auth as KeycloakService,
    },
  }
})
