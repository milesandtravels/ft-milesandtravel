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
        }
      )

      router.push('/')
    } catch (error) {
      router.push('/confirmation-email')
    }
  })
</script>
