<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
    </v-app>
  </NuxtLayout>
</template>

<style>
  .page-enter-active,
  .page-leave-active {
    transition: all 0.3s ease-in-out;
  }

  .page-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }

  .page-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
</style>
