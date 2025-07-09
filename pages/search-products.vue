<template>
  <BonusPurchaseSearch />
</template>
<script lang="ts" setup>
  // Protect this page with authentication
  definePageMeta({
    middleware: ['sanctum:auth'],
  })

  useSeoMeta({
    title: 'Busque produtos de forma automatizada - Miles&Travels',
    ogTitle: 'Busque produtos de forma automatizada - Miles&Travels',
    description:
      'Encontre automaticamente os melhores produtos com cashback, pontos e milhas em centenas de lojas parceiras.',
    ogDescription:
      'Encontre automaticamente os melhores produtos com cashback, pontos e milhas em centenas de lojas parceiras.',
  })
</script>
