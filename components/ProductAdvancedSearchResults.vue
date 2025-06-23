<template>
  <v-container fluid class="pa-0">
    <!-- Header Section -->
    <v-container
      :fluid="$vuetify.display.mobile"
      class="results-header-container"
    >
      <v-row no-gutters>
        <v-col cols="12">
          <!-- Mobile Header Layout -->
          <div v-if="$vuetify.display.mobile" class="mobile-header">
            <div class="d-flex justify-space-between align-center mb-3">
              <h3 class="text-h6 font-weight-bold text-truncate">
                {{ results.length }} produto{{ results.length > 1 ? 's' : '' }}
              </h3>

              <v-chip
                v-if="selectedProducts.length > 0"
                color="primary"
                size="small"
                variant="flat"
                class="ml-2"
              >
                {{ selectedProducts.length }}
              </v-chip>
            </div>

            <div class="d-flex justify-space-between align-center">
              <v-checkbox
                v-model="selectAll"
                :indeterminate="isIndeterminate"
                color="primary"
                density="compact"
                hide-details
                class="select-all-mobile"
                @change="handleSelectAll"
              >
                <template #label>
                  <span class="text-body-2">
                    {{ getSelectAllLabel }}
                  </span>
                </template>
              </v-checkbox>

              <div class="d-flex align-center ga-2">
                <!-- Botão Deselecionar Todos (Mobile) -->
                <v-btn
                  v-if="selectedProducts.length > 0 && !selectAll"
                  color="error"
                  variant="text"
                  size="small"
                  @click="deselectAll"
                >
                  Limpar
                </v-btn>

                <v-btn
                  color="primary"
                  variant="outlined"
                  size="small"
                  icon="mdi-filter-variant"
                  @click="openFilter"
                />
              </div>
            </div>
          </div>

          <!-- Desktop Header Layout -->
          <div v-else class="desktop-header">
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex align-center">
                <h3 class="text-h5 font-weight-bold mr-4">
                  {{ results.length }} produto{{
                    results.length > 1 ? 's' : ''
                  }}
                  encontrado{{ results.length > 1 ? 's' : '' }}
                </h3>

                <v-chip
                  v-if="selectedProducts.length > 0"
                  color="primary"
                  size="default"
                  variant="flat"
                  class="selection-counter"
                >
                  <v-icon start size="small">mdi-check-circle</v-icon>
                  {{ selectedProducts.length }} selecionado{{
                    selectedProducts.length > 1 ? 's' : ''
                  }}
                </v-chip>
              </div>

              <div class="d-flex align-center ga-4">
                <v-checkbox
                  v-model="selectAll"
                  :indeterminate="isIndeterminate"
                  color="primary"
                  density="comfortable"
                  hide-details
                  class="select-all-desktop"
                  @change="handleSelectAll"
                >
                  <template #label>
                    <span class="text-body-1 font-weight-medium">
                      {{ getSelectAllLabel }}
                    </span>
                  </template>
                </v-checkbox>

                <!-- Botão Deselecionar Todos (Desktop) -->
                <v-btn
                  v-if="selectedProducts.length > 0 && !selectAll"
                  color="error"
                  variant="outlined"
                  size="default"
                  prepend-icon="mdi-close-circle"
                  @click="deselectAll"
                >
                  Remover seleção
                </v-btn>

                <v-btn
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-filter-variant"
                  size="default"
                  @click="openFilter"
                >
                  Filtrar
                </v-btn>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Products Grid Section -->
    <v-container
      :fluid="$vuetify.display.mobile"
      class="products-container"
      :class="{ 'mobile-container': $vuetify.display.mobile }"
    >
      <v-row
        :class="$vuetify.display.mobile ? 'mobile-row' : 'desktop-row'"
        no-gutters
      >
        <v-col
          v-for="product in results"
          :key="product.id"
          :cols="$vuetify.display.mobile ? 6 : 12"
          :sm="$vuetify.display.smAndUp ? 6 : 12"
          :md="$vuetify.display.mdAndUp ? 4 : 6"
          :lg="$vuetify.display.lgAndUp ? 3 : 4"
          :xl="$vuetify.display.xlAndUp ? 3 : 3"
          class="product-col"
        >
          <v-card
            class="product-card h-100"
            :class="{
              'selected-card': selectedProducts.includes(product.id),
              'mobile-card': $vuetify.display.mobile,
              'desktop-card': !$vuetify.display.mobile,
            }"
            :hover="!$vuetify.display.mobile"
            :elevation="
              selectedProducts.includes(product.id)
                ? 6
                : $vuetify.display.mobile
                  ? 1
                  : 2
            "
            @click="
              $vuetify.display.mobile ? toggleSelection(product.id) : null
            "
          >
            <!-- Selection Overlay for Mobile -->
            <div
              v-if="
                $vuetify.display.mobile && selectedProducts.includes(product.id)
              "
              class="selection-overlay"
            >
              <v-icon color="white" size="large">mdi-check-circle</v-icon>
            </div>

            <!-- Desktop Checkbox -->
            <v-checkbox
              v-if="!$vuetify.display.mobile"
              v-model="selectedProducts"
              :value="product.id"
              color="primary"
              density="compact"
              hide-details
              class="product-checkbox-desktop"
              @click.stop
            />

            <!-- Mobile Selection Indicator -->
            <div
              v-if="$vuetify.display.mobile"
              class="mobile-selection-indicator"
              :class="{ selected: selectedProducts.includes(product.id) }"
            >
              <v-icon
                :color="
                  selectedProducts.includes(product.id)
                    ? 'primary'
                    : 'grey-lighten-2'
                "
                size="small"
              >
                {{
                  selectedProducts.includes(product.id)
                    ? 'mdi-checkbox-marked-circle'
                    : 'mdi-checkbox-blank-circle-outline'
                }}
              </v-icon>
            </div>

            <div class="image-container">
              <v-img
                class="product-image"
                cover
                :height="$vuetify.display.mobile ? 140 : 180"
                :src="product.image_url"
                :aspect-ratio="1"
              >
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                      indeterminate
                      :size="$vuetify.display.mobile ? 24 : 32"
                      width="2"
                      color="primary"
                    />
                  </div>
                </template>
              </v-img>

              <!-- Marketplace Badge -->
              <v-chip
                class="marketplace-badge"
                :color="getMarketplaceColor(product.ecommerce.name)"
                :size="$vuetify.display.mobile ? 'x-small' : 'small'"
                variant="flat"
                label
              >
                <span class="marketplace-text text-white font-weight-bold">
                  {{
                    $vuetify.display.mobile
                      ? getMarketplaceAbbr(product.ecommerce.name)
                      : product.ecommerce.name
                  }}
                </span>
              </v-chip>
            </div>

            <v-card-text class="product-content">
              <div class="price-container">
                <span
                  class="price-text text-primary font-weight-bold"
                  :class="$vuetify.display.mobile ? 'text-body-2' : 'text-h6'"
                >
                  {{ formatPrice(product.price) }}
                </span>
              </div>

              <h4
                class="product-title font-weight-medium"
                :class="
                  $vuetify.display.mobile
                    ? 'text-caption mt-1'
                    : 'text-body-2 mt-2'
                "
              >
                {{ product.name }}
              </h4>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Barra de ação fixa no final da página -->
    <div v-if="selectedProducts.length > 0" class="action-bar">
      <v-container fluid class="pa-0">
        <div class="action-bar-content">
          <!-- Mobile Layout -->
          <div
            v-if="$vuetify.display.mobile"
            class="d-flex align-center justify-space-between"
          >
            <div class="selection-info">
              <v-icon color="white" size="small" class="mr-1"
                >mdi-check-circle</v-icon
              >
              <span class="text-white text-body-2 font-weight-medium">
                {{ selectedProducts.length }} selecionado{{
                  selectedProducts.length > 1 ? 's' : ''
                }}
              </span>
            </div>

            <v-btn
              color="white"
              variant="flat"
              size="small"
              class="font-weight-bold text-primary mobile-action-btn"
              :loading="loadingAdvantages"
              @click="exploreAdvantages"
            >
              <v-icon start size="x-small">mdi-star</v-icon>
              <span class="mobile-btn-text">Explorar</span>
            </v-btn>
          </div>

          <!-- Desktop Layout -->
          <div v-else class="d-flex align-center justify-space-between">
            <div class="selection-info">
              <v-icon color="white" size="default" class="mr-2"
                >mdi-check-circle</v-icon
              >
              <span class="text-white text-body-1 font-weight-medium">
                {{ selectedProducts.length }} produto{{
                  selectedProducts.length > 1 ? 's' : ''
                }}
                selecionado{{ selectedProducts.length > 1 ? 's' : '' }}
              </span>
            </div>

            <div class="d-flex align-center ga-3">
              <v-btn
                color="white"
                variant="text"
                size="default"
                class="text-white"
                @click="deselectAll"
              >
                <v-icon start size="small">mdi-close</v-icon>
                Limpar
              </v-btn>

              <v-btn
                color="white"
                variant="flat"
                size="large"
                class="font-weight-bold text-primary px-6"
                :loading="loadingAdvantages"
                @click="exploreAdvantages"
              >
                <v-icon start>mdi-star</v-icon>
                Explorar vantagens
              </v-btn>
            </div>
          </div>
        </div>
      </v-container>
    </div>

    <product-advanced-search-filters v-model="displayFilters" />
  </v-container>
</template>

<script lang="ts" setup>
  import { defineEmits, defineProps } from 'vue'
import type { Product } from '~/interfaces/products'

  interface Props {
    results: Product[]
    searchId: string | number
  }

  interface Emits {
    (e: 'update:selectedProducts', value: number[]): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const displayFilters = ref<boolean>(false)
  const selectedProducts = ref<number[]>([])
  const loadingAdvantages = ref<boolean>(false)

  // Computed para o estado do checkbox "Selecionar todos"
  const selectAll = computed({
    get: () =>
      selectedProducts.value.length === props.results.length &&
      props.results.length > 0,
    set: (value: boolean) => {
      if (value) {
        selectedProducts.value = props.results.map(product => product.id)
      } else {
        selectedProducts.value = []
      }
    },
  })

  // Computed para estado indeterminado
  const isIndeterminate = computed(() => {
    return (
      selectedProducts.value.length > 0 &&
      selectedProducts.value.length < props.results.length
    )
  })

  // Watcher para emitir mudanças no array de produtos selecionados
  watch(
    selectedProducts,
    newValue => {
      emit('update:selectedProducts', newValue)
    },
    { deep: true }
  )

  // Função para lidar com "selecionar todos"
  const handleSelectAll = (value: boolean) => {
    if (value) {
      selectedProducts.value = props.results.map(product => product.id)
    } else {
      selectedProducts.value = []
    }
  }

  // Computed para o label do checkbox "Selecionar todos"
  const getSelectAllLabel = computed(() => {
    if (selectedProducts.value.length === 0) {
      return 'Selecionar todos'
    } else if (selectedProducts.value.length === props.results.length) {
      return 'Todos selecionados'
    } else {
      return 'Selecionar todos'
    }
  })

  // Função para deselecionar todos
  const deselectAll = () => {
    selectedProducts.value = []
  }

  // Função para alternar seleção (mobile)
  const toggleSelection = (productId: number) => {
    const index = selectedProducts.value.indexOf(productId)
    if (index > -1) {
      selectedProducts.value.splice(index, 1)
    } else {
      selectedProducts.value.push(productId)
    }
  }

  // Função para explorar vantagens dos produtos selecionados

  const updateSearch = async () => {
    useSanctumFetch<any>(
      `/api/searches/${props.searchId}/update-and-sync-products`,
      {
        method: 'PUT',
        body: {
          name: 'custom-search',
          products: selectedProducts.value,
        },
      }
    )
  }

  const exploreAdvantages = async () => {
    if (selectedProducts.value.length === 0) return

    loadingAdvantages.value = true

    try {
      await updateSearch()
      navigateTo(`/offers?searchId=${props.searchId}`)
    } catch (error) {
      console.error('Erro ao explorar vantagens:', error)
    } finally {
      loadingAdvantages.value = false
    }
  }

  // Função para abreviar marketplace em mobile
  const getMarketplaceAbbr = (marketplace: string) => {
    const abbreviations: Record<string, string> = {
      'Mercado Livre': 'ML',
      AliExpress: 'Ali',
      Americanas: 'Ame',
      Amazon: 'AMZ',
      Shopee: 'SHP',
    }
    return (
      abbreviations[marketplace] || marketplace.substring(0, 3).toUpperCase()
    )
  }

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

  // Exposer o array de produtos selecionados para o componente pai
  defineExpose({
    selectedProducts: readonly(selectedProducts),
  })
</script>

<style scoped>
  /* ========================================
   BARRA DE AÇÃO FIXA
   ======================================== */

  .action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgb(var(--v-theme-primary));
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    animation: slideUp 0.3s ease-out;
  }

  .action-bar-content {
    padding: 12px 16px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .selection-info {
    display: flex;
    align-items: center;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Ajuste do padding bottom para compensar a barra de ação */
  .products-container {
    padding-top: 20px;
    padding-bottom: 100px; /* Espaço para a barra de ação */
  }

  /* Mobile adjustments */
  @media (max-width: 599px) {
    .action-bar-content {
      padding: 10px 12px;
    }

    .products-container {
      padding-bottom: 80px; /* Menos espaço em mobile */
    }
  }

  /* ========================================
   CONTAINER E LAYOUT RESPONSIVO
   ======================================== */

  .results-header-container {
    background: rgba(var(--v-theme-surface), 1);
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
    margin-bottom: 0;
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .products-container {
    padding-top: 20px;
    padding-bottom: 100px; /* Espaço para a barra de ação */
  }

  /* Layout específico para mobile */
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
    padding: 4px; /* Gap padrão entre produtos */
  }

  /* Mobile: 2 colunas com gap adequado */
  @media (max-width: 599px) {
    .products-container {
      padding-bottom: 90px; /* Menos espaço em mobile */
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
      padding: 3px !important; /* Gap menor em mobile */
    }
  }

  /* Tablet: 3 colunas */
  @media (min-width: 600px) and (max-width: 959px) {
    .product-col {
      padding: 6px;
    }
  }

  /* Desktop: 4+ colunas */
  @media (min-width: 960px) {
    .product-col {
      padding: 8px;
    }
  }

  /* ========================================
   MOBILE LAYOUT
   ======================================== */

  .mobile-header {
    padding: 0 4px;
  }

  .select-all-mobile {
    flex: 0 0 auto;
    max-width: 180px;
  }

  .mobile-selection-indicator {
    position: absolute;
    top: 6px;
    left: 6px;
    z-index: 3;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    padding: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
    backdrop-filter: blur(4px);
  }

  .mobile-selection-indicator.selected {
    background: rgba(var(--v-theme-primary), 0.95);
    border: 1px solid rgb(var(--v-theme-primary));
    transform: scale(1.1);
  }

  .selection-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(var(--v-theme-primary), 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    border-radius: inherit;
    backdrop-filter: blur(2px);
  }

  /* ========================================
   DESKTOP LAYOUT
   ======================================== */

  .desktop-header {
    padding: 0 8px;
  }

  .select-all-desktop {
    flex: 0 0 auto;
  }

  .selection-counter {
    animation: slideIn 0.3s ease-out;
  }

  .product-checkbox-desktop {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 3;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    padding: 4px;
    backdrop-filter: blur(8px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
  }

  .product-checkbox-desktop:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.05);
  }

  /* ========================================
   PRODUCT CARDS
   ======================================== */

  .product-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  }

  /* Mobile card styling */
  .mobile-card {
    cursor: pointer;
    border-radius: 8px;
    min-height: 240px;
  }

  .mobile-card:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }

  /* Desktop card styling */
  .desktop-card {
    cursor: default;
    min-height: 320px;
  }

  .desktop-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
  }

  .selected-card {
    border: 2px solid rgb(var(--v-theme-primary));
    background: rgba(var(--v-theme-primary), 0.02);
  }

  .selected-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      rgb(var(--v-theme-primary)),
      rgb(var(--v-theme-secondary))
    );
    z-index: 1;
  }

  /* ========================================
   IMAGEM E BADGES
   ======================================== */

  .image-container {
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  .product-image {
    transition: transform 0.3s ease;
  }

  .desktop-card:hover .product-image {
    transform: scale(1.02);
  }

  .marketplace-badge {
    position: absolute;
    z-index: 2;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
  }

  /* Mobile badge positioning */
  @media (max-width: 599px) {
    .marketplace-badge {
      top: 4px;
      right: 4px;
      font-size: 0.6rem !important;
    }
  }

  /* Desktop badge positioning */
  @media (min-width: 600px) {
    .marketplace-badge {
      top: 8px;
      right: 8px;
    }
  }

  .marketplace-text {
    font-size: 0.7rem;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  /* Mobile marketplace text */
  @media (max-width: 599px) {
    .marketplace-text {
      font-size: 0.6rem !important;
      letter-spacing: 0.3px;
    }
  }

  /* ========================================
   CONTEÚDO DO CARD
   ======================================== */

  .product-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    background: rgba(var(--v-theme-surface), 1);
  }

  /* Mobile content */
  @media (max-width: 599px) {
    .product-content {
      padding: 10px 8px 12px 8px !important;
      gap: 4px;
    }
  }

  /* Tablet content */
  @media (min-width: 600px) and (max-width: 959px) {
    .product-content {
      padding: 12px 10px 14px 10px !important;
      gap: 6px;
    }
  }

  /* Desktop content */
  @media (min-width: 960px) {
    .product-content {
      padding: 16px 14px 18px 14px !important;
      gap: 8px;
    }
  }

  .price-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .price-text {
    line-height: 1.2;
    text-shadow: 0 1px 2px rgba(var(--v-theme-primary), 0.1);
  }

  .product-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
    color: rgba(var(--v-theme-on-surface), 0.87);
    transition: color 0.2s ease;
    min-height: 2.6em; /* Garante altura consistente */
  }

  .product-card:hover .product-title {
    color: rgba(var(--v-theme-on-surface), 1);
  }

  /* Ajustes específicos para mobile */
  @media (max-width: 599px) {
    .product-title {
      line-height: 1.2;
      font-size: 0.75rem !important;
      min-height: 2.4em;
    }

    .price-text {
      font-size: 0.875rem !important;
    }
  }

  /* ========================================
   ANIMAÇÕES
   ======================================== */

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* ========================================
   ACESSIBILIDADE E PERFORMANCE
   ======================================== */

  @media (prefers-reduced-motion: reduce) {
    .product-card,
    .product-image,
    .mobile-selection-indicator,
    .product-checkbox-desktop {
      transition: none !important;
    }

    .desktop-card:hover {
      transform: none !important;
    }

    .desktop-card:hover .product-image {
      transform: none !important;
    }
  }

  .product-card:focus-visible {
    outline: 2px solid rgb(var(--v-theme-primary));
    outline-offset: 2px;
  }

  /* Touch targets mínimos para mobile */
  @media (max-width: 599px) {
    .mobile-selection-indicator {
      min-width: 24px;
      min-height: 24px;
    }

    .product-card {
      min-height: 240px;
    }
  }

  /* ========================================
   TEMA ESCURO
   ======================================== */

  @media (prefers-color-scheme: dark) {
    .product-checkbox-desktop {
      background: rgba(18, 18, 18, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .mobile-selection-indicator {
      background: rgba(18, 18, 18, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .marketplace-badge {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    }
  }
</style>
