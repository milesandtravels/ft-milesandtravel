<template>
  <FormLogin />
</template>

<script lang="ts" setup>
  definePageMeta({
    layout: false,
    middleware: ['sanctum:guest'],
  })

  useSeoMeta({
    title: 'Acesse sua conta - Miles&Travels',
    ogTitle: 'Acesse sua conta - Miles&Travels',
    description:
      'Entre na sua conta e aproveite as melhores ofertas com cashback, pontos e milhas dos principais e-commerces.',
    ogDescription:
      'Entre na sua conta e aproveite as melhores ofertas com cashback, pontos e milhas dos principais e-commerces.',
  })
</script>
