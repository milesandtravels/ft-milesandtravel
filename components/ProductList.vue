<template>
  <v-container class="pa-2 pa-md-4">
    <!-- Page Header -->
    <div class="mb-4">
      <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">Produtos em Destaque</h1>
      <p class="text-caption text-md-body-2 text-medium-emphasis mb-3">
        Descubra as melhores ofertas e produtos mais buscados
      </p>

      <v-btn
        block
        color="primary"
        size="large"
        @click="router.push('/search-products')"
      >
        <v-icon left>mdi-magnify</v-icon>
        Buscar produtos
      </v-btn>
    </div>

    <!-- Categories Sections -->
    <div v-for="(category, index) in categories" :key="category.id" class="category-section mb-8 mb-md-10">
      <!-- Category Header -->
      <div class="d-flex align-center justify-space-between mb-3 mb-md-4">
        <div class="d-flex align-center">
          <v-avatar class="mr-3" :color="category.color" size="40">
            <v-icon color="white" size="20">{{ category.icon }}</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-subtitle-1 text-md-h6 font-weight-bold">{{ category.name }}</h2>
            <p class="text-caption text-medium-emphasis">
              {{ category.description }}
            </p>
          </div>
        </div>

      </div>

      <!-- Products Grid -->
      <v-row class="ma-0">
        <v-col
          v-for="product in getDisplayProducts(category.id)"
          :key="`${category.id}-${product.id}`"
          class="pa-1 pa-md-2"
          cols="12"
          lg="6"
          md="6"
          sm="12"
        >
          <v-card class="elevation-3 product-card d-flex" hover @click="handleProductClick(product)">
            <div class="image-container">
              <v-img class="product-image" cover height="120" :src="product.image">
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular indeterminate size="20" />
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

              <!-- Offer Badge (if applicable) -->
              <v-chip
                v-if="product.offerType"
                class="offer-badge"
                :color="getOfferColor(product.offerType)"
                size="x-small"
                variant="flat"
              >
                {{ product.offerValue }}
              </v-chip>
            </div>

            <v-card-text class="pa-3 flex-grow-1">
              <div class="d-flex justify-space-between align-start mb-2">
                <div class="flex-grow-1 mr-2">
                  <h4 class="product-title text-caption text-md-body-2 font-weight-medium mb-1">
                    {{ product.name }}
                  </h4>

                  <div class="price-container">
                    <span class="price-text text-primary font-weight-bold">
                      {{ formatPrice(product.price) }}
                    </span>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Confirm Remove Dialog -->
    <v-dialog v-model="showConfirmDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          Confirmar Remoção
        </v-card-title>
        <v-card-text>
          Tem certeza que deseja remover o produto
          <strong>"{{ productToRemove?.name }}"</strong>?
          Esta ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="cancelRemove">
            Cancelar
          </v-btn>
          <v-btn color="red" variant="text" @click="confirmRemove">
            Remover
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success/Error Notifications -->
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" location="top" timeout="3000">
      {{ snackbarMessage }}
      <template #actions>
        <v-btn variant="text" @click="showSnackbar = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Floating Action Button -->
    <v-fab
      class="fab-search"
      color="primary"
      icon="mdi-magnify"
      location="bottom end"
      size="large"
      @click="router.push('/search-products')"
    />

  </v-container>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
  import { useDisplay } from 'vuetify'

  const router = useRouter()
  // Types
  interface Product {
    id: number
    name: string
    price: number
    originalPrice?: number
    image: string
    marketplace: 'Amazon' | 'Shopee' | 'Mercado Livre' | 'AliExpress' | 'Americanas'
    offerType?: 'cashback' | 'points'
    offerValue?: string
  }

  interface Category {
    id: string
    name: string
    description: string
    icon: string
    color: string
    products: Product[]
  }

  // Composables
  const { mobile } = useDisplay()

  // State
  const categories = reactive<Category[]>([])

  // Dialog and notification state
  const showConfirmDialog = ref(false)
  const productToRemove = ref<Product | null>(null)
  const showSnackbar = ref(false)
  const snackbarMessage = ref('')
  const snackbarColor = ref('success')
  const showSearchDialog = ref(false)
  const searchQuery = ref('')

  // Computed
  const isMobile = computed(() => mobile.value)
  const maxItemsPerCategory = computed(() => isMobile.value ? 5 : 10)

  // Mock data
  const mockCategories: Omit<Category, 'products' | 'displayCount' | 'hasMore'>[] = [
    {
      id: 'most-searched',
      name: 'Mais Pesquisados',
      description: 'Os produtos mais buscados pelos usuários',
      icon: 'mdi-trending-up',
      color: 'primary',
    },
    {
      id: 'my-history',
      name: 'Meu Histórico',
      description: 'Produtos que você já pesquisou',
      icon: 'mdi-history',
      color: 'secondary',
    },
    {
      id: 'best-cashback',
      name: 'Melhores Ofertas de Cashback',
      description: 'Produtos com maior percentual de cashback',
      icon: 'mdi-cash-multiple',
      color: 'green',
    },
    {
      id: 'best-points',
      name: 'Melhores Ofertas de Pontos',
      description: 'Produtos que geram mais pontos',
      icon: 'mdi-star-circle',
      color: 'orange',
    },
    {
      id: 'recommended',
      name: 'Recomendados para Você',
      description: 'Selecionados especialmente para seu perfil',
      icon: 'mdi-heart',
      color: 'pink',
    },
  ]

  const generateProducts = (categoryId: string, count: number, startId = 1): Product[] => {
    const baseProducts = [
      {
        name: 'iPhone 15 Pro Max 256GB',
        price: 8999.99,
        originalPrice: 9499.99,
        image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
        marketplace: 'Amazon' as const,
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        price: 7499.9,
        originalPrice: 7999.9,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
        marketplace: 'Mercado Livre' as const,
      },
      {
        name: 'MacBook Air M2 13"',
        price: 12_999,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
        marketplace: 'Shopee' as const,
      },
      {
        name: 'AirPods Pro 2ª Geração',
        price: 1899.99,
        originalPrice: 2199.99,
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop',
        marketplace: 'AliExpress' as const,
      },
      {
        name: 'iPad Pro 11" M2',
        price: 6499,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
        marketplace: 'Americanas' as const,
      },
      {
        name: 'PlayStation 5 Console',
        price: 4299,
        originalPrice: 4699,
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop',
        marketplace: 'Amazon' as const,
      },
      {
        name: 'Nintendo Switch OLED',
        price: 2199,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        marketplace: 'Shopee' as const,
      },
      {
        name: 'Samsung 65" QLED 4K',
        price: 3899,
        originalPrice: 4299,
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
        marketplace: 'Mercado Livre' as const,
      },
      {
        name: 'Dell XPS 13 Intel i7',
        price: 8999,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
        marketplace: 'Americanas' as const,
      },
      {
        name: 'Apple Watch Series 9',
        price: 3299,
        originalPrice: 3599,
        image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop',
        marketplace: 'AliExpress' as const,
      },
    ]

    return Array.from({ length: count }, (_, i) => {
      const baseProduct = baseProducts[i % baseProducts.length]
      const product: Product = {
        ...baseProduct,
        id: startId + i,
        name: `${baseProduct.name} - ${categoryId} #${startId + i}`,
        price: baseProduct.price + (Math.random() * 200 - 100), // Vary price
      }

      // Add offer types based on category
      if (categoryId === 'best-cashback') {
        product.offerType = 'cashback'
        product.offerValue = `${(Math.random() * 15 + 5).toFixed(1)}% CB`
      } else if (categoryId === 'best-points') {
        product.offerType = 'points'
        product.offerValue = `${(Math.random() * 5 + 2).toFixed(1)}x pts`
      }

      return product
    })
  }

  // Methods
  const getDisplayProducts = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return []

    const limit = maxItemsPerCategory.value
    return category.products.slice(0, limit)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const getMarketplaceColor = (marketplace: string) => {
    const colors: Record<string, string> = {
      'Amazon': 'orange-darken-2',
      'Shopee': 'red',
      'Mercado Livre': 'yellow-darken-2',
      'AliExpress': 'red-darken-2',
      'Americanas': 'red-darken-3',
    }
    return colors[marketplace] || 'grey'
  }

  const getOfferColor = (offerType: string) => {
    return offerType === 'cashback' ? 'green' : 'orange'
  }

  const handleProductClick = (product: Product) => {
    showNotification(`Visualizando: ${product.name}`, 'info')
  }

  const handleEdit = (product: Product) => {
    console.log('Edit product:', product)
    showNotification(`Editando produto: ${product.name}`, 'info')
  }

  const handleRemove = (product: Product) => {
    productToRemove.value = product
    showConfirmDialog.value = true
  }

  const confirmRemove = () => {
    if (productToRemove.value) {
      for (const category of categories) {
        const index = category.products.findIndex(p => p.id === productToRemove.value!.id)
        if (index !== -1) {
          const productName = productToRemove.value!.name
          category.products.splice(index, 1)
          showNotification(`Produto "${productName}" removido com sucesso`, 'success')
        }
      }
    }
    showConfirmDialog.value = false
    productToRemove.value = null
  }

  const cancelRemove = () => {
    showConfirmDialog.value = false
    productToRemove.value = null
  }

  const showNotification = (message: string, color: 'success' | 'error' | 'info' = 'success') => {
    snackbarMessage.value = message
    snackbarColor.value = color
    showSnackbar.value = true
  }

  const openSearchDialog = () => {
    showSearchDialog.value = true
  }

  const closeSearchDialog = () => {
    showSearchDialog.value = false
    searchQuery.value = ''
  }

  const performSearch = () => {
    if (!searchQuery.value.trim()) return

    const query = searchQuery.value.toLowerCase()
    let foundProducts: Product[] = []

    // Search across all categories
    for (const category of categories) {
      const matchingProducts = category.products.filter(product =>
        product.name.toLowerCase().includes(query),
      )
      foundProducts.push(...matchingProducts)
    }

    closeSearchDialog()

    if (foundProducts.length > 0) {
      showNotification(`Encontrados ${foundProducts.length} produto(s) com "${searchQuery.value}"`, 'success')
    } else {
      showNotification(`Nenhum produto encontrado com "${searchQuery.value}"`, 'info')
    }
  }

  // Initialize categories
  const initializeCategories = () => {
    for (const categoryData of mockCategories) {
      const products = generateProducts(categoryData.id, 20) // Generate 20 products per category

      categories.push({
        ...categoryData,
        products,
      })
    }
  }

  // Lifecycle
  onMounted(() => {
    console.log('🎯 Lista de Produtos por Categorias montada')

    // Initialize categories with products
    initializeCategories()
  })

  onUnmounted(() => {
    console.log('👋 Lista de Produtos por Categorias desmontada')
  })

  console.log(`💡 Mobile: ${isMobile.value ? '5' : '10'} produtos por categoria`)
</script>

<style scoped>

  /* Custom styles */
  .category-section {
    border-radius: 16px;
    background: rgba(var(--v-theme-surface), 0.7);
    padding: 16px;
    backdrop-filter: blur(10px);
  }

  .observer-target {
    height: 20px;
    width: 100%;
  }

  /* Product Cards */
  .product-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    min-height: 120px;
  }

  .product-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  }

  .image-container {
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    width: 120px;
  }

  .product-image {
    transition: transform 0.3s ease;
  }

  .product-card:hover .product-image {
    transform: scale(1.05);
  }

  .marketplace-badge {
    position: absolute;
    top: 6px;
    left: 6px;
    z-index: 2;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .offer-badge {
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 2;
    font-weight: 600;
    color: white !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .price-text {
    font-size: 0.75rem;
    line-height: 1.2;
  }

  .original-price {
    text-decoration: line-through;
    font-size: 0.7rem;
  }

  .product-title {
    font-size: 0.75rem;
    line-height: 1.25;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 2.5em;
  }

  /* Responsive Typography */
  @media (max-width: 600px) {
    .product-title {
      font-size: 0.7rem;
      line-height: 1.2;
      max-height: 2.4em;
    }

    .price-text {
      font-size: 0.7rem;
    }

    .original-price {
      font-size: 0.65rem;
    }
  }

  /* Floating Action Button */
  .fab-search {
    position: fixed !important;
    bottom: 24px;
    right: 24px;
    z-index: 1000;
    box-shadow: 0 8px 24px rgba(25, 118, 210, 0.4) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fab-search:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(25, 118, 210, 0.5) !important;
  }

  @media (max-width: 600px) {
    .fab-search {
      bottom: 16px;
      right: 16px;
    }
  }

  /* Grid responsive improvements */
  @media (max-width: 400px) {
    .v-col {
      padding: 2px !important;
    }

    .product-card .v-card-text {
      padding: 12px !important;
    }

    .marketplace-badge,
    .offer-badge {
      top: 4px;
    }

    .marketplace-badge {
      left: 4px;
    }

    .offer-badge {
      right: 4px;
    }

    .image-container {
      width: 100px;
    }
  }

  /* Dark theme enhancements */
  .v-theme--dark .category-section {
    background: rgba(var(--v-theme-surface), 0.5);
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

  .v-col:nth-child(5) {
    animation-delay: 0.25s;
  }

  .v-col:nth-child(n+6) {
    animation-delay: 0.3s;
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
  .product-image {
    will-change: transform;
  }

  .product-card {
    contain: layout style paint;
  }
</style>
