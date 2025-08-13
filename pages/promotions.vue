<template>
  <v-container class="pa-6">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h1 class="text-h4 mb-2">Promoções</h1>
        <p class="text-subtitle-1 text-medium-emphasis ma-0 d-none d-sm-block">
          Descubra as melhores oportunidades de cashback, pontos e milhas
          disponíveis agora
        </p>
        <p class="text-body-2 text-medium-emphasis ma-0 d-sm-none">
          Melhores ofertas de cashback, pontos e milhas
        </p>
      </div>
      <v-btn
        @click="filterDialog = true"
        variant="outlined"
        color="primary"
        class="text-none"
        :size="$vuetify.display.xs ? 'small' : 'default'"
      >
        <v-icon class="d-none d-sm-inline mr-2">mdi-filter-variant</v-icon>
        <span class="d-none d-sm-inline">Filtros</span>
        <v-icon class="d-sm-none">mdi-filter-variant</v-icon>
      </v-btn>
    </div>

    <!-- Descrição detalhada -->
    <div class="mb-6">
      <v-card
        variant="tonal"
        color="primary"
        :class="$vuetify.display.xs ? 'pa-3' : 'pa-4'"
      >
        <div class="d-flex align-start">
          <v-icon
            icon="mdi-information-outline"
            color="primary"
            :size="$vuetify.display.xs ? '18' : '20'"
            class="mr-2 mr-sm-3 mt-1"
          />
          <div>
            <!-- Versão desktop -->
            <div class="d-none d-sm-block">
              <p class="text-body-2 mb-2">
                <strong>Como funciona:</strong> Fazemos o cruzamento inteligente
                entre programas de fidelidade e lojas parceiras para mostrar as
                promoções mais vantajosas do momento.
              </p>
              <p class="text-body-2 mb-0">
                Use os filtros para encontrar exatamente o que procura: filtre
                por categoria de produto, tipo de recompensa (cashback, pontos
                ou milhas) e descubra rapidamente as melhores oportunidades
                vigentes.
              </p>
            </div>
            <!-- Versão mobile -->
            <div class="d-sm-none">
              <p class="text-caption mb-1">
                <strong>Cruzamento inteligente</strong> entre programas e lojas
                parceiras.
              </p>
              <p class="text-caption mb-0">
                Use os filtros para encontrar ofertas por categoria ou tipo de
                recompensa.
              </p>
            </div>
          </div>
        </div>
      </v-card>
    </div>

    <!-- Filtros Rápidos -->
    <div class="mb-6">
      <div
        class="d-flex flex-wrap gap-3"
        :style="{
          gap: '8px',
        }"
      >
        <v-chip
          @click="setQuickFilter('all')"
          :color="quickFilter === 'all' ? 'primary' : 'default'"
          :variant="quickFilter === 'all' ? 'flat' : 'outlined'"
          :size="$vuetify.display.xs ? 'small' : 'default'"
          class="text-none"
        >
          <v-icon start size="16">mdi-view-grid</v-icon>
          Todos
        </v-chip>

        <v-chip
          @click="setQuickFilter('cashback')"
          :color="quickFilter === 'cashback' ? 'success' : 'default'"
          :variant="quickFilter === 'cashback' ? 'flat' : 'outlined'"
          :size="$vuetify.display.xs ? 'small' : 'default'"
          class="text-none"
        >
          <v-icon start size="16">mdi-cash</v-icon>
          Cashback
        </v-chip>

        <v-chip
          @click="setQuickFilter('points')"
          :color="quickFilter === 'points' ? 'warning' : 'default'"
          :variant="quickFilter === 'points' ? 'flat' : 'outlined'"
          :size="$vuetify.display.xs ? 'small' : 'default'"
          class="text-none"
        >
          <v-icon start size="16">mdi-circle-multiple</v-icon>
          Pontos
        </v-chip>

        <v-chip
          @click="setQuickFilter('miles')"
          :color="quickFilter === 'miles' ? 'info' : 'default'"
          :variant="quickFilter === 'miles' ? 'flat' : 'outlined'"
          :size="$vuetify.display.xs ? 'small' : 'default'"
          class="text-none"
        >
          <v-icon start size="16">mdi-airplane</v-icon>
          Milhas
        </v-chip>
      </div>
    </div>

    <!-- Active Filters Tabs -->
    <template v-if="hasActiveFilters">
      <v-tabs show-arrows class="mb-4" color="primary" align-tabs="start">
        <!-- Categories -->
        <v-tab
          v-for="category in filters.categories"
          :key="`category-${category}`"
          class="text-none"
        >
          <v-chip
            closable
            @click:close="removeFilter('categories', category)"
            color="primary"
            variant="flat"
          >
            {{ category }}
          </v-chip>
        </v-tab>

        <!-- Programs with logos -->
        <v-tab
          v-for="program in allSelectedPrograms"
          :key="`program-${program.type}-${program.id}`"
          class="text-none"
        >
          <v-chip
            closable
            @click:close="removeFilter(program.filterKey, program)"
            color="primary"
            variant="flat"
          >
            <v-avatar start>
              <v-img :src="program.logo_url" :alt="program.name">
                <template v-slot:error>
                  <v-icon :icon="program.icon" size="16"></v-icon>
                </template>
              </v-img>
            </v-avatar>
            {{ program.name }}
          </v-chip>
        </v-tab>
      </v-tabs>

      <v-chip
        color="error"
        variant="outlined"
        prepend-icon="mdi-close-circle"
        @click="clearAllFilters"
        class="mb-4"
      >
        Limpar todos
      </v-chip>
    </template>

    <!-- Content States -->
    <div v-if="pending" class="text-center py-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="mt-4 text-h6">Carregando promoções...</p>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <v-alert type="error" variant="tonal" class="mb-4">
        <v-alert-title>Erro ao carregar dados</v-alert-title>
        Não foi possível carregar as promoções. Tente novamente mais tarde.
      </v-alert>
    </div>

    <!-- Promotions Grid -->
    <v-row v-else-if="promotions?.length">
      <v-col
        v-for="(promotion, index) in promotions"
        :key="index"
        cols="12"
        sm="6"
        md="6"
        lg="4"
        xl="4"
      >
        <div data-onboarding="promotions-highlight">
          <PromotionsCard
            :promotion="promotion"
            @view-details="handleViewDetails"
          />
        </div>
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
          Não há promoções disponíveis no momento.
        </p>
      </v-card>
    </div>

    <!-- Pagination -->
    <PromotionsPagination
      v-if="meta.last_page > 1"
      :meta="meta"
      :pending="pending"
      @go-to-page="goToPage"
      class="mt-6"
    />

    <!-- Filter Dialog -->
    <PromotionsFilters
      v-model="filterDialog"
      :filters="filters"
      :filter-options="filterOptions"
      @apply="applyFilters"
      @clear="clearFilters"
      @update:filters="updateFilters"
    />
  </v-container>
</template>

<script setup lang="ts">
  import type { Promotion, PromotionMeta } from '~/interfaces/promotions'
  definePageMeta({
    middleware: ['sanctum:auth'],
  })

  useSeoMeta({
    title: 'Tenha acesso aos melhores programas e marketplaces - Miles&Travels',
    ogTitle:
      'Tenha acesso aos melhores programas e marketplaces - Miles&Travels',
    description:
      'Descubra os principais programas de pontos, milhas e cashback e compare vantagens entre os maiores marketplaces do Brasil.',
    ogDescription:
      'Descubra os principais programas de pontos, milhas e cashback e compare vantagens entre os maiores marketplaces do Brasil.',
  })

  // Constants
  const FILTER_CONFIGS = {
    promotionTypes: {
      options: [
        { label: 'Milhas', value: 'miles' },
        { label: 'Pontos', value: 'points' },
        { label: 'Cashback', value: 'cashback' },
      ],
    },
    orderBy: {
      options: [
        { label: 'Valor', value: 'current_value' },
        { label: 'Nome do programa', value: 'program_name' },
        { label: 'Nome do ecommerce', value: 'ecommerce_name' },
      ],
    },
    order: {
      options: [
        { label: 'Do menor para o maior', value: 'asc' },
        { label: 'Do maior para o menor', value: 'desc' },
      ],
    },
  }

  const PROGRAM_ICONS = {
    ecommerces: 'mdi-store',
    pointsPrograms: 'mdi-card-giftcard',
    milesPrograms: 'mdi-airplane',
    cashbackPrograms: 'mdi-cash',
  }

  // Composables
  const route = useRoute()
  const currentPage = ref(Number(route.query.page) || 1)
  const itemsPerPage = ref(Number(route.query.per_page) || 15)
  const filterDialog = ref(false)
  const quickFilter = ref('all')

  // State
  const filters = ref({
    orderBy: '',
    order: '',
    promotionTypes: [] as string[],
    ecommerces: [] as any[],
    pointsPrograms: [] as any[],
    milesPrograms: [] as any[],
    cashbackPrograms: [] as any[],
    categories: [] as string[],
  })

  // Filter options - fetch in parallel
  const [
    { data: ecommercesData },
    { data: programsData },
    { data: categoriesData },
  ] = await Promise.all([
    useSanctumFetch<any[]>('/api/ecommerces'),
    useSanctumFetch<any[]>('/api/programs'),
    useSanctumFetch<string[]>('/api/categories'),
  ])

  const filterOptions = computed(() => ({
    ecommerces: (ecommercesData.value as any)?.data || [],
    pointsPrograms: (programsData.value as any)?.points || [],
    milesPrograms: (programsData.value as any)?.miles || [],
    cashbackPrograms: (programsData.value as any)?.cashback || [],
    categories: categoriesData.value || [],
    ...FILTER_CONFIGS,
  }))

  // Computed
  const hasActiveFilters = computed(() =>
    Object.entries(filters.value).some(
      ([key, value]) =>
        key !== 'orderBy' &&
        key !== 'order' &&
        key !== 'promotionTypes' &&
        (Array.isArray(value) ? value.length > 0 : value)
    )
  )

  const allSelectedPrograms = computed(() => {
    const programs = []

    // Add ecommerces
    programs.push(
      ...filters.value.ecommerces.map(item => ({
        ...item,
        type: 'ecommerce',
        filterKey: 'ecommerces',
        icon: PROGRAM_ICONS.ecommerces,
      }))
    )

    // Add all program types
    const programKeys = [
      'pointsPrograms',
      'milesPrograms',
      'cashbackPrograms',
    ] as const
    programKeys.forEach(key => {
      programs.push(
        ...(filters.value[key] as any[]).map((item: any) => ({
          ...item,
          type: key.replace('Programs', ''),
          filterKey: key,
          icon: (PROGRAM_ICONS as any)[key],
        }))
      )
    })

    return programs
  })

  // URL management functions
  const extractArrayParams = (paramPrefix: string) => {
    const values: string[] = []
    Object.keys(route.query).forEach(key => {
      if (key.startsWith(paramPrefix + '[') && key.endsWith(']')) {
        const value = route.query[key]
        if (value) {
          const stringValue = Array.isArray(value) ? value[0] : value
          if (stringValue) {
            values.push(stringValue)
          }
        }
      }
    })
    return values
  }

  const initializeFiltersFromURL = () => {
    filters.value.orderBy = (route.query.order_by as string) || ''
    filters.value.order = (route.query.order as string) || ''

    // Initialize promotion types
    const promotionTypes = extractArrayParams('program_types')
    if (promotionTypes.length > 0) {
      filters.value.promotionTypes = promotionTypes
    }

    // Initialize categories
    const categories = extractArrayParams('categories')
    if (categories.length > 0) {
      filters.value.categories = categories
    }

    // Initialize programs
    const programMappings = [
      {
        filterKey: 'ecommerces',
        paramKey: 'ecommerces',
        optionsKey: 'ecommerces',
      },
      {
        filterKey: 'pointsPrograms',
        paramKey: 'points_programs',
        optionsKey: 'pointsPrograms',
      },
      {
        filterKey: 'milesPrograms',
        paramKey: 'miles_programs',
        optionsKey: 'milesPrograms',
      },
      {
        filterKey: 'cashbackPrograms',
        paramKey: 'cashback_programs',
        optionsKey: 'cashbackPrograms',
      },
    ]

    programMappings.forEach(({ filterKey, paramKey, optionsKey }) => {
      const ids = extractArrayParams(paramKey)
      if (
        ids.length > 0 &&
        (filterOptions.value as any)[optionsKey]?.length > 0
      ) {
        ;(filters.value as any)[filterKey] = (filterOptions.value as any)[
          optionsKey
        ].filter((item: any) => ids.includes(item.id.toString()))
      }
    })
  }

  const buildQueryString = (queryParams: any) => {
    const queryParts: string[] = []

    // Add basic params
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParts.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        )
      }
    })

    // Add array filters
    const arrayFilters = [
      { filter: filters.value.promotionTypes, param: 'program_types[]' },
      { filter: filters.value.categories, param: 'categories[]' },
      { filter: filters.value.ecommerces, param: 'ecommerces[]' },
      { filter: filters.value.pointsPrograms, param: 'points_programs[]' },
      { filter: filters.value.milesPrograms, param: 'miles_programs[]' },
      { filter: filters.value.cashbackPrograms, param: 'cashback_programs[]' },
    ]

    arrayFilters.forEach(({ filter, param }) => {
      filter.forEach((item: any) => {
        const value = typeof item === 'object' ? item.id : item
        queryParts.push(`${param}=${encodeURIComponent(value)}`)
      })
    })

    return queryParts.join('&')
  }

  // Data fetching
  const fetchPromotions = async (queryParams: any) => {
    const hasArrayFilters = Object.values(filters.value).some(
      val => Array.isArray(val) && val.length > 0
    )

    if (hasArrayFilters) {
      const queryString = buildQueryString(queryParams)
      return await useSanctumFetch<Response>(`/api/promotions?${queryString}`)
    } else {
      return await useSanctumFetch<Response>('/api/promotions', {
        query: queryParams,
      })
    }
  }

  // Initialize
  initializeFiltersFromURL()

  // Inicializar filtro rápido baseado nos filtros ativos
  if (filters.value.promotionTypes.length === 1) {
    quickFilter.value = filters.value.promotionTypes[0]
  } else if (filters.value.promotionTypes.length === 0) {
    quickFilter.value = 'all'
  }

  const initialQueryParams = {
    page: currentPage.value,
    per_page: itemsPerPage.value,
    ...(filters.value.orderBy && { order_by: filters.value.orderBy }),
    ...(filters.value.order && { order: filters.value.order }),
  }

  const {
    data: initialResponse,
    pending: initialPending,
    error: initialError,
  } = await fetchPromotions(initialQueryParams)

  const promotions = ref<Promotion[]>(
    (initialResponse.value as any)?.data || []
  )
  const meta = ref<PromotionMeta>((initialResponse.value as any)?.meta)
  const pending = ref(initialPending.value)
  const error = ref(initialError.value)

  // Methods
  const getPromotionTypeLabel = (type: string): string => {
    const option = FILTER_CONFIGS.promotionTypes.options.find(
      opt => opt.value === type
    )
    return option?.label || type
  }

  const removeFilter = async (filterKey: string, value: any) => {
    if (Array.isArray((filters.value as any)[filterKey])) {
      ;(filters.value as any)[filterKey] = (filters.value as any)[
        filterKey
      ].filter((item: any) => {
        return typeof item === 'object' ? item.id !== value.id : item !== value
      })
    }
    await applyFilters()
  }

  const updateFilters = (newFilters: any) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearAllFilters = async () => {
    clearFilters()
    quickFilter.value = 'all'
    currentPage.value = 1
    await applyFilters()
  }

  const clearFilters = () => {
    filters.value = {
      orderBy: '',
      order: '',
      categories: [],
      promotionTypes: [],
      ecommerces: [],
      pointsPrograms: [],
      milesPrograms: [],
      cashbackPrograms: [],
    }
  }

  const applyFilters = async () => {
    currentPage.value = 1
    pending.value = true
    filterDialog.value = false

    try {
      const queryParams = {
        page: currentPage.value,
        per_page: itemsPerPage.value,
        ...(filters.value.orderBy && { order_by: filters.value.orderBy }),
        ...(filters.value.order && { order: filters.value.order }),
      }

      const newResponse = await fetchPromotions(queryParams)
      promotions.value = (newResponse.data.value as any)?.data || []
      meta.value = (newResponse.data.value as any)?.meta
      error.value = null

      await updateURL()
    } catch (err) {
      console.error('Erro ao aplicar filtros:', err)
      error.value = err as any
    } finally {
      pending.value = false
    }
  }

  const goToPage = async (page: number) => {
    currentPage.value = page
    pending.value = true

    try {
      const queryParams = {
        page: currentPage.value,
        per_page: itemsPerPage.value,
        ...(filters.value.orderBy && { order_by: filters.value.orderBy }),
        ...(filters.value.order && { order: filters.value.order }),
      }

      const newResponse = await fetchPromotions(queryParams)
      promotions.value = (newResponse.data.value as any)?.data || []
      meta.value = (newResponse.data.value as any)?.meta
      error.value = null

      await updateURL()
    } catch (err) {
      console.error('Erro ao carregar página:', err)
      error.value = err as any
    } finally {
      pending.value = false
    }
  }

  const updateURL = async () => {
    const query: any = {
      page: currentPage.value,
      per_page: itemsPerPage.value,
    }

    if (filters.value.orderBy) query.order_by = filters.value.orderBy
    if (filters.value.order) query.order = filters.value.order

    // Add array filters to URL
    if (filters.value.promotionTypes.length > 0) {
      filters.value.promotionTypes.forEach((type, index) => {
        query[`program_types[${index}]`] = type
      })
    }

    if (filters.value.categories.length > 0) {
      filters.value.categories.forEach((category, index) => {
        query[`categories[${index}]`] = category
      })
    }

    if (filters.value.ecommerces.length > 0) {
      filters.value.ecommerces.forEach((ecommerce, index) => {
        query[`ecommerces[${index}]`] = ecommerce.id
      })
    }

    if (filters.value.pointsPrograms.length > 0) {
      filters.value.pointsPrograms.forEach((program, index) => {
        query[`points_programs[${index}]`] = program.id
      })
    }

    if (filters.value.milesPrograms.length > 0) {
      filters.value.milesPrograms.forEach((program, index) => {
        query[`miles_programs[${index}]`] = program.id
      })
    }

    if (filters.value.cashbackPrograms.length > 0) {
      filters.value.cashbackPrograms.forEach((program, index) => {
        query[`cashback_programs[${index}]`] = program.id
      })
    }

    await navigateTo({ query })
  }

  const handleViewDetails = (promotion: Promotion) => {
    console.log('Visualizar detalhes da promoção:', promotion.id)
    // navigateTo(`/promocoes/${promotion.id}`)
  }

  const setQuickFilter = async (filterType: string) => {
    quickFilter.value = filterType
    currentPage.value = 1

    // Limpar filtros de tipo de promoção
    filters.value.promotionTypes = []

    // Aplicar filtro baseado na seleção
    if (filterType !== 'all') {
      filters.value.promotionTypes = [filterType]
    }

    await applyFilters()
  }

  // Watchers
  watch(
    () => route.query,
    newQuery => {
      const newPage = Number(newQuery.page) || 1
      if (newPage !== currentPage.value) {
        currentPage.value = newPage
      }
      initializeFiltersFromURL()
    },
    { deep: true }
  )
</script>
