<template>
  <div class="product-price mb-2">
    <span class="text-h6 font-weight-bold text-primary">
      {{ formatPrice(price) }}
    </span>
  </div>
</template>

<script setup lang="ts">
  // Props
  interface Props {
    price: number
  }

  defineProps<Props>()

  // Format price to Brazilian Real
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }
</script>

<style scoped>
  .product-price {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
