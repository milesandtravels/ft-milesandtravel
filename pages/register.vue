<script setup lang="ts"></script>

<template>
  <FormRegister />
</template>
<script lang="ts" setup>
  definePageMeta({
    layout: false,
    middleware: ['sanctum:guest'],
  })
</script>
