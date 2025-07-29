import { useSnackbarStore } from '~/store/snackbar'

export const useAuthGoogle = () => {
  const isGoogleLoading = ref(false)

  const snackbarStore = useSnackbarStore()
  const route = useRoute()
  const loginWithGoogle = async (provider: string) => {
    isGoogleLoading.value = true
    try {
      const redirectURL = route.query?.redirect
      const paramsRedirect = `?redirectTo=${redirectURL ?? '/'}`
      const config = useRuntimeConfig()
      const { data } = await useSanctumFetch<{ redirect_url: string }>(
        `/api/auth/${provider}/redirect`,
        {
          query: {
            device_name: navigator.userAgent,
            app_callback_redirect_url:
              config.public.appCallbackRedirectUrl + '/' + paramsRedirect,
            redirect_url:
              window.location.origin + '/callback-email-confirmation',
          },
        }
      )

      if (data.value?.redirect_url) {
        window.location.href = data.value.redirect_url
      }
    } catch (error) {
      snackbarStore.showError(`Falha ao conectar com Google.`)
      isGoogleLoading.value = false
    }
  }

  return {
    loginWithGoogle,
    isGoogleLoading,
  }
}
