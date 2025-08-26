export default defineNuxtRouteMiddleware((to, from) => {
  // Só executa no client para evitar problemas de hidratação
  if (process.server) return

  const { value: user }: any = useSanctumUser()
  const router = useRouter()

  // Aguarda o estado do usuário estar disponível
  if (user === undefined) {
    return
  }

  // Evita loops de redirecionamento
  if (from?.path === to.path) {
    return
  }

  // Manda para home se já tiver com e-mail verificado
  if (to.path === '/confirmation-email' && user?.email_verified_at) {
    return router.push('/')
  }

  // Redireciona usuário não verificado para confirmação
  if (user && !user?.email_verified_at) {
    // Permite acesso às rotas de confirmação
    if (
      to.path === '/confirmation-email' ||
      to.path === '/callback-email-confirmation'
    ) {
      return
    }

    return router.push(
      '/confirmation-email?email=' + encodeURIComponent(user.email)
    )
  }
})
