export default defineNuxtRouteMiddleware((to, from) => {
  const { value: user }: any = useSanctumUser()

  console.log('User data:', user)
  console.log('Trying to access:', to.path)

  const publicRoutes = [
    '/login/',
    '/register/',
    '/forgot-password/',
    '/reset-password/',
    '/faq/',
    '/confirmation-email/',
    '/callback-email-confirmation/'
  ]

  // ✅ PRIMEIRA VERIFICAÇÃO: Se é rota pública, SEMPRE permite acesso
  if (publicRoutes.includes(to.path)) {
    console.log('🟢 Public route - access granted:', to.path)
    return // Para aqui, não faz mais verificações
  }

  console.log('🔒 Private route detected:', to.path)

  // ✅ SEGUNDA VERIFICAÇÃO: Se não há usuário logado, redireciona para login
  if (!user || !user.id) {
    console.log('❌ No user - redirecting to login')
    return navigateTo('/login')
  }

  // ✅ TERCEIRA VERIFICAÇÃO: Se email não verificado, redireciona para confirmação
  if (!user.email_verified_at) {
    console.log('⚠️ Email not verified - redirecting to confirmation')
    return navigateTo(
      '/confirmation-email?email=' + encodeURIComponent(user.email)
    )
  }

  // ✅ Se chegou até aqui, usuário está autenticado e verificado
  console.log(
    '✅ User authenticated and verified - access granted to:',
    to.path
  )
})
