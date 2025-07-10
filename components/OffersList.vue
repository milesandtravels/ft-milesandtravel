<template>
  <div class="offers-container">
    <div class="offers-grid">
      <div
        v-for="offer in offers"
        :key="`${offer.ecommerce.id}-${offer.product.id}-${offer.program.id}`"
        class="grid-item"
      >
        <OfferCard :offer="offer" @view:product="handleViewProduct" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { OfferItem } from '~/interfaces/offers'

  interface Props {
    offers: OfferItem[]
  }

  defineProps<Props>()

  defineOptions({
    name: 'OffersList',
  })

  const emit = defineEmits<{
    'view:product': [offer: OfferItem]
    'go:program': [offer: OfferItem]
  }>()

  const handleViewProduct = (offer: OfferItem): void => {
    emit('view:product', offer)
  }
</script>

<style scoped>
  .offers-container {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .offers-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .grid-item {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  /* Responsividade */
  @media (max-width: 960px) {
    .offers-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
  }

  @media (max-width: 600px) {
    .offers-container {
      padding: 12px;
    }

    .offers-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  @media (max-width: 768px) {
    .offers-container {
      padding: 16px;
    }
  }
</style>
