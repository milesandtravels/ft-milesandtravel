export default defineNuxtRouteMiddleware((to, from) => {
  const { value: user }: any = useSanctumUser()
  
  // Excluir a rota de confirmação da verificação
  if (to.path === '/confirmation-email') {
    return
  }
  
  if (user && !user.email_verified_at) {
    console.log('⚠️ Email not verified - redirecting to confirmation')
    return navigateTo(
      '/confirmation-email?email=' + encodeURIComponent(user.email)
    )
  }
})