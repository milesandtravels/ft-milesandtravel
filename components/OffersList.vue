<template>
  <div class="offers-container">
    <v-row justify="center">
      <v-col
        v-for="offer in offers"
        :key="`${offer.ecommerce.id}-${offer.product.id}-${offer.program.id}`"
        cols="12"
        sm="6"
        md="4"
      >
        <OfferCard :offer="offer" @view:product="handleViewProduct" />
      </v-col>
    </v-row>
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

  /* Responsividade */
  @media (max-width: 768px) {
    .offers-container {
      padding: 16px;
    }
  }

  @media (max-width: 600px) {
    .offers-container {
      padding: 12px;
    }
  }
</style>
