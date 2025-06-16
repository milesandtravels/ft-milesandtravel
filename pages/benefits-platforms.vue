<template>
  <v-container class="pa-2 pa-md-4">
    <!-- Header Section -->
    <v-card
      class="elevation-4 rounded-lg mb-4 mb-md-6 mx-auto search-card"
      max-width="600"
    >
      <v-card-title class="pa-4 pa-md-6 pb-2 pb-md-4">
        <h2 class="text-h6 font-weight-bold">Plataformas de Benefícios</h2>
      </v-card-title>

      <v-card-text class="pa-4 pa-md-6 pt-2">
        <!-- Platform Autocomplete -->
        <v-autocomplete
          v-model="selectedPlatform"
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
          placeholder="Digite o nome da plataforma..."
          prepend-inner-icon="mdi-gift-outline"
          return-object
          variant="outlined"
        >
          <template #item="{ props, item }">
            <v-list-item v-bind="props" class="px-3 py-2">
              <template #prepend>
                <div
                  class="platform-avatar mr-3"
                  :style="{ backgroundColor: getPlatformColor(item.raw.color) }"
                >
                  <span class="avatar-emoji">{{ item.raw.logo }}</span>
                </div>
              </template>
              <v-list-item-title class="text-body-2 font-weight-medium">
                {{ item.raw.name }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption">
                {{ item.raw.type }} • {{ item.raw.cashback }}
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
            Filtrar Plataformas
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
      v-if="filteredPlatforms.length > 0"
      class="results-header mb-3 mb-md-4 px-2 px-md-0"
    >
      <h3 class="text-h6 font-weight-bold">
        {{ filteredPlatforms.length }} plataforma{{
          filteredPlatforms.length > 1 ? 's' : ''
        }}
        encontrada{{ filteredPlatforms.length > 1 ? 's' : '' }}
      </h3>
    </div>

    <!-- Platforms Grid -->
    <div v-if="filteredPlatforms.length > 0">
      <v-row class="ma-0">
        <v-col
          v-for="platform in filteredPlatforms"
          :key="platform.id"
          class="pa-1 pa-md-2"
          cols="6"
          lg="3"
          md="3"
          sm="4"
        >
          <v-card
            class="elevation-3 platform-card h-100"
            hover
            @click="openEcommercesModal"
          >
            <div class="image-container">
              <div
                class="platform-logo d-flex align-center justify-center"
                :style="{ backgroundColor: getPlatformColor(platform.color) }"
              >
                <span class="logo-emoji">{{ platform.logo }}</span>
              </div>

              <!-- Type Badge -->
              <v-chip
                class="type-badge text-white"
                :color="platform.type === 'Pontos e Milhas' ? 'orange' : 'blue'"
                size="x-small"
                variant="flat"
              >
                {{ platform.type }}
              </v-chip>
            </div>

            <v-card-text class="pa-2 pa-md-3">
              <div class="cashback-container mb-1 mb-md-2">
                <div class="d-flex align-center">
                  <v-icon
                    class="mr-1"
                    :color="
                      platform.type === 'Pontos e Milhas' ? 'orange' : 'green'
                    "
                    size="16"
                  >
                    {{
                      platform.type === 'Pontos e Milhas'
                        ? 'mdi-airplane'
                        : 'mdi-cash'
                    }}
                  </v-icon>
                  <span class="cashback-text text-primary font-weight-bold">
                    {{ platform.cashback }}
                  </span>
                </div>
              </div>

              <h4 class="platform-title text-body-2 font-weight-medium">
                {{ platform.name }}
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
      <p class="text-body-2 text-medium-emphasis">
        Carregando mais plataformas...
      </p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredPlatforms.length === 0 && !loading && hasFiltered"
      class="empty-state text-center py-8 py-md-12"
    >
      <v-icon class="mb-3" color="grey-lighten-1" size="48"
        >mdi-gift-off-outline</v-icon
      >
      <h3 class="text-body-1 text-md-h6 font-weight-medium mb-2">
        Nenhuma plataforma encontrada
      </h3>
      <p class="text-body-2 text-medium-emphasis">
        Tente usar termos diferentes ou outros tipos
      </p>
    </div>

    <!-- Initial State -->
    <div
      v-else-if="!hasFiltered"
      class="initial-state text-center py-8 py-md-12"
    >
      <v-icon class="mb-3" color="primary" size="48">mdi-gift-plus</v-icon>
      <h3 class="text-body-1 text-md-h6 font-weight-medium mb-2">
        Explore nossas plataformas de benefícios!
      </h3>
      <p class="text-body-2 text-medium-emphasis">
        Use a busca para encontrar plataformas específicas de pontos ou cashback
      </p>
    </div>

    <!-- End of Results -->
    <div
      v-if="!hasMore && !loading && platforms.length > 0"
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
        Todas as plataformas foram carregadas!
      </v-alert>
    </div>

    <!-- Intersection Observer Target -->
    <div ref="observerTarget" class="observer-target" />

    <!-- E-commerces Modal -->
    <v-dialog
      v-model="ecommercesModal"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card class="ecommerces-modal">
        <!-- Modal Header -->
        <v-toolbar color="primary" dark density="comfortable">
          <v-btn icon="mdi-close" @click="closeEcommercesModal" />
          <v-toolbar-title>E-commerces Parceiros</v-toolbar-title>
        </v-toolbar>

        <!-- Modal Content -->
        <v-card-text class="pa-0">
          <v-container class="py-6">
            <div
              v-for="(ecommerces, category) in ecommercesByCategory"
              :key="category"
              class="mb-8"
            >
              <!-- Category Header -->
              <div class="d-flex align-center mb-4">
                <v-avatar class="mr-3" color="primary" size="48">
                  <v-icon color="white" size="24">
                    {{ getCategoryIcon(category) }}
                  </v-icon>
                </v-avatar>
                <div>
                  <h2 class="text-h6 font-weight-bold">{{ category }}</h2>
                  <p class="text-caption text-medium-emphasis">
                    {{ ecommerces.length }}
                    {{
                      ecommerces.length === 1
                        ? 'loja disponível'
                        : 'lojas disponíveis'
                    }}
                  </p>
                </div>
              </div>

              <!-- E-commerces Grid -->
              <v-row class="ma-0">
                <v-col
                  v-for="(ecommerce, index) in ecommerces"
                  :key="index"
                  class="pa-1 pa-md-2"
                  cols="6"
                  lg="3"
                  md="4"
                  sm="6"
                >
                  <v-card class="elevation-3 ecommerce-card h-100" hover>
                    <div class="ecommerce-image-container">
                      <div
                        class="ecommerce-logo d-flex align-center justify-center"
                        :style="{ backgroundColor: ecommerce.color }"
                      >
                        <span class="ecommerce-emoji">{{
                          ecommerce.logo
                        }}</span>
                      </div>
                    </div>

                    <v-card-text class="pa-2 pa-md-3">
                      <div class="points-container mb-1 mb-md-2">
                        <div class="d-flex align-center">
                          <v-icon class="mr-1" color="amber" size="16"
                            >mdi-star</v-icon
                          >
                          <span
                            class="points-text text-primary font-weight-bold"
                          >
                            {{ ecommerce.points }}
                          </span>
                        </div>
                      </div>

                      <h4
                        class="ecommerce-title text-body-2 font-weight-medium"
                      >
                        {{ ecommerce.name }}
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
    middleware: ['sanctum:auth'],
  })
  // Types
  interface Platform {
    id: number
    name: string
    logo: string
    color: string
    cashback: string
    type: string
  }

  interface Ecommerce {
    id: number
    name: string
    logo: string
    color: string
    points: string
    category: string
  }

  // State
  const searchQuery = ref('')
  const selectedPlatform = ref<Platform | null>(null)
  const searchResults = ref<Platform[]>([])
  const ecommercesModal = ref(false)
  const platforms = ref<Platform[]>([])
  const results = ref<Platform[]>([])
  const loading = ref(false)
  const isLoading = ref(false)
  const isSearching = ref(false)
  const page = ref(1)
  const hasMore = ref(true)
  const hasFiltered = ref(false)
  const observerTarget = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null
  let timer: NodeJS.Timeout

  // Initial platforms data
  const initialPlatforms: Platform[] = [
    {
      id: 1,
      name: 'Esfera',
      logo: '🌟',
      color: 'green',
      cashback: '5% de CashBack',
      type: 'Pontos e Milhas',
    },
    {
      id: 2,
      name: 'Smiles',
      logo: '✈️',
      color: 'orange',
      cashback: '3 pts',
      type: 'Pontos e Milhas',
    },
    {
      id: 3,
      name: 'Livelo',
      logo: '💎',
      color: 'pink',
      cashback: '5,2% pts',
      type: 'Pontos e Milhas',
    },
    {
      id: 4,
      name: 'Latam Pass',
      logo: '🛫',
      color: 'blue',
      cashback: '3.5% pts',
      type: 'Pontos e Milhas',
    },
    {
      id: 5,
      name: 'TudoAzul',
      logo: '🔵',
      color: 'indigo',
      cashback: '2.2% pts',
      type: 'Pontos e Milhas',
    },
    {
      id: 6,
      name: 'Méliuz',
      logo: '💰',
      color: 'pink',
      cashback: '12% de CashBack',
      type: 'CashBack',
    },
    {
      id: 7,
      name: 'Mobils',
      logo: '📱',
      color: 'purple',
      cashback: '8% de CashBack',
      type: 'CashBack',
    },
    {
      id: 8,
      name: 'PicPay',
      logo: '💳',
      color: 'green',
      cashback: '15% de CashBack',
      type: 'CashBack',
    },
    {
      id: 9,
      name: 'Luiza BB',
      logo: '⭐',
      color: 'amber',
      cashback: '8% de CashBack',
      type: 'CashBack',
    },
    {
      id: 10,
      name: 'BusCoop',
      logo: '🚌',
      color: 'blue',
      cashback: '6% de CashBack',
      type: 'CashBack',
    },
    {
      id: 11,
      name: 'Zoom',
      logo: '🔍',
      color: 'grey',
      cashback: '6% de CashBack',
      type: 'CashBack',
    },
    {
      id: 12,
      name: 'Banco Pan',
      logo: '🏦',
      color: 'indigo',
      cashback: '6% de CashBack',
      type: 'CashBack',
    },
    {
      id: 13,
      name: 'Banco Inter',
      logo: '💼',
      color: 'deep-orange',
      cashback: '5% de CashBack',
      type: 'CashBack',
    },
  ]

  // E-commerces data
  const ecommercesData: Ecommerce[] = [
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

  // Computed
  const filteredPlatforms = computed(() => {
    if (results.value.length > 0) {
      return results.value
    }
    return hasFiltered.value ? [] : platforms.value
  })

  const ecommercesByCategory = computed(() => {
    const grouped: Record<string, Ecommerce[]> = {}

    for (const ecommerce of ecommercesData) {
      if (!grouped[ecommerce.category]) {
        grouped[ecommerce.category] = []
      }
      grouped[ecommerce.category].push(ecommerce)
    }

    return grouped
  })

  // Methods
  const searchPlatforms = (query: string) => {
    if (!query.trim()) {
      searchResults.value = []
      return
    }

    isLoading.value = true

    setTimeout(() => {
      const filtered = platforms.value.filter(
        platform =>
          platform.name.toLowerCase().includes(query.toLowerCase()) ||
          platform.type.toLowerCase().includes(query.toLowerCase()) ||
          platform.cashback.toLowerCase().includes(query.toLowerCase())
      )
      searchResults.value = filtered
      isLoading.value = false
    }, 300)
  }

  const handleFilter = async () => {
    isSearching.value = true
    hasFiltered.value = true

    setTimeout(() => {
      let filtered = [...platforms.value]

      // Filter by name or selected platform
      if (searchQuery.value || selectedPlatform.value) {
        const query = searchQuery.value || selectedPlatform.value?.name || ''
        filtered = filtered.filter(
          platform =>
            platform.name.toLowerCase().includes(query.toLowerCase()) ||
            platform.type.toLowerCase().includes(query.toLowerCase()) ||
            platform.cashback.toLowerCase().includes(query.toLowerCase())
        )
      }

      results.value = filtered
      isSearching.value = false
    }, 800)
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedPlatform.value = null
    searchResults.value = []
    results.value = []
    hasFiltered.value = false
  }

  const loadMorePlatforms = async () => {
    if (loading.value || !hasMore.value) return

    loading.value = true

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newPlatforms = initialPlatforms.map(platform => ({
      ...platform,
      id: platform.id + page.value * initialPlatforms.length,
      name: `${platform.name}${page.value > 1 ? ` #${page.value}` : ''}`,
    }))

    platforms.value.push(...newPlatforms)
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
          loadMorePlatforms()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(observerTarget.value)
  }

  const openEcommercesModal = () => {
    ecommercesModal.value = true
  }

  const closeEcommercesModal = () => {
    ecommercesModal.value = false
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

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Casa & Decoração': 'mdi-home',
      Eletrônicos: 'mdi-cellphone',
      Variedades: 'mdi-shopping',
      Supermercado: 'mdi-cart',
      Marketplace: 'mdi-store',
      Moda: 'mdi-tshirt-crew',
      Esportes: 'mdi-run',
      Viagens: 'mdi-airplane',
    }
    return icons[category] || 'mdi-store'
  }

  // Lifecycle
  onMounted(async () => {
    console.log('🎯 Página de Plataformas de Benefícios montada')

    // Load initial data
    platforms.value = [...initialPlatforms]

    // Setup intersection observer after DOM update
    await nextTick()
    setupIntersectionObserver()
  })

  onUnmounted(() => {
    console.log('👋 Página de Plataformas de Benefícios desmontada')

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
      searchPlatforms(newQuery)
    }, 500)
  })

  console.log('💡 Teste com: "Smiles", "Méliuz", "CashBack", "Pontos"')
</script>

<style scoped>
  /* Search Card */
  .search-card {
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* Platform Avatar in Autocomplete */
  .platform-avatar {
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

  /* Platform Cards */
  .platform-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }

  .platform-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  }

  .image-container {
    position: relative;
    overflow: hidden;
  }

  .platform-logo {
    height: 140px;
    transition: transform 0.3s ease;
  }

  .platform-card:hover .platform-logo {
    transform: scale(1.05);
  }

  .logo-emoji {
    font-size: 3rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  .type-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 2;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .cashback-text {
    font-size: 0.9rem;
    line-height: 1.2;
  }

  @media (min-width: 768px) {
    .cashback-text {
      font-size: 1rem;
    }
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

  /* E-commerce Cards in Modal */
  .ecommerce-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ecommerce-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  }

  .ecommerce-image-container {
    position: relative;
    overflow: hidden;
  }

  .ecommerce-logo {
    height: 100px;
    transition: transform 0.3s ease;
  }

  .ecommerce-card:hover .ecommerce-logo {
    transform: scale(1.05);
  }

  .ecommerce-emoji {
    font-size: 2rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  .points-text {
    font-size: 0.85rem;
    line-height: 1.2;
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

  /* Responsive Typography */
  @media (max-width: 600px) {
    .platform-title,
    .ecommerce-title {
      font-size: 0.8rem;
      line-height: 1.2;
      min-height: 2.4em;
      max-height: 2.4em;
    }

    .logo-emoji {
      font-size: 2.5rem;
    }

    .ecommerce-emoji {
      font-size: 1.5rem;
    }

    .platform-logo {
      height: 120px;
    }

    .ecommerce-logo {
      height: 80px;
    }
  }

  /* Grid responsive improvements */
  @media (max-width: 400px) {
    .v-col {
      padding: 2px !important;
    }

    .platform-card .v-card-text,
    .ecommerce-card .v-card-text {
      padding: 8px !important;
    }

    .type-badge {
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

  .v-theme--dark .platform-card,
  .v-theme--dark .ecommerce-card {
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
  .platform-logo,
  .ecommerce-logo {
    will-change: transform;
  }

  .platform-card,
  .ecommerce-card {
    contain: layout style paint;
  }
</style>
