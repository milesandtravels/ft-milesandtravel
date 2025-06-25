<script lang="ts" setup>
  definePageMeta({
    layout: false,
    middleware: ['sanctum:guest'],
  })
  //pegar o token da url via route
  const token = useRoute().query.token
  if (token) {
    useCookie('sanctum.token.cookie').value = token as string
    const { refreshIdentity } = useSanctumAuth()
    await refreshIdentity()
    await navigateTo('/')
  } else {
    navigateTo('/login')
  }
</script>
