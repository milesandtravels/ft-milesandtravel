<template>
  <div class="product-image-container">
    <v-img
      :src="product.image_url"
      :alt="product.name"
      :style="{
        backgroundPosition: 'contain',
      }"
      class="product-image"
    >
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular color="grey-lighten-4" indeterminate />
        </div>
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
  interface Product {
    id: number
    name: string
    price: number
    image_url: string
    product_url: string
    created_at: string
    updated_at: string
    reviews: number
    rating: string
    isCustomProduct: boolean
  }

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
</style>
