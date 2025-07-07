<template>
  <v-card-text class="pa-3">
    <!-- Nome do produto -->
    <h3 class="text-body-1 font-weight-medium mb-2 product-name">
      {{ offer.product.name }}
    </h3>

    <!-- Avaliações -->
    <ProductRating
      v-if="offer.product.reviews > 0"
      :rating="offer.product.rating"
      :reviews="offer.product.reviews"
      class="mb-2"
    />

    <!-- Preços -->
    <PriceSection
      :final-price="offer.final_price"
      :original-price="offer.product.price"
      class="mb-3"
    />

    <!-- Programa de recompensa -->
    <OfferRewardSection :offer="offer" />
  </v-card-text>
</template>

<script setup lang="ts">
  import type { OfferItem } from '~/interfaces/offers'

  interface Props {
    offer: OfferItem
  }

  defineProps<Props>()
</script>

<style scoped>
  .product-name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.3;
    min-height: 2.6em;
  }

  @media (max-width: 600px) {
    .product-name {
      font-size: 0.875rem;
    }
  }
</style>
