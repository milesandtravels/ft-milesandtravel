<template>
  <v-container fluid class="offers-page">
    <!-- Header da página -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">Ofertas Encontradas</h1>
            <p class="text-body-1 text-medium-emphasis mb-2">
              {{ filteredOffers.length }} de {{ totalOffers }} ofertas
              disponíveis com cashback, pontos e milhas
            </p>

            <!-- Botão Voltar -->
            <v-btn
              color="primary"
              variant="text"
              prepend-icon="mdi-arrow-left"
              @click="goBackToSearch"
              class="pa-0"
            >
              Voltar para Compras Bonificadas
            </v-btn>
          </div>

          <!-- Filtros rápidos (chips) -->
          <div class="d-flex align-center gap-2 flex-wrap">
            <v-btn
              v-if="selectedOffers.length > 0"
              color="success"
              variant="flat"
              @click="processSelectedOffers"
            >
              Processar {{ selectedOffers.length }} Selecionadas
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Componente de Filtros -->
    <OffersFilters
      v-model="showFilters"
      :search-id="route.query.searchId as string"
      :filters="activeFilters"
      @filters-applied="handleFiltersApplied"
      @clear="handleFilterClear"
    />

    <!-- Botão para abrir filtros -->
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-end">
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-filter-variant"
          @click="showFilters = true"
        >
          Filtros Avançados
          <v-badge
            v-if="activeFiltersCount > 0"
            :content="activeFiltersCount"
            color="error"
            class="ms-2"
          />
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="text-body-1 mt-4">Carregando ofertas...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredOffers.length === 0" class="text-center py-8">
      <v-icon icon="mdi-package-variant" size="64" color="grey-lighten-1" />
      <h2 class="text-h6 mt-4 mb-2">Nenhuma oferta encontrada</h2>
      <p class="text-body-2 text-medium-emphasis">
        Tente ajustar os filtros ou fazer uma nova busca
      </p>
    </div>

    <!-- Cards de ofertas -->
    <OffersList
      v-else
      :offers="filteredOffers"
      :loading="loading"
      :loading-more="loadingMore"
      :has-more-data="hasMoreData"
      @update:selection="handleOfferSelection"
      @load-more="loadMoreOffers"
    />

    <!-- Snackbar de feedback -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false"> Fechar </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
  import OffersFilters from '~/components/OffersFilters.vue'
import OffersList from '~/components/OffersList.vue'
import type {
  OfferFilters,
  OfferItem,
  PaginatedOffersApiResponse,
} from '~/interfaces/offers'

  definePageMeta({
    middleware: ['sanctum:auth'],
  })

  // Estados reativos
  const loading = ref<boolean>(false)
  const loadingMore = ref<boolean>(false)
  const route = useRoute()
  const router = useRouter()
  const offers = ref<OfferItem[]>([])
  const totalOffers = ref<number>(0)
  const showFilters = ref<boolean>(false)
  const currentPage = ref<number>(1)
  const hasMoreData = ref<boolean>(true)
  const perPage = 10
  const activeFilters = ref<OfferFilters>({
    ecommerces: [],
    products: [],
    miles_programs: [],
    points_programs: [],
    cashback_programs: [],
    program_types: [],
  })

  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
  })

  // Computed
  const selectedOffers = computed<OfferItem[]>(() =>
    offers.value.filter(offer => offer.selected)
  )

  const activeFiltersCount = computed(() => {
    let count = 0
    if (activeFilters.value.ecommerces.length > 0) count++
    if (activeFilters.value.products.length > 0) count++
    if (activeFilters.value.miles_programs.length > 0) count++
    if (activeFilters.value.points_programs.length > 0) count++
    if (activeFilters.value.cashback_programs.length > 0) count++
    if (activeFilters.value.program_types.length > 0) count++
    return count
  })

  const filteredOffers = computed<OfferItem[]>(() => {
    let filtered = offers.value

    // Aplicar filtros avançados
    if (activeFilters.value.ecommerces.length > 0) {
      filtered = filtered.filter(offer =>
        activeFilters.value.ecommerces.includes(offer.ecommerce.id)
      )
    }

    if (activeFilters.value.products.length > 0) {
      filtered = filtered.filter(offer =>
        activeFilters.value.products.includes(offer.product.id)
      )
    }

    if (activeFilters.value.miles_programs.length > 0) {
      filtered = filtered.filter(offer =>
        activeFilters.value.miles_programs.includes(offer.program.id)
      )
    }

    if (activeFilters.value.points_programs.length > 0) {
      filtered = filtered.filter(offer =>
        activeFilters.value.points_programs.includes(offer.program.id)
      )
    }

    if (activeFilters.value.cashback_programs.length > 0) {
      filtered = filtered.filter(offer =>
        activeFilters.value.cashback_programs.includes(offer.program.id)
      )
    }

    if (activeFilters.value.program_types.length > 0) {
      filtered = filtered.filter(offer =>
        activeFilters.value.program_types.includes(offer.program.type)
      )
    }

    return filtered
  })

  // Métodos

  const fetchOffers = async (
    filters?: OfferFilters,
    resetPagination: boolean = true
  ): Promise<void> => {
    try {
      loading.value = true

      if (resetPagination) {
        currentPage.value = 1
        hasMoreData.value = true
        offers.value = []
      }

      // Preparar payload para POST
      const payload = {
        ...(filters || {
          ecommerces: [],
          products: [],
          miles_programs: [],
          points_programs: [],
          cashback_programs: [],
          program_types: [],
        }),
      }

      // Fazer requisição POST com filtros no corpo
      const {data} = await useSanctumFetch<PaginatedOffersApiResponse>(
        `/api/searches/${route.query.searchId as string}/offers`,
        {
          method: 'POST',
          body: payload,
          query: {
            page: currentPage.value,
            per_page: perPage,
          },
        }
      )

      
      const apiResponse = data.value
      const newOffers = apiResponse?.data

      if (resetPagination) {
        offers.value = newOffers
      } else {
        offers.value = [...offers.value, ...newOffers]
      }

      // Atualizar total de ofertas da API
      totalOffers.value = apiResponse?.data?.meta?.total || 0

      // Verificar se há mais dados
      hasMoreData.value = newOffers.length === perPage

      if (resetPagination) {
        showSnackbar('Ofertas carregadas com sucesso!', 'success')
      }
    } catch (error) {
      console.error('Erro ao buscar ofertas:', error)
      showSnackbar('Erro ao carregar ofertas. Tente novamente.', 'error')
    } finally {
      loading.value = false
    }
  }

  const loadMoreOffers = async (): Promise<void> => {
    if (loadingMore.value || !hasMoreData.value) return

    try {
      loadingMore.value = true
      currentPage.value += 1

      // Preparar payload para POST
      const payload = {
        ...activeFilters.value,
        page: currentPage.value,
        per_page: perPage,
      }

      // Fazer requisição POST com filtros no corpo
      const response = await useSanctumFetch<PaginatedOffersApiResponse>(
        `/api/searches/${route.query.searchId as string}/offers`,
        {
          method: 'POST',
          body: payload,
        }
      )

      const apiResponse = response.data.value
      const newOffers =
        apiResponse?.data?.map((offer: OfferItem) => ({
          ...offer,
        })) || []

      offers.value = [...offers.value, ...newOffers]

      // Verificar se há mais dados
      hasMoreData.value = newOffers.length === perPage
    } catch (error) {
      console.error('Erro ao carregar mais ofertas:', error)
      showSnackbar('Erro ao carregar mais ofertas. Tente novamente.', 'error')
    } finally {
      loadingMore.value = false
    }
  }

  const handleFiltersApplied = (filteredOffers: OfferItem[]): void => {
    // Resetar paginação quando novos filtros são aplicados
    currentPage.value = 1
    hasMoreData.value = true

    offers.value = filteredOffers.map((offer: OfferItem) => ({
      ...offer,
      selected: false,
    }))
    showSnackbar('Filtros aplicados com sucesso!', 'success')
  }

  const handleFilterClear = (): void => {
    activeFilters.value = {
      ecommerces: [],
      products: [],
      miles_programs: [],
      points_programs: [],
      cashback_programs: [],
      program_types: [],
    }
    // Recarregar ofertas sem filtros e resetar paginação
    fetchOffers(undefined, true)
    showSnackbar('Filtros limpos!', 'info')
  }

  const handleOfferSelection = (updatedOffer: OfferItem): void => {
    const index = offers.value.findIndex(
      offer =>
        offer.ecommerce.id === updatedOffer.ecommerce.id &&
        offer.product.id === updatedOffer.product.id &&
        offer.program.id === updatedOffer.program.id
    )

    if (index !== -1) {
      offers.value[index] = { ...updatedOffer }

      const action = updatedOffer.selected ? 'selecionada' : 'removida'
      showSnackbar(`Oferta ${action}!`, 'info')
    }
  }

  const processSelectedOffers = (): void => {
    if (selectedOffers.value.length === 0) {
      showSnackbar('Selecione pelo menos uma oferta', 'warning')
      return
    }

    showSnackbar(
      `${selectedOffers.value.length} ofertas processadas com sucesso!`,
      'success'
    )

    offers.value.forEach(offer => {
      offer.selected = false
    })
  }

  const goBackToSearch = (): void => {
    router.push(`/search-products?searchId=${route.query.searchId as string}`)
  }

  const showSnackbar = (message: string, color: string = 'success'): void => {
    snackbar.value = {
      show: true,
      message,
      color,
    }
  }

  // Watchers
  // Removido watcher do selectedProgramType pois os chips foram removidos

  // Lifecycle
  onMounted(async () => {
    await fetchOffers()
  })

  // Meta tags para SEO
  useSeoMeta({
    title: 'Ofertas com Cashback, Pontos e Milhas',
    ogTitle: 'Ofertas com Cashback, Pontos e Milhas',
    description:
      'Encontre as melhores ofertas com cashback, pontos e milhas dos principais e-commerces',
    ogDescription:
      'Encontre as melhores ofertas com cashback, pontos e milhas dos principais e-commerces',
  })
</script>

<style scoped>
  .offers-page {
    min-height: 100vh;
    background-color: rgb(var(--v-theme-surface));
  }

  @media (max-width: 960px) {
    .offers-page {
      padding: 8px;
    }
  }

  @media (max-width: 600px) {
    .d-flex.justify-space-between {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .gap-2 {
      gap: 8px;
    }
  }
</style>
