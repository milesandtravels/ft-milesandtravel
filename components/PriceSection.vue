<template>
  <div class="price-section">
    <div class="d-flex align-center justify-space-between">
      <div>
        <span class="text-h6 font-weight-bold text-primary">
          {{ formatPrice(parseFloat(finalPrice)) }}
        </span>
        <div
          v-if="parseFloat(originalPrice.toString()) !== parseFloat(finalPrice)"
          class="text-caption text-medium-emphasis text-decoration-line-through"
        >
          {{ formatPrice(originalPrice) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    finalPrice: string
    originalPrice: number
  }

  defineProps<Props>()

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }
</script>

<style scoped>
  .price-section {
    border-bottom: 1px solid
      rgba(var(--v-border-color), var(--v-border-opacity));
    padding-bottom: 12px;
  }
</style>
