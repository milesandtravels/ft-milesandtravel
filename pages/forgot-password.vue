<template>
  <FormForgetPassword />
</template>

<script lang="ts" setup>
  definePageMeta({
    layout: false,
    middleware: ['sanctum:guest'],
  })

  useSeoMeta({
    title: 'Recupere sua senha - Miles&Travels',
    ogTitle: 'Recupere sua senha - Miles&Travels',
    description:
      'Recupere o acesso à sua conta Miles&Travels de forma rápida e segura para continuar aproveitando os melhores benefícios em cashback, pontos e milhas.',
    ogDescription:
      'Recupere o acesso à sua conta Miles&Travels de forma rápida e segura para continuar aproveitando os melhores benefícios em cashback, pontos e milhas.',
  })
</script>
