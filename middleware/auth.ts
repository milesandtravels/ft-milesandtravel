// middleware/auth.ts
export default defineNuxtRouteMiddleware(to => {
  const { user } = useFortifyUser()

  // If user is not authenticated, redirect to login with return URL
  if (!user.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
})
