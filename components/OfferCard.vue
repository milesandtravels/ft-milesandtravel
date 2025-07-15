<template>
  <v-card :class="['offer-card']" elevation="2">
    <!-- Header com logo do e-commerce -->
    <OfferCardHeader :offer="offer" />

    <!-- Imagem do produto -->
    <OfferProductImage
      :product="offer.product"
      :discount-percentage="offer.discount_percentage"
    />

    <!-- Informações do produto -->
    <OfferCardContent :offer="offer" />

    <!-- Botões de ação -->
    <OfferCardActions
      :offer="offer"
      @view:product="handleViewProduct"
      @go:program="handleGoToProgram"
    />
  </v-card>
</template>

<script setup lang="ts">
  import type { OfferItem } from '~/interfaces/offers'

  interface Props {
    offer: OfferItem
  }

  defineProps<Props>()

  const emit = defineEmits<{
    'view:product': [offer: OfferItem]
    'go:program': [offer: OfferItem]
  }>()

  const handleViewProduct = (offer: OfferItem): void => {
    window.open(offer.product.product_url, '_blank')
    emit('view:product', offer)
  }

  const handleGoToProgram = (offer: OfferItem): void => {
    window.open(offer.promotion_link, '_blank')
    emit('go:program', offer)
  }
</script>

<style scoped>
  .offer-card {
    border-radius: 12px !important;
    transition: all 0.3s ease;
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .offer-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }

  /* Responsividade */
  @media (max-width: 400px) {
    .offer-card {
      border-radius: 8px !important;
    }
  }
</style>
