<template>
  <ProductList />
</template>

<script lang="ts" setup>
// Protect this page with authentication
definePageMeta({
  middleware: 'auth'
})

</script>