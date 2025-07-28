export default defineNuxtRouteMiddleware((to, from) => {
  const { value: user }: any = useSanctumUser()
  const router = useRouter()
  // Manda para home se já tiver com e-mail verificado
  if (to.path === '/confirmation-email' && user?.email_verified_at) {
    return router.push('/')
  }

  // Excluir a rota de confirmação da verificação
  if (
    to.path === '/confirmation-email' ||
    to.path === '/callback-email-confirmation'
  ) {
    return
  }

  if (user && !user?.email_verified_at) {
    return router.push(
      '/confirmation-email?email=' + encodeURIComponent(user.email)
    )
  }
})
