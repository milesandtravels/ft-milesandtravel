export default defineNuxtRouteMiddleware(() => {
  const { user } = useFortifyUser()
  
  if (user.value) {
    return navigateTo('/')
  }
})

