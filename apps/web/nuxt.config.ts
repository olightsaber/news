// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      keycloakUrl: process.env.NUXT_PUBLIC_KEYCLOAK_URL ?? 'http://localhost:8080',
      keycloakRealm: process.env.NUXT_PUBLIC_KEYCLOAK_REALM ?? 'news',
      keycloakClientId: process.env.NUXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? 'web-app',
    },
  },
})
