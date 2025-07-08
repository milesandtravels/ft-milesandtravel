<template>
  <v-container class="pa-2 pa-md-4">
    <!-- Page Header -->
    <div class="mb-4">
      <div
        :class="{
          'd-flex justify-space-between align-center': !mobile,
        }"
      >
        <div class="">
          <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">
            Promoções em Destaque
          </h1>
          <p class="text-caption text-md-body-2 text-medium-emphasis mb-3">
            Descubra as melhores promoções e ofertas disponíveis
          </p>
        </div>
        <v-btn
          :block="mobile"
          :width="mobile ? '100%' : '280px'"
          color="primary"
          size="large"
          variant="flat"
          class="search-products-btn"
          @click="navigateTo('/search-products')"
        >
          <v-icon start size="20">mdi-magnify</v-icon>
          <span class="btn-text">
            <span class="btn-main-text">Compras Bonificadas</span>
            <span class="btn-sub-text">Encontre ofertas exclusivas</span>
          </span>
          <v-icon end size="16" class="ml-2">mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Promotion Sections -->
    <div
      v-for="(section, index) in promotionSections"
      :key="section.id"
      class="promotion-section mb-8 mb-md-10"
    >
      <!-- Section Header -->
      <div class="d-flex align-center justify-space-between mb-3 mb-md-4">
        <div class="d-flex align-center">
          <v-avatar class="mr-3" :color="section.color" size="40">
            <v-icon color="white" size="20">{{ section.icon }}</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-subtitle-1 text-md-h6 font-weight-bold">
              {{ section.name }}
            </h2>
            <p class="text-caption text-medium-emphasis">
              {{ section.description }}
            </p>
          </div>
        </div>
        <v-btn
          variant="outlined"
          color="primary"
          size="small"
          @click="goToPromotionsPage(section.filterType)"
        >
          Ver mais
        </v-btn>
      </div>

      <!-- Loading State -->
      <div v-if="section.loading" class="text-center py-8">
        <v-progress-circular
          indeterminate
          color="primary"
          size="32"
        ></v-progress-circular>
        <p class="mt-2 text-body-2">Carregando promoções...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="section.error" class="text-center py-8">
        <v-alert type="error" variant="tonal" class="mb-4">
          <v-alert-title>Erro ao carregar dados</v-alert-title>
          Não foi possível carregar as promoções desta seção.
        </v-alert>
      </div>

      <!-- Promotions Grid -->
      <v-row v-else-if="section.promotions && section.promotions.length > 0">
        <v-col
          v-for="promotion in section.promotions"
          :key="promotion.id"
          cols="12"
          sm="6"
          md="6"
          lg="4"
          xl="4"
        >
          <PromotionsCard
            :promotion="promotion"
            @view-details="handleViewDetails"
          />
        </v-col>
      </v-row>

      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <v-card class="pa-8" variant="outlined">
          <v-icon
            icon="mdi-package-variant"
            size="64"
            class="text-medium-emphasis mb-4"
          ></v-icon>
          <h3 class="text-h6 mb-2">Nenhuma promoção encontrada</h3>
          <p class="text-body-2 text-medium-emphasis">
            Não há promoções disponíveis nesta categoria no momento.
          </p>
        </v-card>
      </div>
    </div>

    <!-- Success/Error Notifications -->
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      location="top"
      timeout="3000"
    >
      {{ snackbarMessage }}
      <template #actions>
        <v-btn variant="text" @click="showSnackbar = false"> Fechar </v-btn>
      </template>
    </v-snackbar>

    <!-- Floating Action Button -->
    <v-fab
      class="fab-search"
      color="primary"
      icon="mdi-magnify"
      location="bottom end"
      size="large"
      elevation="8"
      @click="navigateTo('/search-products')"
    />
  </v-container>
</template>

<script setup lang="ts">
  import { computed, onMounted, reactive, ref } from 'vue'
import { useDisplay } from 'vuetify'

  // Types
  interface Program {
    id: number
    name: string
    logo_url: string
    value_per_mile?: number
  }

  interface Ecommerce {
    id: number
    name: string
    logo_url: string
  }

  type ProgramType = 'miles' | 'points' | 'cashback'

  interface Promotion {
    id: number
    current_value: number
    program_type: ProgramType
    program: Program
    ecommerce: Ecommerce
  }

  interface PromotionResponse {
    data: Promotion[]
    meta?: any
    links?: any
  }

  interface PromotionSection {
    id: string
    name: string
    description: string
    icon: string
    color: string
    filterType: string
    promotions: Promotion[]
    loading: boolean
    error: boolean
  }

  // Composables
  const { mobile } = useDisplay()

  // State
  const promotionSections = reactive<PromotionSection[]>([
    {
      id: 'all-promotions',
      name: 'Maiores promoções em Ecommerces',
      description: 'As 10 maiores promoções disponíveis atualmente',
      icon: 'mdi-store',
      color: 'primary',
      filterType: 'all',
      promotions: [],
      loading: true,
      error: false,
    },
    {
      id: 'points-promotions',
      name: 'Maiores promoções de Pontos',
      description: 'As 10 maiores promoções de pontos disponíveis',
      icon: 'mdi-star-circle',
      color: 'orange',
      filterType: 'points',
      promotions: [],
      loading: true,
      error: false,
    },
    {
      id: 'miles-promotions',
      name: 'Maiores promoções de Milhas',
      description: 'As 10 maiores promoções de milhas disponíveis',
      icon: 'mdi-airplane',
      color: 'blue',
      filterType: 'miles',
      promotions: [],
      loading: true,
      error: false,
    },
    {
      id: 'cashback-promotions',
      name: 'Maiores promoções de Cashback',
      description: 'As 10 maiores promoções de cashback disponíveis',
      icon: 'mdi-cash-multiple',
      color: 'green',
      filterType: 'cashback',
      promotions: [],
      loading: true,
      error: false,
    },
  ])

  // Notification state
  const showSnackbar = ref(false)
  const snackbarMessage = ref('')
  const snackbarColor = ref('success')

  // Computed
  const isMobile = computed(() => mobile.value)

  // Methods
  const goToPromotionsPage = (filterType: string) => {
    const query: any = {}

    if (filterType !== 'all') {
      query['program_types[]'] = filterType
    }

    navigateTo({
      path: '/promotions',
      query,
    })
  }

  const handleViewDetails = (promotion: Promotion) => {
    showNotification(
      `Visualizando promoção: ${promotion.ecommerce.name} + ${promotion.program.name}`,
      'info'
    )
  }

  const fetchPromotions = async (section: PromotionSection) => {
    try {
      section.loading = true
      section.error = false

      const query: any = {
        limit: isMobile.value ? 3 : 10,
        order_by: 'current_value',
        order: 'desc',
      }

      if (section.filterType !== 'all') {
        query['program_types[]'] = section.filterType
      }

      const { data } = await useSanctumFetch<PromotionResponse>(
        '/api/promotions',
        {
          query,
        }
      )

      section.promotions = data.value?.data || []
    } catch (error) {
      console.error(`Error fetching ${section.id}:`, error)
      section.error = true
      section.promotions = []
    } finally {
      section.loading = false
    }
  }

  const loadAllPromotions = async () => {
    await Promise.all(
      promotionSections.map(section => fetchPromotions(section))
    )
  }

  const showNotification = (
    message: string,
    color: 'success' | 'error' | 'info' = 'success'
  ) => {
    snackbarMessage.value = message
    snackbarColor.value = color
    showSnackbar.value = true
  }

  // Lifecycle
  onMounted(async () => {
    loadAllPromotions()
  })
</script>

<style scoped>
  /* Custom styles */
  .promotion-section {
    border-radius: 16px;
    background: rgba(var(--v-theme-surface), 0.7);
    padding: 16px;
    backdrop-filter: blur(10px);
  }

  /* Botão Compras Bonificadas - Padrão Vuetify */
  .search-products-btn {
    height: 56px !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: none !important;
    font-weight: 500 !important;
  }

  .search-products-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(25, 118, 210, 0.3) !important;
  }

  .btn-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.2;
    margin: 0 8px;
  }

  .btn-main-text {
    font-size: 1rem;
    font-weight: 500;
    color: white;
  }

  .btn-sub-text {
    font-size: 0.75rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.9);
    margin-top: 1px;
  }

  /* Mobile adjustments for the button */
  @media (max-width: 600px) {
    .search-products-btn {
      height: 52px !important;
    }

    .btn-main-text {
      font-size: 0.95rem;
    }

    .btn-sub-text {
      font-size: 0.7rem;
    }
  }

  /* Floating Action Button - SEM FUNDO BRANCO */
  .fab-search {
    position: fixed !important;
    bottom: 24px;
    right: 24px;
    z-index: 1000;
    box-shadow: 0 8px 24px rgba(25, 118, 210, 0.4) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    /* Remove qualquer fundo branco */
    background: rgb(var(--v-theme-primary)) !important;

    /* Remove overlay branco */
    &::before {
      display: none !important;
    }

    /* Garante que o ícone seja branco */
    .v-icon {
      background: transparent !important;
      color: white !important;
    }

    /* Remove fundo branco do conteúdo */
    .v-btn__content {
      background: transparent !important;
    }

    /* Remove overlay de hover branco */
    .v-btn__overlay {
      background: rgba(255, 255, 255, 0.1) !important;
    }

    /* Remove bordas brancas */
    border: none !important;
    outline: none !important;
  }

  /* Estados de hover e focus sem fundo branco */
  .fab-search:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(25, 118, 210, 0.5) !important;
    background-color: rgba(var(--v-theme-primary), 0.9) !important;
  }

  .fab-search:focus {
    background-color: rgba(var(--v-theme-primary), 0.9) !important;
  }

  /* Remove qualquer fundo branco residual */
  .fab-search .v-btn__content,
  .fab-search .v-btn__prepend,
  .fab-search .v-btn__append {
    background: transparent !important;
  }

  /* Garante que o ripple effect não seja branco */
  .fab-search .v-ripple__container {
    color: rgba(255, 255, 255, 0.3) !important;
  }

  /* Força a cor primária em todos os estados */
  .fab-search.v-btn {
    background-color: rgb(var(--v-theme-primary)) !important;
    color: white !important;
  }

  /* Remove fundos brancos em elementos internos */
  .fab-search * {
    background-color: transparent !important;
  }

  @media (max-width: 600px) {
    .fab-search {
      bottom: 16px;
      right: 16px;
    }
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

  .v-col:nth-child(n + 6) {
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

  /* Dark theme enhancements */
  .v-theme--dark .promotion-section {
    background: rgba(var(--v-theme-surface), 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* Dark theme FAB */
  .v-theme--dark .fab-search {
    background: rgb(var(--v-theme-primary)) !important;
  }

  .v-theme--dark .fab-search .v-icon {
    color: white !important;
  }
</style>
