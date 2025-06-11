<template>
  <v-container class="pa-2 pa-md-4">
    <!-- Search Form -->
    <v-card
      class="elevation-4 rounded-lg mb-4 mb-md-6 mx-auto search-card"
      max-width="600"
    >
      <v-card-title class="pa-4 pa-md-6 pb-2 pb-md-4">
        <h2 class="text-h6 font-weight-bold">Buscar Produtos</h2>
      </v-card-title>

      <v-card-text class="pa-4 pa-md-6 pt-2">
        <!-- Product Name -->
        <v-autocomplete
          v-model="selectedProduct"
          v-model:search="searchQuery"
          class="mb-3 mb-md-4"
          clearable
          density="comfortable"
          hide-details
          item-title="name"
          item-value="id"
          :items="searchResults"
          :loading="isLoading"
          no-data-text="Digite para buscar"
          placeholder="Digite o nome do produto..."
          prepend-inner-icon="mdi-magnify"
          return-object
          variant="outlined"
        >
          <template #item="{ props, item }">
            <v-list-item v-bind="props" class="px-3 py-2">
              <template #prepend>
                <v-avatar class="mr-3" size="36">
                  <v-img cover :src="item.raw.image" />
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2 font-weight-medium">
                {{ item.raw.name }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption">
                {{ item.raw.marketplace }} • {{ formatPrice(item.raw.price) }}
              </v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-autocomplete>

        <!-- Marketplaces -->
        <v-select
          v-model="selectedMarketplaces"
          chips
          class="mb-4 mb-md-6"
          closable-chips
          density="comfortable"
          hide-details
          :items="marketplaceOptions"
          multiple
          placeholder="Selecione os marketplaces..."
          prepend-inner-icon="mdi-store-outline"
          variant="outlined"
        >
          <template #chip="{ props, item }">
            <v-chip
              v-bind="props"
              class="text-white mx-1"
              :color="getMarketplaceColor(item.title)"
              size="small"
              variant="flat"
            >
              {{ item.title }}
            </v-chip>
          </template>
        </v-select>

        <!-- Actions -->
        <div class="action-buttons">
          <v-btn
            block
            class="search-btn"
            color="primary"
            :loading="isSearching"
            size="large"
            @click="handleSearch"
          >
            <v-icon left>mdi-magnify</v-icon>
            Buscar
          </v-btn>
          <v-btn
            block
            class="clear-btn"
            size="large"
            variant="outlined"
            @click="clearAll"
          >
            <v-icon left>mdi-refresh</v-icon>
            Limpar
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Results -->
    <div v-if="results.length > 0">
      <div class="results-header mb-3 mb-md-4 px-2 px-md-0">
        <h3 class="text-h6 font-weight-bold">
          {{ results.length }} produto{{
            results.length > 1 ? 's' : ''
          }}
          encontrado{{ results.length > 1 ? 's' : '' }}
        </h3>
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
                :src="product.image"
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
                :color="getMarketplaceColor(product.marketplace)"
                size="x-small"
                variant="flat"
              >
                {{ product.marketplace }}
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
    </div>

    <!-- Empty State -->
    <div v-else-if="hasSearched" class="empty-state text-center py-8 py-md-12">
      <v-icon class="mb-3" color="grey-lighten-1" size="48"
        >mdi-magnify-remove</v-icon
      >
      <h3 class="text-body-1 text-md-h6 font-weight-medium mb-2">
        Nenhum produto encontrado
      </h3>
      <p class="text-body-2 text-medium-emphasis">
        Tente usar termos diferentes ou outros marketplaces
      </p>
    </div>

    <!-- Initial State -->
    <div v-else class="initial-state text-center py-8 py-md-12">
      <v-icon class="mb-3" color="primary" size="48">mdi-magnify-plus</v-icon>
      <h3 class="text-body-1 text-md-h6 font-weight-medium mb-2">
        Pronto para buscar!
      </h3>
      <p class="text-body-2 text-medium-emphasis">
        Digite o nome do produto ou selecione marketplaces
      </p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  // Types
  interface Product {
    id: number
    name: string
    price: number
    image: string
    marketplace: string
  }

  // State
  const searchQuery = ref('')
  const selectedProduct = ref<Product | null>(null)
  const selectedMarketplaces = ref<string[]>([])
  const searchResults = ref<Product[]>([])
  const results = ref<Product[]>([])
  const isLoading = ref(false)
  const isSearching = ref(false)
  const hasSearched = ref(false)

  // Options
  const marketplaceOptions = [
    'Amazon',
    'Shopee',
    'Mercado Livre',
    'AliExpress',
    'Americanas',
  ]

  // Mock data
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max 256GB',
      price: 8999.99,
      image:
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=300&fit=crop',
      marketplace: 'Amazon',
    },
    {
      id: 2,
      name: 'iPhone 15 Pro 128GB',
      price: 7499.9,
      image:
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=300&fit=crop',
      marketplace: 'Mercado Livre',
    },
    {
      id: 3,
      name: 'Samsung Galaxy S24 Ultra',
      price: 6999,
      image:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
      marketplace: 'Shopee',
    },
    {
      id: 4,
      name: 'MacBook Air M2 13"',
      price: 12_999,
      image:
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
      marketplace: 'Amazon',
    },
    {
      id: 5,
      name: 'AirPods Pro 2ª Geração',
      price: 1899.99,
      image:
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop',
      marketplace: 'Shopee',
    },
    {
      id: 6,
      name: 'MacBook Pro M3 14"',
      price: 18_999,
      image:
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
      marketplace: 'Americanas',
    },
    {
      id: 7,
      name: 'Samsung Galaxy S24',
      price: 4999,
      image:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
      marketplace: 'AliExpress',
    },
    {
      id: 8,
      name: 'AirPods 3ª Geração',
      price: 1299,
      image:
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop',
      marketplace: 'Mercado Livre',
    },
  ]

  // Debounce timer
  let timer: NodeJS.Timeout

  // Methods
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

  const searchProducts = (query: string) => {
    if (!query.trim()) {
      searchResults.value = []
      return
    }

    isLoading.value = true

    setTimeout(() => {
      const filtered = mockProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      )
      searchResults.value = filtered
      isLoading.value = false
    }, 300)
  }

  const handleSearch = async () => {
    isSearching.value = true
    hasSearched.value = true

    setTimeout(() => {
      let filtered = [...mockProducts]

      // Filter by name
      if (searchQuery.value || selectedProduct.value) {
        const query = searchQuery.value || selectedProduct.value?.name || ''
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase())
        )
      }

      // Filter by marketplaces
      if (selectedMarketplaces.value.length > 0) {
        filtered = filtered.filter(product =>
          selectedMarketplaces.value.includes(product.marketplace)
        )
      }

      results.value = filtered
      isSearching.value = false
    }, 800)
  }

  const clearAll = () => {
    searchQuery.value = ''
    selectedProduct.value = null
    selectedMarketplaces.value = []
    searchResults.value = []
    results.value = []
    hasSearched.value = false
  }

  // Watch search query for autocomplete
  watch(searchQuery, newQuery => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      searchProducts(newQuery)
    }, 500)
  })

  console.log('💡 Teste com: "iPhone", "Samsung", "MacBook", "AirPods"')
</script>

<style scoped>
  /* Search Card */
  .search-card {
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* Action Buttons */
  .action-buttons {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 12px;
  }

  @media (max-width: 600px) {
    .action-buttons {
      grid-template-columns: 1fr;
      gap: 8px;
    }
  }

  /* Product Cards */
  .product-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  }

  .image-container {
    position: relative;
    overflow: hidden;
  }

  .product-image {
    transition: transform 0.3s ease;
  }

  .product-card:hover .product-image {
    transform: scale(1.05);
  }

  .marketplace-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 2;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .price-text {
    font-size: 0.9rem;
    line-height: 1.2;
  }

  @media (min-width: 768px) {
    .price-text {
      font-size: 1rem;
    }
  }

  .product-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
    min-height: 2.6em;
    max-height: 2.6em;
  }

  /* Responsive Typography */
  @media (max-width: 600px) {
    .product-title {
      font-size: 0.8rem;
      line-height: 1.2;
      min-height: 2.4em;
      max-height: 2.4em;
    }
  }

  /* Utilities */
  .text-white {
    color: white !important;
  }

  /* Grid responsive improvements */
  @media (max-width: 400px) {
    .v-col {
      padding: 2px !important;
    }

    .product-card .v-card-text {
      padding: 8px !important;
    }

    .marketplace-badge {
      top: 4px;
      left: 4px;
    }
  }

  /* Empty and Initial States */
  .empty-state,
  .initial-state {
    max-width: 400px;
    margin: 0 auto;
  }

  /* Dark theme enhancements */
  .v-theme--dark .search-card {
    background: rgba(30, 30, 30, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .v-theme--dark .product-card {
    background: rgba(40, 40, 40, 0.95);
  }

  /* Smooth animations */
  .v-col {
    animation: fadeInUp 0.4s ease-out backwards;
  }

  .v-col:nth-child(1) {
    animation-delay: 0.05s;
  }
  .v-col:nth-child(2) {
    animation-delay: 0.1s;
  }
  .v-col:nth-child(3) {
    animation-delay: 0.15s;
  }
  .v-col:nth-child(4) {
    animation-delay: 0.2s;
  }
  .v-col:nth-child(n + 5) {
    animation-delay: 0.25s;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Performance optimizations */
  .v-img {
    will-change: transform;
  }

  .product-card {
    contain: layout style paint;
  }
</style>
