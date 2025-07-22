<template>
  <HomeList />
</template>

<script lang="ts" setup>
  definePageMeta({
    middleware: ['sanctum:auth'],
  })

  useSeoMeta({
    title:
      'Melhores ofertas por categoria em cashback e milhas - Miles&Travels',
    ogTitle:
      'Melhores ofertas por categoria em cashback e milhas - Miles&Travels',
    description:
      'Compare e aproveite as melhores oportunidades por categoria para acumular pontos, milhas e cashback nas maiores lojas online.',
    ogDescription:
      'Compare e aproveite as melhores oportunidades por categoria para acumular pontos, milhas e cashback nas maiores lojas online.',
  })
</script>
