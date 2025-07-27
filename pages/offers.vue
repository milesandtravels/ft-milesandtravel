<template>
  <v-container fluid class="offers-page">
    <!-- Header da página -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">Ofertas Encontradas</h1>
            <p class="text-body-1 text-medium-emphasis mb-2">
              {{ offers.length }} de {{ totalOffers }} ofertas disponíveis com
              cashback, pontos e milhas
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
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="text-body-1 mt-4">Carregando ofertas...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="offers.length === 0" class="text-center py-8">
      <v-icon icon="mdi-package-variant" size="64" color="grey-lighten-1" />
      <h2 class="text-h6 mt-4 mb-2">Nenhuma oferta encontrada</h2>
      <p class="text-body-2 text-medium-emphasis">
        Tente ajustar os filtros ou fazer uma nova busca
      </p>
    </div>

    <!-- Cards de ofertas -->
    <OffersList
      v-else
      :offers="offers"
      :loading="loading"
      :loading-more="loadingMore"
      :has-more-data="hasMoreData"
      @load-more="loadMoreOffers"
    />
  </v-container>
</template>

<script setup lang="ts">
  import OffersFilters from '~/components/OffersFilters.vue'
  import OffersList from '~/components/OffersList.vue'
  import type {
    OfferFilters,
    OfferItem,
    OffersApiResponse,
  } from '~/interfaces/offers'

  definePageMeta({
    middleware: ['sanctum:auth'],
  })

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

      const { data } = await useSanctumFetch<OffersApiResponse>(
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

      const newOffers = data.value?.data as OfferItem[]

      if (resetPagination) {
        offers.value = newOffers
      } else {
        offers.value = [...offers.value, ...newOffers]
      }

      totalOffers.value = data.value?.meta?.total || 0
      hasMoreData.value = newOffers.length === perPage
    } finally {
      loading.value = false
    }
  }

  const loadMoreOffers = async (): Promise<void> => {
    if (loadingMore.value || !hasMoreData.value) return

    try {
      loadingMore.value = true
      currentPage.value += 1

      const payload = {
        ...activeFilters.value,
        page: currentPage.value,
        per_page: perPage,
      }

      const { data } = await useSanctumFetch<OffersApiResponse>(
        `/api/searches/${route.query.searchId as string}/offers`,
        {
          method: 'POST',
          body: payload,
        }
      )

      const newOffers = data.value?.data as OfferItem[]

      offers.value = [...offers.value, ...newOffers]

      hasMoreData.value = newOffers.length === perPage
    } catch (error) {
      console.error('Erro ao carregar mais ofertas:', error)
    } finally {
      loadingMore.value = false
    }
  }

  const handleFiltersApplied = async (filteredOffers: OfferFilters) => {
    activeFilters.value = filteredOffers
    fetchOffers(filteredOffers, true)
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
    fetchOffers(undefined, true)
  }

  const goBackToSearch = (): void => {
    router.push(`/search-products?searchId=${route.query.searchId as string}`)
  }

  onMounted(async () => {
    await fetchOffers()
  })

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
