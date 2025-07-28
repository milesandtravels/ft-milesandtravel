export default defineNuxtRouteMiddleware((to, from) => {
  // Só executa no client para evitar problemas de hidratação
  if (process.server) return

  const { value: user }: any = useSanctumUser()
  const router = useRouter()
  
  // Debug logs (remover em produção)
  console.log('Middleware Debug:', {
    path: to.path,
    userExists: !!user,
    emailVerified: user?.email_verified_at,
    fromPath: from?.path
  })

  // Aguarda o estado do usuário estar disponível
  if (user === undefined) {
    console.log('User state not ready, waiting...')
    return
  }

  // Evita loops de redirecionamento
  if (from?.path === to.path) {
    console.log('Avoiding redirect loop')
    return
  }

  // Manda para home se já tiver com e-mail verificado
  if (to.path === '/confirmation-email' && user?.email_verified_at) {
    console.log('Redirecting verified user to home')
    return router.push('/')
  }

  // Excluir as rotas de confirmação da verificação
  if (
    to.path === '/confirmation-email' ||
    to.path === '/callback-email-confirmation'
  ) {
    console.log('Allowing access to confirmation routes')
    return
  }

  // Redireciona usuário não verificado para confirmação
  if (user && !user?.email_verified_at) {
    console.log('Redirecting unverified user to confirmation')
    return router.push(
      '/confirmation-email?email=' + encodeURIComponent(user.email)
    )
  }

  console.log('No redirect needed')
})