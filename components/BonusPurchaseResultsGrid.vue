<template>
  <v-container
    :fluid="$vuetify.display.mobile"
    class="products-container"
    :class="{ 'mobile-container': $vuetify.display.mobile }"
  >
    <v-row :class="$vuetify.display.mobile ? 'mobile-row' : 'desktop-row'">
      <v-col
        v-for="product in products"
        :key="product.id"
        :cols="$vuetify.display.mobile ? 12 : 4"
        class="product-col"
      >
        <BonusPurchaseProductCard
          :product="product"
          :is-selected="selectedProducts.includes(product.id)"
          @toggle-selection="$emit('toggle-selection', product.id)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import type { Product } from '~/interfaces/products'

  interface Props {
    products: Product[]
    selectedProducts: number[]
  }

  interface Emits {
    (e: 'toggle-selection', productId: number): void
  }

  defineProps<Props>()
  defineEmits<Emits>()
</script>

<style scoped>
  .products-container {
    padding-top: 0;
    padding-bottom: 24px;
  }

  /* Mobile Styles */
  .mobile-container {
    padding-left: 8px;
    padding-right: 8px;
  }

  .mobile-row {
    margin: 0 -4px;
  }

  .mobile-row .product-col {
    padding: 4px;
  }

  /* Desktop Styles */
  .desktop-row {
    margin: 0 -8px;
  }

  .desktop-row .product-col {
    padding: 8px;
  }
</style>
