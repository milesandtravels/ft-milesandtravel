// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module', 'nuxt-fortify'],
  nuxtFortify: {
    baseUrl: 'https://api-dev.milesandtravels.com',
    origin: 'https://api-dev.milesandtravels.com',
    authMode: 'cookie',
    authHome: '/',
    endpoints: {
      csrf: '/sanctum/csrf-cookie',
      login: '/login',
    },
    features: {
      registration: true,
      resetPasswords: true,
      twoFactorAuthentication: true,
      // other features...
    },
    // other configurations...
  },
})
