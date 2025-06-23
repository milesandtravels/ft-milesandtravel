<script setup lang="ts"></script>

<template>
  <FormRegister />
</template>
<script lang="ts" setup>
  definePageMeta({
    layout: false,
    middleware: ['sanctum:guest'],
  })

  useSeoMeta({
    title: 'Cadastre-se - Miles&Travels',
    ogTitle: 'Cadastre-se - Miles&Travels',
    description:
      'Crie sua conta gratuitamente e descubra onde acumular mais cashback, pontos e milhas nas principais lojas online.',
    ogDescription:
      'Crie sua conta gratuitamente e descubra onde acumular mais cashback, pontos e milhas nas principais lojas online.',
  })
</script>
