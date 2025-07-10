<template>
  <div class="product-image-container">
    <v-img
      :src="product.image_url"
      :alt="product.name"
      aspect-ratio="1"
      cover
      class="product-image"
    >
      <template v-slot:placeholder>
        <v-skeleton-loader
          type="image"
          class="skeleton-placeholder"
          height="100%"
          width="100%"
        />
      </template>
    </v-img>

    <!-- Badge de desconto -->
    <DiscountBadge
      v-if="parseFloat(discountPercentage) > 0"
      :discount="discountPercentage"
      class="discount-badge"
    />
  </div>
</template>

<script setup lang="ts">
  import type { Product } from '~/interfaces/products'
  import DiscountBadge from './DiscountBadge.vue'

  interface Props {
    product: Product
    discountPercentage: string
  }

  defineProps<Props>()
</script>

<style scoped>
  .product-image-container {
    position: relative;
    overflow: hidden;
  }

  .product-image {
    transition: transform 0.3s ease;
  }

  .product-image-container:hover .product-image {
    transform: scale(1.05);
  }

  .skeleton-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    aspect-ratio: 1;
  }

  /* Garante que o skeleton mantenha o aspect ratio */
  .skeleton-placeholder :deep(.v-skeleton-loader__image) {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    border-radius: 4px;
  }

  .discount-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 2;
  }

  @media (max-width: 400px) {
    .discount-badge {
      top: 4px;
      right: 4px;
    }
  }

  /* Otimizações para CLS */
  .product-image-container {
    contain: layout style;
  }

  .product-image,
  .skeleton-placeholder {
    will-change: auto;
  }
</style>
