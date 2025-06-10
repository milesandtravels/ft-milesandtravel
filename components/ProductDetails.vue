<template>
  <v-card-text class="pa-4">
    <ProductPrice :price="price" />
    <ProductName :name="name" />
  </v-card-text>
</template>

<script setup lang="ts">
  interface Props {
    name: string
    price: number
  }

  defineProps<Props>()
</script>
