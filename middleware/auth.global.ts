export default defineNuxtRouteMiddleware((to, from) => {
  const { value: user }: any = useSanctumUser()

  // Manda para home se já tiver com e-mail verificado
  if (to.path === '/confirmation-email' && user?.email_verified_at) {
    return navigateTo('/')
  }

  // Excluir a rota de confirmação da verificação
  if (
    to.path === '/confirmation-email' ||
    to.path === '/callback-email-confirmation'
  ) {
    return
  }

  if (user && !user?.email_verified_at) {
    return navigateTo(
      '/confirmation-email?email=' + encodeURIComponent(user.email)
    )
  }
})
