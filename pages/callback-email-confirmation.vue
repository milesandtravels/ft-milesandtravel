<template></template>

<script lang="ts" setup>
  const route = useRoute()
  const router = useRouter()
  const { refreshIdentity } = useSanctumAuth()
  onMounted(async () => {
    const { status, error, data } = await useSanctumFetch<any>(
      `/api/email/verify/${route.query?.id_verification}/${route.query?.hash}`,
      {
        method: 'GET',
        query: {
          expires: route.query?.expires,
          signature: route.query?.signature,
        },
      }
    )

    if (status.value === 'success') {
      await refreshIdentity()
      router.push('/')
    }

    if (error.value) {
      router.push('/confirmation-email')
    }
  })
</script>
