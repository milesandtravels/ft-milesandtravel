<template>
  <v-container fluid class="offers-page">
    <!-- Header da página -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">Ofertas Encontradas</h1>
            <p class="text-body-1 text-medium-emphasis mb-2">
              {{ filteredOffers.length }} de {{ offers.length }} ofertas
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
              Voltar para buscar produto
            </v-btn>
          </div>

          <!-- Filtros rápidos (chips) -->
          <div class="d-flex align-center gap-2 flex-wrap">
            <v-chip-group
              v-model="selectedProgramType"
              color="primary"
              filter
              multiple
            >
              <v-chip value="cashback" filter>
                <v-icon icon="mdi-cash" size="16" class="me-1" />
                Cashback
              </v-chip>
              <v-chip value="points" filter>
                <v-icon icon="mdi-star" size="16" class="me-1" />
                Pontos
              </v-chip>
              <v-chip value="miles" filter>
                <v-icon icon="mdi-airplane" size="16" class="me-1" />
                Milhas
              </v-chip>
            </v-chip-group>

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
      ref="filtersComponent"
      :available-offers="offers"
      :loading="loading"
      @filter:apply="handleFilterApply"
      @filter:clear="handleFilterClear"
    />

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
      @update:selection="handleOfferSelection"
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
  FilterOptions,
  OfferItem,
  ProgramType,
} from '~/interfaces/offers'

  definePageMeta({
    middleware: ['sanctum:auth'],
  })

  // Estados reativos
  const loading = ref<boolean>(false)
  const route = useRoute()
  const router = useRouter()
  const offers = ref<OfferItem[]>([])
  const selectedProgramType = ref<ProgramType[]>([])
  const activeFilters = ref<FilterOptions>({
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

  // Referência para o componente de filtros
  const filtersComponent = ref()

  // Computed
  const selectedOffers = computed<OfferItem[]>(() =>
    offers.value.filter(offer => offer.selected)
  )

  const filteredOffers = computed<OfferItem[]>(() => {
    let filtered = offers.value

    // Aplicar filtros rápidos (chips)
    if (selectedProgramType.value.length > 0) {
      filtered = filtered.filter(offer =>
        selectedProgramType.value.includes(offer.program.type)
      )
    }

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
  const buildQueryString = (filters: FilterOptions): string => {
    const queryParts: string[] = []

    // Adicionar filtros de array
    const arrayFilters = [
      { filter: filters.ecommerces, param: 'ecommerces[]' },
      { filter: filters.products, param: 'products[]' },
      { filter: filters.miles_programs, param: 'miles_programs[]' },
      { filter: filters.points_programs, param: 'points_programs[]' },
      { filter: filters.cashback_programs, param: 'cashback_programs[]' },
      { filter: filters.program_types, param: 'program_types[]' },
    ]

    arrayFilters.forEach(({ filter, param }) => {
      filter.forEach(value => {
        queryParts.push(`${param}=${encodeURIComponent(value)}`)
      })
    })

    return queryParts.join('&')
  }

  const fetchOffers = async (filters?: FilterOptions): Promise<void> => {
    try {
      loading.value = true

      const hasFilters =
        filters &&
        Object.values(filters).some(val => Array.isArray(val) && val.length > 0)

      let response

      if (hasFilters) {
        // Se há filtros, usar query string como no exemplo das promoções
        const queryString = buildQueryString(filters)
        response = await useSanctumFetch<any>(
          `/api/searches/${route.query.searchId}/offers?${queryString}`
        )
      } else {
        // Se não há filtros, fazer requisição simples
        response = await useSanctumFetch<any>(
          `/api/searches/${route.query.searchId}/offers`
        )
      }

      offers.value = response.data.value.data.map((offer: any) => ({
        ...offer,
        selected: false,
      }))

      showSnackbar('Ofertas carregadas com sucesso!', 'success')
    } catch (error) {
      console.error('Erro ao buscar ofertas:', error)
      showSnackbar('Erro ao carregar ofertas. Tente novamente.', 'error')
    } finally {
      loading.value = false
    }
  }

  const handleFilterApply = async (filters: FilterOptions): Promise<void> => {
    activeFilters.value = { ...filters }
    await fetchOffers(filters)
  }

  const handleFilterClear = async (): Promise<void> => {
    activeFilters.value = {
      ecommerces: [],
      products: [],
      miles_programs: [],
      points_programs: [],
      cashback_programs: [],
      program_types: [],
    }
    selectedProgramType.value = []
    await fetchOffers()
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
    router.push(`/search-products?searchId=${route.query.searchId}`)
  }

  const showSnackbar = (message: string, color: string = 'success'): void => {
    snackbar.value = {
      show: true,
      message,
      color,
    }
  }

  // Watchers
  watch(
    selectedProgramType,
    async () => {
      // Os filtros rápidos são aplicados automaticamente via computed
      // Mas se quiser fazer nova requisição para a API quando mudar:
      // await fetchOffers({ ...activeFilters.value, program_types: selectedProgramType.value })
    },
    { deep: true }
  )

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