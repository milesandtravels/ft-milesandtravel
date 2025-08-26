<script lang="ts" setup>
  definePageMeta({
    layout: false,
    middleware: ['sanctum:guest'],
  })

  const processCallback = async () => {
    //pegar o token da url via route
    const token = useRoute().query.token

    if (token) {
      useCookie('sanctum.token.cookie').value = token as string
      const { refreshIdentity, user } = useSanctumAuth()
      await refreshIdentity()

      // Verifica se o email foi confirmado
      if (user.value && !(user.value as any).email_verified_at) {
        window.location.href =
          window.location.origin +
          '/confirmation-email?email=' +
          encodeURIComponent((user.value as any).email)
        return
      }

      const redirectTo = sessionStorage.getItem('googleAuthRedirectTo') || '/'
      sessionStorage.removeItem('googleAuthRedirectTo')

      window.location.href = window.location.origin + redirectTo
    } else {
      navigateTo('/login')
    }
  }

  // Executa o processamento do callback
  await processCallback()
</script>
