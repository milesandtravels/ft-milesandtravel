<template>
  <FormLogin />
</template>

<script lang="ts" setup>
  definePageMeta({
    layout: false,
    middleware: ['sanctum:guest'],
  })
</script>
