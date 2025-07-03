<template></template>

<script lang="ts" setup>
  const route = useRoute()
  const router = useRouter()

  onMounted(async () => {
    try {
      await useSanctumFetch<any>(
        `/api/email/verify/${route.query?.id_verification}/${route.query?.hash}`,
        {
          method: 'GET',
          query: {
            expires: route.query?.expires,
            signature: route.query?.signature
          }
        }
      )

      router.push('/')
    } catch (error) {
      router.push('/confirmation-email')
    }
  })
</script>
