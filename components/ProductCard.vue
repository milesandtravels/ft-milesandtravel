<template>
  <v-card class="product-card elevation-4" hover>
    <!-- Marketplace Badge -->
    <MarketplaceBadge :marketplace="product.marketplace" />

    <!-- Product Image with Actions -->
    <ProductImage
      :image="product.image"
      :name="product.name"
      @edit="$emit('edit', product)"
      @remove="$emit('remove', product)"
    />

    <!-- Product Details -->
    <ProductDetails :name="product.name" :price="product.price" />
  </v-card>
</template>

<script setup lang="ts">
  // Types
  interface Product {
    id: number
    name: string
    price: number
    image: string
    marketplace:
      | 'Amazon'
      | 'Shopee'
      | 'Mercado Livre'
      | 'AliExpress'
      | 'Americanas'
  }

  // Props
  interface Props {
    product: Product
  }

  // Emits
  interface Emits {
    edit: [product: Product]
    remove: [product: Product]
  }

  defineProps<Props>()
  defineEmits<Emits>()
</script>

<style scoped>
  .product-card {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }

  /* Dark theme support */
  .v-theme--dark .product-card {
    background: rgba(40, 40, 40, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
</style>
