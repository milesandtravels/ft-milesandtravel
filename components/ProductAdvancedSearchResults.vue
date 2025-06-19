<template>
  <div>
    <div class="results-header mb-3 mb-md-4 px-2 px-md-0">
      <div class="d-flex justify-space-between align-center">
        <h3 class="text-h6 font-weight-bold">
          {{ results.length }} produto{{
            results.length > 1 ? 's' : ''
          }}
          encontrado{{ results.length > 1 ? 's' : '' }}
        </h3>

        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-filter-variant"
          @click="openFilter"
        >
          Filtrar
        </v-btn>
      </div>
    </div>

    <v-row class="ma-0">
      <v-col
        v-for="product in results"
        :key="product.id"
        class="pa-1 pa-md-2"
        cols="6"
        lg="3"
        md="3"
        sm="4"
      >
        <v-card class="elevation-3 product-card h-100" hover>
          <div class="image-container">
            <v-img
              class="product-image"
              cover
              height="140"
              :src="product.image_url"
            >
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate size="24" />
                </div>
              </template>
            </v-img>

            <!-- Marketplace Badge -->
            <v-chip
              class="marketplace-badge text-white"
              :color="getMarketplaceColor(product.ecommerce.name)"
              size="x-small"
              variant="flat"
            >
              {{ product.ecommerce.name }}
            </v-chip>
          </div>

          <v-card-text class="pa-2 pa-md-3">
            <div class="price-container mb-1 mb-md-2">
              <span class="price-text text-primary font-weight-bold">
                {{ formatPrice(product.price) }}
              </span>
            </div>

            <h4 class="product-title text-body-2 font-weight-medium">
              {{ product.name }}
            </h4>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <product-advanced-search-filters v-model="displayFilters" />
  </div>
</template>

<script lang="ts" setup>
  import { defineProps } from 'vue'
  import type { Product } from '~/interfaces/products'
  interface Props {
    results: Product[]
  }
  const displayFilters = ref<boolean>(false)
  defineProps<Props>()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const getMarketplaceColor = (marketplace: string) => {
    const colors: Record<string, string> = {
      Amazon: '#FF9900',
      Shopee: '#EE4D2D',
      'Mercado Livre': '#FFF159',
      AliExpress: '#FF6A00',
      Americanas: '#E60014',
    }
    return colors[marketplace] || '#666'
  }

  const openFilter = () => {
    displayFilters.value = true
  }
</script>
