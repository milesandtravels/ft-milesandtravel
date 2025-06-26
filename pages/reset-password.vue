<template></template>

<script lang="ts" setup>
  const route = useRoute()
  const router = useRouter()

  const tokenFlowEmail = computed(() => route.query.token || '')

  const handleResetPassword = () => {
   
  }
</script>
