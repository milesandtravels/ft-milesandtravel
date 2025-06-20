// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  ssr: false,
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module', 'nuxt-auth-sanctum'],
  sanctum: {
    mode: 'token',
    baseUrl: process.env.API_URL, // Laravel API
    redirectIfAuthenticated: true,
    redirectIfUnauthenticated: true,
    endpoints: {
      login: '/api/login',
      logout: '/api/logout',
    },
  },
})
