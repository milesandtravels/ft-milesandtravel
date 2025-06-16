<template>
  <v-container class="pa-2 pa-md-4">
    <!-- Header Section -->
    <v-card
      class="elevation-4 rounded-lg mb-4 mb-md-6 mx-auto search-card"
      max-width="600"
    >
      <v-card-title class="pa-4 pa-md-6 pb-2 pb-md-4">
        <h2 class="text-h6 font-weight-bold">E-commerces</h2>
      </v-card-title>

      <v-card-text class="pa-4 pa-md-6 pt-2">
        <!-- E-commerce Autocomplete -->
        <v-autocomplete
          v-model="selectedEcommerce"
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
          placeholder="Digite o nome da loja..."
          prepend-inner-icon="mdi-store-search"
          return-object
          variant="outlined"
        >
          <template #item="{ props, item }">
            <v-list-item v-bind="props" class="px-3 py-2">
              <template #prepend>
                <div
                  class="ecommerce-avatar mr-3"
                  :style="{ backgroundColor: item.raw.color }"
                >
                  <span class="avatar-emoji">{{ item.raw.logo }}</span>
                </div>
              </template>
              <v-list-item-title class="text-body-2 font-weight-medium">
                {{ item.raw.name }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption">
                {{ item.raw.category }} • {{ item.raw.points }}
              </v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-autocomplete>

        <!-- Actions -->
        <div class="action-buttons">
          <v-btn
            block
            class="search-btn"
            color="primary"
            :loading="isSearching"
            prepend-icon="mdi-filter"
            size="large"
            @click="handleFilter"
          >
            Filtrar E-commerces
          </v-btn>
          <v-btn
            block
            class="clear-btn"
            prepend-icon="mdi-refresh"
            size="large"
            variant="outlined"
            @click="clearFilters"
          >
            Limpar
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Results Header -->
    <div
      v-if="filteredEcommerces.length > 0"
      class="results-header mb-3 mb-md-4 px-2 px-md-0"
    >
      <h3 class="text-h6 font-weight-bold">
        {{ filteredEcommerces.length }} loja{{
          filteredEcommerces.length > 1 ? 's' : ''
        }}
        encontrada{{ filteredEcommerces.length > 1 ? 's' : '' }}
      </h3>
    </div>

    <!-- E-commerce Grid -->
    <div v-if="filteredEcommerces.length > 0">
      <v-row class="ma-0">
        <v-col
          v-for="ecommerce in filteredEcommerces"
          :key="ecommerce.id"
          class="pa-1 pa-md-2"
          cols="6"
          lg="3"
          md="3"
          sm="4"
        >
          <v-card
            class="elevation-3 ecommerce-card h-100"
            hover
            @click="openBenefitsModal"
          >
            <div class="image-container">
              <div
                class="ecommerce-logo d-flex align-center justify-center"
                :style="{ backgroundColor: ecommerce.color }"
              >
                <span class="logo-emoji">{{ ecommerce.logo }}</span>
              </div>

              <!-- Category Badge -->
              <v-chip
                class="category-badge text-white"
                color="grey-darken-2"
                size="x-small"
                variant="flat"
              >
                {{ ecommerce.category }}
              </v-chip>
            </div>

            <v-card-text class="pa-2 pa-md-3">
              <div class="points-container mb-1 mb-md-2">
                <div class="d-flex align-center">
                  <v-icon class="mr-1" color="amber" size="16">mdi-star</v-icon>
                  <span class="points-text text-primary font-weight-bold">
                    {{ ecommerce.points }}
                  </span>
                </div>
              </div>

              <h4 class="ecommerce-title text-body-2 font-weight-medium">
                {{ ecommerce.name }}
              </h4>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center py-8 py-md-12">
      <v-progress-circular
        class="mb-3"
        color="primary"
        indeterminate
        size="40"
      />
      <p class="text-body-2 text-medium-emphasis">Carregando mais lojas...</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredEcommerces.length === 0 && !loading && hasFiltered"
      class="empty-state text-center py-8 py-md-12"
    >
      <v-icon class="mb-3" color="grey-lighten-1" size="48"
        >mdi-store-search-outline</v-icon
      >
      <h3 class="text-body-1 text-md-h6 font-weight-medium mb-2">
        Nenhuma loja encontrada
      </h3>
      <p class="text-body-2 text-medium-emphasis">
        Tente usar termos diferentes ou outras categorias
      </p>
    </div>

    <!-- Initial State -->
    <div
      v-else-if="!hasFiltered"
      class="initial-state text-center py-8 py-md-12"
    >
      <v-icon class="mb-3" color="primary" size="48">mdi-store-plus</v-icon>
      <h3 class="text-body-1 text-md-h6 font-weight-medium mb-2">
        Explore nossos e-commerces!
      </h3>
      <p class="text-body-2 text-medium-emphasis">
        Use a busca ou filtros para encontrar lojas específicas
      </p>
    </div>

    <!-- End of Results -->
    <div
      v-if="!hasMore && !loading && ecommerces.length > 0"
      class="text-center py-6"
    >
      <v-alert
        class="mx-auto"
        density="compact"
        icon="mdi-check-circle"
        max-width="400"
        type="success"
        variant="tonal"
      >
        Todas as lojas foram carregadas!
      </v-alert>
    </div>

    <!-- Intersection Observer Target -->
    <div ref="observerTarget" class="observer-target" />

    <!-- Benefits Modal -->
    <v-dialog
      v-model="benefitsModal"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card class="benefits-modal">
        <!-- Modal Header -->
        <v-toolbar color="primary" dark density="comfortable">
          <v-btn icon="mdi-close" @click="closeBenefitsModal" />
          <v-toolbar-title>Plataformas de Benefícios</v-toolbar-title>
        </v-toolbar>

        <!-- Modal Content -->
        <v-card-text class="pa-0">
          <v-container class="py-6">
            <div
              v-for="(platforms, category) in benefitPlatforms"
              :key="category"
              class="mb-8"
            >
              <!-- Category Header -->
              <div class="d-flex align-center mb-4">
                <v-avatar
                  class="mr-3"
                  :color="category === 'Pontos e Milhas' ? 'orange' : 'blue'"
                  size="48"
                >
                  <v-icon color="white" size="24">
                    {{
                      category === 'Pontos e Milhas'
                        ? 'mdi-airplane'
                        : 'mdi-cash-multiple'
                    }}
                  </v-icon>
                </v-avatar>
                <div>
                  <h2 class="text-h6 font-weight-bold">{{ category }}</h2>
                  <p class="text-caption text-medium-emphasis">
                    {{ platforms.length }}
                    {{
                      platforms.length === 1
                        ? 'plataforma disponível'
                        : 'plataformas disponíveis'
                    }}
                  </p>
                </div>
              </div>

              <!-- Platforms Grid -->
              <v-row class="ma-0">
                <v-col
                  v-for="(platform, index) in platforms"
                  :key="index"
                  class="pa-1 pa-md-2"
                  cols="6"
                  lg="3"
                  md="4"
                  sm="6"
                >
                  <v-card class="elevation-3 platform-card h-100" hover>
                    <div class="platform-image-container">
                      <div
                        class="platform-logo d-flex align-center justify-center"
                        :style="{
                          backgroundColor: getPlatformColor(platform.color),
                        }"
                      >
                        <span class="platform-emoji">{{ platform.logo }}</span>
                      </div>
                    </div>

                    <v-card-text class="pa-2 pa-md-3">
                      <div class="cashback-container mb-1 mb-md-2">
                        <span
                          class="cashback-text text-primary font-weight-bold"
                        >
                          {{ platform.cashback }}
                        </span>
                      </div>

                      <h4 class="platform-title text-body-2 font-weight-medium">
                        {{ platform.name }}
                      </h4>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

  definePageMeta({
    middleware: ['sanctum:auth']
  })

  // Types
  interface Ecommerce {
    id: number
    name: string
    logo: string
    color: string
    points: string
    category: string
  }

  interface BenefitPlatform {
    name: string
    cashback: string
    logo: string
    color: string
  }

  // State
  const searchQuery = ref('')
  const selectedEcommerce = ref<Ecommerce | null>(null)
  const searchResults = ref<Ecommerce[]>([])
  const benefitsModal = ref(false)
  const ecommerces = ref<Ecommerce[]>([])
  const results = ref<Ecommerce[]>([])
  const loading = ref(false)
  const isLoading = ref(false)
  const isSearching = ref(false)
  const page = ref(1)
  const hasMore = ref(true)
  const hasFiltered = ref(false)
  const observerTarget = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null
  let timer: NodeJS.Timeout

  // Initial data
  const initialEcommerces: Ecommerce[] = [
    {
      id: 1,
      name: 'Casas Bahia',
      logo: '🏠',
      color: '#e53e3e',
      points: '9.5 pt/R$',
      category: 'Casa & Decoração',
    },
    {
      id: 2,
      name: 'Pontofrio',
      logo: '📱',
      color: '#3182ce',
      points: '7 pt/R$',
      category: 'Eletrônicos',
    },
    {
      id: 3,
      name: 'Magazine Luiza',
      logo: '🛍️',
      color: '#d53f8c',
      points: '4 pt/R$',
      category: 'Variedades',
    },
    {
      id: 4,
      name: 'Extra',
      logo: '🛒',
      color: '#dd6b20',
      points: '6 pt/R$',
      category: 'Supermercado',
    },
    {
      id: 5,
      name: 'Amazon',
      logo: '📦',
      color: '#d69e2e',
      points: '3 pt/R$',
      category: 'Marketplace',
    },
    {
      id: 6,
      name: 'Lojas Renner',
      logo: '👗',
      color: '#805ad5',
      points: '7 pt/R$',
      category: 'Moda',
    },
    {
      id: 7,
      name: 'Netshoes',
      logo: '👟',
      color: '#5a67d8',
      points: '14 pt/R$',
      category: 'Esportes',
    },
    {
      id: 8,
      name: 'Booking',
      logo: '🏨',
      color: '#2b6cb0',
      points: '8 pt/R$',
      category: 'Viagens',
    },
    {
      id: 9,
      name: 'Shopee',
      logo: '🛍️',
      color: '#c05621',
      points: '2 pt/R$',
      category: 'Marketplace',
    },
  ]

  // Benefit platforms data
  const benefitPlatforms = ref<Record<string, BenefitPlatform[]>>({
    'Pontos e Milhas': [
      {
        name: 'Esfera',
        cashback: '5% de CashBack',
        logo: '🌟',
        color: 'green',
      },
      { name: 'Smiles', cashback: '3 pts', logo: '✈️', color: 'orange' },
      { name: 'Livelo', cashback: '5,2% pts', logo: '💎', color: 'pink' },
      { name: 'Latam Pass', cashback: '3.5% pts', logo: '🛫', color: 'blue' },
      { name: 'TudoAzul', cashback: '2.2% pts', logo: '🔵', color: 'indigo' },
    ],
    CashBack: [
      {
        name: 'Méliuz',
        cashback: '12% de CashBack',
        logo: '💰',
        color: 'pink',
      },
      {
        name: 'Mobils',
        cashback: '8% de CashBack',
        logo: '📱',
        color: 'purple',
      },
      {
        name: 'PicPay',
        cashback: '15% de CashBack',
        logo: '💳',
        color: 'green',
      },
      {
        name: 'Luiza BB',
        cashback: '8% de CashBack',
        logo: '⭐',
        color: 'amber',
      },
      {
        name: 'BusCoop',
        cashback: '6% de CashBack',
        logo: '🚌',
        color: 'blue',
      },
      { name: 'Zoom', cashback: '6% de CashBack', logo: '🔍', color: 'grey' },
      {
        name: 'Banco Pan',
        cashback: '6% de CashBack',
        logo: '🏦',
        color: 'indigo',
      },
      {
        name: 'Banco Inter',
        cashback: '5% de CashBack',
        logo: '💼',
        color: 'deep-orange',
      },
    ],
  })

  // Computed
  const filteredEcommerces = computed(() => {
    if (results.value.length > 0) {
      return results.value
    }
    return hasFiltered.value ? [] : ecommerces.value
  })

  // Methods
  const searchEcommerces = (query: string) => {
    if (!query.trim()) {
      searchResults.value = []
      return
    }

    isLoading.value = true

    setTimeout(() => {
      const filtered = ecommerces.value.filter(
        ecommerce =>
          ecommerce.name.toLowerCase().includes(query.toLowerCase()) ||
          ecommerce.category.toLowerCase().includes(query.toLowerCase())
      )
      searchResults.value = filtered
      isLoading.value = false
    }, 300)
  }

  const handleFilter = async () => {
    isSearching.value = true
    hasFiltered.value = true

    setTimeout(() => {
      let filtered = [...ecommerces.value]

      // Filter by name or selected ecommerce
      if (searchQuery.value || selectedEcommerce.value) {
        const query = searchQuery.value || selectedEcommerce.value?.name || ''
        filtered = filtered.filter(
          ecommerce =>
            ecommerce.name.toLowerCase().includes(query.toLowerCase()) ||
            ecommerce.category.toLowerCase().includes(query.toLowerCase())
        )
      }

      results.value = filtered
      isSearching.value = false
    }, 800)
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedEcommerce.value = null
    searchResults.value = []
    results.value = []
    hasFiltered.value = false
  }

  const loadMoreEcommerces = async () => {
    if (loading.value || !hasMore.value) return

    loading.value = true

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newEcommerces = initialEcommerces.map(ecommerce => ({
      ...ecommerce,
      id: ecommerce.id + page.value * initialEcommerces.length,
      name: `${ecommerce.name}${page.value > 1 ? ` #${page.value}` : ''}`,
    }))

    ecommerces.value.push(...newEcommerces)
    page.value++
    loading.value = false

    // Stop loading after 3 pages
    if (page.value >= 4) {
      hasMore.value = false
    }
  }

  const setupIntersectionObserver = () => {
    if (!observerTarget.value) return

    observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore.value && !loading.value) {
          loadMoreEcommerces()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(observerTarget.value)
  }

  const openBenefitsModal = () => {
    benefitsModal.value = true
  }

  const closeBenefitsModal = () => {
    benefitsModal.value = false
  }

  const getPlatformColor = (color: string) => {
    const colors: Record<string, string> = {
      green: '#4CAF50',
      orange: '#FF9800',
      pink: '#E91E63',
      blue: '#2196F3',
      indigo: '#3F51B5',
      purple: '#9C27B0',
      amber: '#FFC107',
      grey: '#9E9E9E',
      'deep-orange': '#FF5722',
    }
    return colors[color] || '#666'
  }

  // Lifecycle
  onMounted(async () => {
    console.log('🎯 Página de E-commerces montada')

    // Load initial data
    ecommerces.value = [...initialEcommerces]

    // Setup intersection observer after DOM update
    await nextTick()
    setupIntersectionObserver()
  })

  onUnmounted(() => {
    console.log('👋 Página de E-commerces desmontada')

    if (observer) {
      observer.disconnect()
    }

    if (timer) {
      clearTimeout(timer)
    }
  })

  // Watch search query for autocomplete
  watch(searchQuery, newQuery => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      searchEcommerces(newQuery)
    }, 500)
  })

  console.log(
    '💡 Teste com: "Casas Bahia", "Amazon", "Magazine", "Marketplace"'
  )
</script>

<style scoped>
  /* Search Card */
  .search-card {
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* E-commerce Avatar in Autocomplete */
  .ecommerce-avatar {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar-emoji {
    font-size: 1.2rem;
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

  /* E-commerce Cards */
  .ecommerce-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }

  .ecommerce-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  }

  .image-container {
    position: relative;
    overflow: hidden;
  }

  .ecommerce-logo {
    height: 140px;
    transition: transform 0.3s ease;
    background: linear-gradient(
      135deg,
      var(--color) 0%,
      var(--color-dark) 100%
    );
  }

  .ecommerce-card:hover .ecommerce-logo {
    transform: scale(1.05);
  }

  .logo-emoji {
    font-size: 3rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  .category-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 2;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .points-text {
    font-size: 0.9rem;
    line-height: 1.2;
  }

  @media (min-width: 768px) {
    .points-text {
      font-size: 1rem;
    }
  }

  .ecommerce-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
    min-height: 2.6em;
    max-height: 2.6em;
  }

  /* Platform Cards */
  .platform-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .platform-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  }

  .platform-image-container {
    position: relative;
    overflow: hidden;
  }

  .platform-logo {
    height: 100px;
    transition: transform 0.3s ease;
  }

  .platform-card:hover .platform-logo {
    transform: scale(1.05);
  }

  .platform-emoji {
    font-size: 2rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  .cashback-text {
    font-size: 0.85rem;
    line-height: 1.2;
  }

  .platform-title {
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
    .ecommerce-title,
    .platform-title {
      font-size: 0.8rem;
      line-height: 1.2;
      min-height: 2.4em;
      max-height: 2.4em;
    }

    .logo-emoji {
      font-size: 2.5rem;
    }

    .platform-emoji {
      font-size: 1.5rem;
    }

    .ecommerce-logo {
      height: 120px;
    }

    .platform-logo {
      height: 80px;
    }
  }

  /* Grid responsive improvements */
  @media (max-width: 400px) {
    .v-col {
      padding: 2px !important;
    }

    .ecommerce-card .v-card-text,
    .platform-card .v-card-text {
      padding: 8px !important;
    }

    .category-badge {
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

  .observer-target {
    height: 20px;
    width: 100%;
  }

  /* Dark theme enhancements */
  .v-theme--dark .search-card {
    background: rgba(30, 30, 30, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .v-theme--dark .ecommerce-card,
  .v-theme--dark .platform-card {
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
  .ecommerce-logo,
  .platform-logo {
    will-change: transform;
  }

  .ecommerce-card,
  .platform-card {
    contain: layout style paint;
  }
</style>
