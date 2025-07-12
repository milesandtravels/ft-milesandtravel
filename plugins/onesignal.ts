import OneSignalVuePlugin from '@onesignal/onesignal-vue3'
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(OneSignalVuePlugin, {
    appId: 'f69c0483-d0ca-44f4-bc1d-169da82b0ea8',
    safari_web_id: 'web.onesignal.auto.198dbf7d-9488-4e23-8cbd-0647f3be427c',
    notifyButton: {
      enable: true,
    },
  })
})
