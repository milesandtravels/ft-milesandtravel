<template>
  <v-container
    :fluid="$vuetify.display.mobile"
    class="products-container"
    :class="{ 'mobile-container': $vuetify.display.mobile }"
  >
    <v-row
      :class="$vuetify.display.mobile ? 'mobile-row' : 'desktop-row'"
    >
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
  import type { Product } from '~/interfaces/products';

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
    padding-top: 20px;
    padding-bottom: 100px;
  }

  .mobile-container {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }

  .mobile-row {
    margin: 0 -4px !important;
  }

  .desktop-row {
    margin: 0 -8px !important;
  }

  .product-col {
    padding: 4px;
  }

  @media (max-width: 599px) {
    .products-container {
      padding-bottom: 90px;
    }

    .mobile-container {
      padding-left: 6px !important;
      padding-right: 6px !important;
      padding-top: 16px !important;
    }

    .mobile-row {
      margin: 0 -3px !important;
    }

    .product-col {
      padding: 3px !important;
    }
  }

  @media (min-width: 600px) and (max-width: 959px) {
    .product-col {
      padding: 6px;
    }
  }

  @media (min-width: 960px) {
    .product-col {
      padding: 8px;
    }
  }
</style>
