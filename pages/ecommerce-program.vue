<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Promoções</h1>
          <v-btn
            @click="filterDialog = true"
            variant="outlined"
            color="primary"
            prepend-icon="mdi-filter-variant"
          >
            Filtros
          </v-btn>
        </div>

        <!-- Tabs com filtros ativos -->
        <v-tabs
          v-if="hasActiveFilters"
          show-arrows
          class="mb-4"
          color="primary"
          align-tabs="start"
        >
          <!-- Tipo de promoção -->
          <v-tab
            v-for="type in filters.promotionTypes"
            :key="'promotion-' + type"
            class="text-none"
            @click="removePromotionTypeFilter(type)"
          >
            <v-chip
              closable
              @click:close="removePromotionTypeFilter(type)"
              color="primary"
              variant="flat"
            >
              {{ getPromotionTypeLabel(type) }}
            </v-chip>
          </v-tab>

          <!-- Categorias -->
          <v-tab
            v-for="category in filters.categories"
            :key="'category-' + category"
            class="text-none"
            @click="removeCategoryFilter(category)"
          >
            <v-chip
              closable
              @click:close="removeCategoryFilter(category)"
              color="primary"
              variant="flat"
            >
              {{ category }}
            </v-chip>
          </v-tab>

          <!-- E-commerces -->
          <v-tab
            v-for="ecommerce in filters.ecommerces"
            :key="'ecommerce-' + ecommerce.id"
            class="text-none"
            @click="removeEcommerceFilter(ecommerce)"
          >
            <v-chip
              closable
              @click:close="removeEcommerceFilter(ecommerce)"
              color="primary"
              variant="flat"
            >
              <v-avatar start>
                <v-img :src="ecommerce.logo_url" :alt="ecommerce.name">
                  <template v-slot:error>
                    <v-icon icon="mdi-store" size="16"></v-icon>
                  </template>
                </v-img>
              </v-avatar>
              {{ ecommerce.name }}
            </v-chip>
          </v-tab>

          <!-- Programas de Pontos -->
          <v-tab
            v-for="program in filters.pointsPrograms"
            :key="'points-' + program.id"
            class="text-none"
            @click="removePointsProgramFilter(program)"
          >
            <v-chip
              closable
              @click:close="removePointsProgramFilter(program)"
              color="primary"
              variant="flat"
            >
              <v-avatar start>
                <v-img :src="program.logo_url" :alt="program.name">
                  <template v-slot:error>
                    <v-icon icon="mdi-card-giftcard" size="16"></v-icon>
                  </template>
                </v-img>
              </v-avatar>
              {{ program.name }}
            </v-chip>
          </v-tab>

          <!-- Programas de Milhas -->
          <v-tab
            v-for="program in filters.milesPrograms"
            :key="'miles-' + program.id"
            class="text-none"
            @click="removeMilesProgramFilter(program)"
          >
            <v-chip
              closable
              @click:close="removeMilesProgramFilter(program)"
              color="primary"
              variant="flat"
            >
              <v-avatar start>
                <v-img :src="program.logo_url" :alt="program.name">
                  <template v-slot:error>
                    <v-icon icon="mdi-airplane" size="16"></v-icon>
                  </template>
                </v-img>
              </v-avatar>
              {{ program.name }}
            </v-chip>
          </v-tab>

          <!-- Programas de Cashback -->
          <v-tab
            v-for="program in filters.cashbackPrograms"
            :key="'cashback-' + program.id"
            class="text-none"
            @click="removeCashbackProgramFilter(program)"
          >
            <v-chip
              closable
              @click:close="removeCashbackProgramFilter(program)"
              color="primary"
              variant="flat"
            >
              <v-avatar start>
                <v-img :src="program.logo_url" :alt="program.name">
                  <template v-slot:error>
                    <v-icon icon="mdi-cash" size="16"></v-icon>
                  </template>
                </v-img>
              </v-avatar>
              {{ program.name }}
            </v-chip>
          </v-tab>
        </v-tabs>
      </v-col>
      <v-chip
        v-if="hasActiveFilters"
        color="error"
        variant="outlined"
        prepend-icon="mdi-close-circle"
        @click="clearAllFilters"
      >
        Limpar todos
      </v-chip>
    </v-row>

    <v-row v-if="pending" justify="center">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Carregando promoções...</p>
      </v-col>
    </v-row>

    <v-row v-else-if="error" justify="center">
      <v-col cols="12" class="text-center">
        <v-alert type="error" variant="tonal" class="mb-4">
          <v-alert-title>Erro ao carregar dados</v-alert-title>
          Não foi possível carregar as promoções. Tente novamente mais tarde.
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else-if="promotions && promotions.length > 0" >
      <v-col
        v-for="promotion in promotions"
        :key="promotion.id"
        cols="12"
        sm="6"
        md="6"
        lg="4"
        xl="4"
      >
        <v-card class="promotion-card h-100" elevation="2" hover>
          <v-card-text class="pa-6">
            <!-- Header com logos lado a lado -->
            <div class="logos-header mb-4">
              <div class="d-flex justify-space-between align-center">
                <!-- E-commerce Logo & Info -->
                <div class="logo-section">
                  <div class="logo-container mb-2">
                    <v-img
                      :src="promotion.ecommerce.logo_url"
                      :alt="promotion.ecommerce.name"
                      contain
                      height="80"
                      max-width="120"
                      class="ecommerce-logo"
                    >
                      <template v-slot:error>
                        <div class="logo-error">
                          <v-icon icon="mdi-store" size="30" color="grey"></v-icon>
                        </div>
                      </template>
                    </v-img>
                  </div>
                  <div class="text-center">
                    <p class="text-caption text-medium-emphasis mb-0">E-commerce</p>
                    <p class="text-body-2 font-weight-medium">
                      {{ promotion.ecommerce.name }}
                    </p>
                  </div>
                </div>

                <!-- VS Divider -->
                <div class="vs-divider mx-3">
                  <v-icon icon="mdi-plus" size="16" color="grey-lighten-1"></v-icon>
                </div>

                <!-- Program Logo & Info -->
                <div class="logo-section">
                  <div class="logo-container mb-2">
                    <v-img
                      :src="promotion.program.logo_url"
                      :alt="promotion.program.name"
                      contain
                      height="80"
                      max-width="120"
                      class="program-logo"
                    >
                      <template v-slot:error>
                        <div class="logo-error">
                          <v-icon icon="mdi-card-giftcard" size="30" color="grey"></v-icon>
                        </div>
                      </template>
                    </v-img>
                  </div>
                  <div class="text-center">
                    <p class="text-caption text-medium-emphasis mb-0">Programa</p>
                    <p class="text-body-2 font-weight-medium">
                      {{ promotion.program.name }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Promotion Value -->
            <div class="promotion-value">
              <v-divider class="mb-4"></v-divider>
              <div class="text-center">
                <p class="text-caption text-medium-emphasis mb-2">
                  Valor Atual da Promoção
                </p>
                <p class="text-h4 font-weight-bold text-primary mb-0">
                  {{ formatValue(promotion.current_value, promotion.program_type) }}
                </p>
              </div>
            </div>
          </v-card-text>

          <v-card-actions class="pa-6 pt-0">
            <v-btn
              variant="outlined"
              color="primary"
              block
              size="large"
            >
              <v-icon start>mdi-eye</v-icon>
              Ver Detalhes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else justify="center">
      <v-col cols="12" class="text-center">
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
      </v-col>
    </v-row>

    <!-- Paginação -->
    <v-row v-if="meta && meta.last_page > 1" justify="center" class="mt-6">
      <v-col cols="12">
        <div class="d-flex justify-center align-center flex-wrap ga-2">
          <!-- Botão Primeira Página -->
          <v-btn
            :disabled="meta.current_page === 1 || pending"
            @click="goToPage(1)"
            variant="outlined"
            size="small"
            icon="mdi-page-first"
          ></v-btn>

          <!-- Botão Página Anterior -->
          <v-btn
            :disabled="meta.current_page === 1 || pending"
            @click="goToPage(meta.current_page - 1)"
            variant="outlined"
            size="small"
            icon="mdi-chevron-left"
          ></v-btn>

          <!-- Números das páginas -->
          <template v-for="page in getPaginationPages()" :key="page">
            <v-btn
              v-if="page !== '...'"
              :variant="page === meta.current_page ? 'flat' : 'outlined'"
              :color="page === meta.current_page ? 'primary' : 'default'"
              @click="goToPage(page)"
              :disabled="pending"
              size="small"
              min-width="40"
            >
              {{ page }}
            </v-btn>
            <span v-else class="px-2 text-medium-emphasis">...</span>
          </template>

          <!-- Botão Próxima Página -->
          <v-btn
            :disabled="meta.current_page === meta.last_page || pending"
            @click="goToPage(meta.current_page + 1)"
            variant="outlined"
            size="small"
            icon="mdi-chevron-right"
          ></v-btn>

          <!-- Botão Última Página -->
          <v-btn
            :disabled="meta.current_page === meta.last_page || pending"
            @click="goToPage(meta.last_page)"
            variant="outlined"
            size="small"
            icon="mdi-page-last"
          ></v-btn>
        </div>

        <!-- Informações da paginação -->
        <div class="text-center mt-4">
          <p class="text-body-2 text-medium-emphasis">
            Mostrando {{ meta.from }} a {{ meta.to }} de
            {{ meta.total }} resultados (Página {{ meta.current_page }} de
            {{ meta.last_page }})
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <!-- Modal de Filtros -->
  <v-dialog
    v-model="filterDialog"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar color="primary" dark>
        <v-btn icon @click="filterDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Filtros</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text @click="clearFilters">Limpar</v-btn>
        <v-btn text @click="applyFilters">Aplicar</v-btn>
      </v-toolbar>

      <v-card-text class="pa-6">
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-autocomplete
                v-model="filters.categories"
                :items="categoryOptions"
                label="Categoria de ecommerce"
                variant="outlined"
                item-title="label"
                item-value="value"
                multiple
                chips
                clearable
                closable-chips
              ></v-autocomplete>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="filters.promotionTypes"
                :items="promotionTypeOptions"
                label="Tipo de promoção"
                variant="outlined"
                item-title="label"
                item-value="value"
                multiple
                chips
                clearable
                closable-chips
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="filters.ecommerces"
                :items="ecommerceOptions"
                label="E-commerces"
                variant="outlined"
                item-title="name"
                return-object
                multiple
                chips
                clearable
                closable-chips
              >
                <template v-slot:chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :prepend-avatar="item.logo_url"
                    :text="item.name"
                  ></v-chip>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="filters.pointsPrograms"
                :items="pointsProgramOptions"
                label="Programas de Pontos"
                variant="outlined"
                item-title="name"
                return-object
                multiple
                chips
                clearable
                closable-chips
              >
                <template v-slot:chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :prepend-avatar="item.logo_url"
                    :text="item.name"
                  ></v-chip>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="filters.milesPrograms"
                :items="milesProgramOptions"
                label="Programas de Milhas"
                variant="outlined"
                item-title="name"
                return-object
                multiple
                chips
                clearable
                closable-chips
              >
                <template v-slot:chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :prepend-avatar="item.logo_url"
                    :text="item.name"
                  ></v-chip>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="filters.cashbackPrograms"
                :items="cashbackProgramOptions"
                label="Programas de Cashback"
                variant="outlined"
                item-title="name"
                return-object
                multiple
                chips
                clearable
                closable-chips
              >
                <template v-slot:chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :prepend-avatar="item.logo_url"
                    :text="item.name"
                  ></v-chip>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="filters.orderBy"
                :items="orderByOptions"
                label="Ordenar por"
                variant="outlined"
                item-title="label"
                item-value="value"
                clearable
              ></v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="filters.order"
                :items="orderOptions"
                label="Ordem"
                variant="outlined"
                item-title="label"
                item-value="value"
                clearable
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
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
    category: string
  }

  type ProgramType = 'miles' | 'points' | 'cashback'
  interface Promotion {
    id: number
    current_value: number
    program_type: ProgramType
    program: Program
    ecommerce: Ecommerce
  }

  interface Links {
    first: string
    last: string
    prev: string
    next: string
  }

  interface Link {
    url: string
    label: string
    active: boolean
  }

  interface Meta {
    current_page: number
    from: number
    last_page: number
    path: string
    per_page: number
    to: number
    total: number
    links: Link[]
  }

  interface Response {
    data: Promotion[]
    links: Links
    meta: Meta
  }

  // Estado da paginação
  const route = useRoute()
  const router = useRouter()
  const currentPage = ref(Number(route.query.page) || 1)
  const itemsPerPage = ref(Number(route.query.per_page) || 15)

  // Estado do modal de filtros
  const filterDialog = ref(false)

  // Estado dos filtros
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

  // Opções para os selects
  const orderByOptions = [
    { label: 'Valor', value: 'current_value' },
    { label: 'Nome do programa', value: 'program_name' },
    { label: 'Nome do ecommerce', value: 'ecommerce_name' },
  ]

  const orderOptions = [
    { label: 'Do menor para o maior', value: 'asc' },
    { label: 'Do maior para o menor', value: 'desc' },
  ]

  const promotionTypeOptions = [
    { label: 'Milhas', value: 'miles' },
    { label: 'Pontos', value: 'points' },
    { label: 'Cashback', value: 'cashback' },
  ]

  // Opções para os novos filtros
  const ecommerceOptions = ref<any[]>([])
  const pointsProgramOptions = ref<any[]>([])
  const milesProgramOptions = ref<any[]>([])
  const cashbackProgramOptions = ref<any[]>([])
  const categoryOptions = ref<string[]>([])

  // Fetch das opções para os novos filtros em paralelo
  const [
    { data: ecommercesData },
    { data: pointsProgramsData },
    { data: milesProgramsData },
    { data: cashbackProgramsData },
    { data: categoriesData },
  ] = await Promise.all([
    useSanctumFetch<any[]>('/api/ecommerces'),
    useSanctumFetch<any[]>('/api/points-programs'),
    useSanctumFetch<any[]>('/api/miles-programs'),
    useSanctumFetch<any[]>('/api/cashback-programs'),
    useSanctumFetch<string[]>('/api/categories'),
  ])

  ecommerceOptions.value = ecommercesData.value?.data || []
  pointsProgramOptions.value = pointsProgramsData.value?.data || []
  milesProgramOptions.value = milesProgramsData.value?.data || []
  cashbackProgramOptions.value = cashbackProgramsData.value?.data || []
  categoryOptions.value = categoriesData.value || []

  // Função para inicializar filtros a partir da URL
  const initializeFiltersFromURL = () => {
    // Inicializa filtros básicos
    filters.value.orderBy = (route.query.order_by as string) || ''
    filters.value.order = (route.query.order as string) || ''

    // Função auxiliar para extrair valores de parâmetros com notação de array
    const extractArrayParams = (paramPrefix: string) => {
      const values: string[] = []
      Object.keys(route.query).forEach(key => {
        if (key.startsWith(paramPrefix + '[') && key.endsWith(']')) {
          const value = route.query[key]
          if (value) {
            values.push(Array.isArray(value) ? value[0] : value)
          }
        }
      })
      return values
    }

    // Inicializa tipos de promoção
    const promotionTypes = extractArrayParams('program_types')
    if (promotionTypes.length > 0) {
      filters.value.promotionTypes = promotionTypes
    }

    // Inicializa categorias
    const categories = extractArrayParams('categories')
    if (categories.length > 0) {
      filters.value.categories = categories
    }

    // Inicializa e-commerces
    const ecommerceIds = extractArrayParams('ecommerces')
    if (ecommerceIds.length > 0 && ecommerceOptions.value.length > 0) {
      filters.value.ecommerces = ecommerceOptions.value.filter(e =>
        ecommerceIds.includes(e.id.toString())
      )
    }

    // Inicializa programas de pontos
    const pointsProgramIds = extractArrayParams('points_programs')
    if (pointsProgramIds.length > 0 && pointsProgramOptions.value.length > 0) {
      filters.value.pointsPrograms = pointsProgramOptions.value.filter(p =>
        pointsProgramIds.includes(p.id.toString())
      )
    }

    // Inicializa programas de milhas
    const milesProgramIds = extractArrayParams('miles_programs')
    if (milesProgramIds.length > 0 && milesProgramOptions.value.length > 0) {
      filters.value.milesPrograms = milesProgramOptions.value.filter(p =>
        milesProgramIds.includes(p.id.toString())
      )
    }

    // Inicializa programas de cashback
    const cashbackProgramIds = extractArrayParams('cashback_programs')
    if (
      cashbackProgramIds.length > 0 &&
      cashbackProgramOptions.value.length > 0
    ) {
      filters.value.cashbackPrograms = cashbackProgramOptions.value.filter(p =>
        cashbackProgramIds.includes(p.id.toString())
      )
    }
  }

  // Inicializa filtros a partir da URL
  initializeFiltersFromURL()

  // Watcher para reagir a mudanças na rota
  watch(
    () => route.query,
    newQuery => {
      // Atualiza a página atual se mudou na URL
      const newPage = Number(newQuery.page) || 1
      if (newPage !== currentPage.value) {
        currentPage.value = newPage
      }

      // Atualiza os filtros se mudaram na URL
      initializeFiltersFromURL()
    },
    { deep: true }
  )

  // Função para atualizar a URL com os filtros atuais
  const updateURLWithFilters = () => {
    const query: any = {
      page: currentPage.value,
      per_page: itemsPerPage.value,
    }

    // Adiciona filtros básicos se existirem
    if (filters.value.orderBy) {
      query.order_by = filters.value.orderBy
    }

    if (filters.value.order) {
      query.order = filters.value.order
    }

    // Adiciona tipos de promoção com notação de array
    if (filters.value.promotionTypes.length > 0) {
      filters.value.promotionTypes.forEach((type, index) => {
        query[`program_types[${index}]`] = type
      })
    }

    // Adiciona categorias com notação de array
    if (filters.value.categories.length > 0) {
      filters.value.categories.forEach((category, index) => {
        query[`categories[${index}]`] = category
      })
    }

    // Adiciona e-commerces com notação de array
    if (filters.value.ecommerces.length > 0) {
      filters.value.ecommerces.forEach((ecommerce, index) => {
        query[`ecommerces[${index}]`] = ecommerce.id
      })
    }

    // Adiciona programas de pontos com notação de array
    if (filters.value.pointsPrograms.length > 0) {
      filters.value.pointsPrograms.forEach((program, index) => {
        query[`points_programs[${index}]`] = program.id
      })
    }

    // Adiciona programas de milhas com notação de array
    if (filters.value.milesPrograms.length > 0) {
      filters.value.milesPrograms.forEach((program, index) => {
        query[`miles_programs[${index}]`] = program.id
      })
    }

    // Adiciona programas de cashback com notação de array
    if (filters.value.cashbackPrograms.length > 0) {
      filters.value.cashbackPrograms.forEach((program, index) => {
        query[`cashback_programs[${index}]`] = program.id
      })
    }

    // Atualiza a URL sem recarregar a página
    navigateTo({ query })
  }

  // Função para construir query params para requisições
  const buildQueryParams = () => {
    const queryParams: any = {
      page: currentPage.value,
      per_page: itemsPerPage.value,
    }

    // Adiciona filtros básicos se existirem
    if (filters.value.orderBy) {
      queryParams.order_by = filters.value.orderBy
    }

    if (filters.value.order) {
      queryParams.order = filters.value.order
    }

    return queryParams
  }

  // Função para fazer requisição com filtros de array
  const fetchWithArrayFilters = async (queryParams: any) => {
    // Verifica se há filtros que precisam de query string manual
    const hasArrayFilters =
      filters.value.promotionTypes.length > 0 ||
      filters.value.categories.length > 0 ||
      filters.value.ecommerces.length > 0 ||
      filters.value.pointsPrograms.length > 0 ||
      filters.value.milesPrograms.length > 0 ||
      filters.value.cashbackPrograms.length > 0

    if (hasArrayFilters) {
      // Constrói query string manualmente para manter colchetes literais
      const queryParts = []

      // Adiciona outros parâmetros
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParts.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
          )
        }
      })

      // Adiciona program_types[] para cada valor
      filters.value.promotionTypes.forEach(type => {
        queryParts.push(`program_types[]=${encodeURIComponent(type)}`)
      })

      // Adiciona categories[] para cada valor
      filters.value.categories.forEach(category => {
        queryParts.push(`categories[]=${encodeURIComponent(category)}`)
      })

      // Adiciona ecommerces[] para cada valor
      filters.value.ecommerces.forEach(ecommerce => {
        queryParts.push(`ecommerces[]=${encodeURIComponent(ecommerce.id)}`)
      })

      // Adiciona points_programs[] para cada valor
      filters.value.pointsPrograms.forEach(program => {
        queryParts.push(`points_programs[]=${encodeURIComponent(program.id)}`)
      })

      // Adiciona miles_programs[] para cada valor
      filters.value.milesPrograms.forEach(program => {
        queryParts.push(`miles_programs[]=${encodeURIComponent(program.id)}`)
      })

      // Adiciona cashback_programs[] para cada valor
      filters.value.cashbackPrograms.forEach(program => {
        queryParts.push(`cashback_programs[]=${encodeURIComponent(program.id)}`)
      })

      const queryString = queryParts.join('&')
      return await useSanctumFetch<Response>(`/api/promotions?${queryString}`)
    } else {
      return await useSanctumFetch<Response>('/api/promotions', {
        query: queryParams,
      })
    }
  }

  // Fetch inicial com filtros da URL
  const initialQueryParams = buildQueryParams()
  const {
    data: initialResponse,
    pending: initialPending,
    error: initialError,
  } = await fetchWithArrayFilters(initialQueryParams)

  const promotions = ref<Promotion[]>(initialResponse.value?.data || [])
  const meta = ref<Meta | undefined>(initialResponse.value?.meta)
  const links = ref<Links | undefined>(initialResponse.value?.links)
  const pending = ref(initialPending.value)
  const error = ref(initialError.value)

  // Função para navegar entre páginas
  const goToPage = async (page: number) => {
    currentPage.value = page
    pending.value = true

    // Atualiza a URL com a nova página
    updateURLWithFilters()

    try {
      const queryParams = buildQueryParams()
      const newResponse = await fetchWithArrayFilters(queryParams)

      promotions.value = newResponse.data.value?.data || []
      meta.value = newResponse.data.value?.meta
      links.value = newResponse.data.value?.links
      error.value = null
    } catch (err) {
      console.error('Erro ao carregar página:', err)
      error.value = err
    } finally {
      pending.value = false
    }
  }

  // Função para gerar os números das páginas para exibição
  const getPaginationPages = () => {
    if (!meta.value) return []

    const current = meta.value.current_page
    const last = meta.value.last_page
    const pages: (number | string)[] = []

    // Se há 7 páginas ou menos, mostra todas
    if (last <= 7) {
      for (let i = 1; i <= last; i++) {
        pages.push(i)
      }
      return pages
    }

    // Sempre mostra a primeira página
    pages.push(1)

    // Se a página atual está longe do início, adiciona "..."
    if (current > 4) {
      pages.push('...')
    }

    // Páginas ao redor da atual
    const start = Math.max(2, current - 1)
    const end = Math.min(last - 1, current + 1)

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    // Se a página atual está longe do fim, adiciona "..."
    if (current < last - 3) {
      pages.push('...')
    }

    // Sempre mostra a última página
    if (!pages.includes(last)) {
      pages.push(last)
    }

    return pages
  }

  // Computed para verificar se há filtros ativos
  const hasActiveFilters = computed(() => {
    return (
      filters.value.promotionTypes.length > 0 ||
      filters.value.categories.length > 0 ||
      filters.value.ecommerces.length > 0 ||
      filters.value.pointsPrograms.length > 0 ||
      filters.value.milesPrograms.length > 0 ||
      filters.value.cashbackPrograms.length > 0
    )
  })

  // Função para obter o label do tipo de promoção
  const getPromotionTypeLabel = (type: string): string => {
    const option = promotionTypeOptions.find(opt => opt.value === type)
    return option ? option.label : type
  }
  // Função para obter o label da categoria
  const getCategoryLabel = (category: string): string => {
    const option = categoryOptions.find(opt => opt === category)
    return option ? option : category
  }

  // Funções para remover filtros individuais
  const removePromotionTypeFilter = async (type: string) => {
    filters.value.promotionTypes = filters.value.promotionTypes.filter(
      t => t !== type
    )
    await applyFilters()
  }
  // Função para remover filtros de categoria
  const removeCategoryFilter = async (category: string) => {
    filters.value.categories = filters.value.categories.filter(
      c => c !== category
    )
    await applyFilters()
  }

  const removeEcommerceFilter = async (ecommerce: any) => {
    filters.value.ecommerces = filters.value.ecommerces.filter(
      e => e.id !== ecommerce.id
    )
    await applyFilters()
  }

  const removePointsProgramFilter = async (program: any) => {
    filters.value.pointsPrograms = filters.value.pointsPrograms.filter(
      p => p.id !== program.id
    )
    await applyFilters()
  }

  const removeMilesProgramFilter = async (program: any) => {
    filters.value.milesPrograms = filters.value.milesPrograms.filter(
      p => p.id !== program.id
    )
    await applyFilters()
  }

  const removeCashbackProgramFilter = async (program: any) => {
    filters.value.cashbackPrograms = filters.value.cashbackPrograms.filter(
      p => p.id !== program.id
    )
    await applyFilters()
  }

  // Função para limpar todos os filtros
  const clearAllFilters = async () => {
    clearFilters()
    currentPage.value = 1
    updateURLWithFilters()
    await applyFilters()
  }

  // Função para formatar valores baseado no tipo
  const formatValue = (value: number, type: ProgramType): string => {
    switch (type) {
      case 'miles':
        return `${value} milhas/R$`
      case 'points':
        return `${value} pontos/R$`
      case 'cashback':
        return `${value}% cashback`
      default:
        return value.toString()
    }
  }
  // Função para limpar filtros
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
    // Atualiza a URL removendo todos os filtros
    currentPage.value = 1
    updateURLWithFilters()
  }

  // Função para aplicar filtros
  const applyFilters = async () => {
    currentPage.value = 1
    pending.value = true
    filterDialog.value = false

    // Atualiza a URL com os filtros aplicados
    updateURLWithFilters()

    try {
      const queryParams = buildQueryParams()
      const newResponse = await fetchWithArrayFilters(queryParams)

      promotions.value = newResponse.data.value?.data || []
      meta.value = newResponse.data.value?.meta
      links.value = newResponse.data.value?.links
      error.value = null
    } catch (err) {
      console.error('Erro ao aplicar filtros:', err)
      error.value = err
    } finally {
      pending.value = false
    }
  }
</script>

<style scoped>
  /* Redesigned Promotion Cards */
  .promotion-card {
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .promotion-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
  }

  /* Logos Header Layout */
  .logos-header {
    background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
    padding: 20px;
    border-radius: 16px;
    margin: -24px -24px 20px -24px;
  }

  .logo-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 45%;
  }

  .logo-container {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .ecommerce-logo,
  .program-logo {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
  }

  .logo-error {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .vs-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }

  /* Promotion Value Section */
  .promotion-value {
    background: rgba(25, 118, 210, 0.02);
    padding: 20px;
    border-radius: 16px;
    margin: 0 -24px -24px -24px;
  }

  /* Text Adjustments */
  .logo-section .text-body-2 {
    font-size: 0.9rem;
    line-height: 1.3;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Dark Theme */
  .v-theme--dark .logos-header {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  }

  .v-theme--dark .logo-container {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
  }

  .v-theme--dark .vs-divider {
    background: rgba(255, 255, 255, 0.08);
  }

  .v-theme--dark .promotion-value {
    background: rgba(25, 118, 210, 0.08);
  }

  .v-theme--dark .logo-error {
    background: rgba(255, 255, 255, 0.05);
  }

  /* Responsive Adjustments */
  @media (max-width: 600px) {
    .logos-header {
      padding: 16px;
      margin: -24px -24px 16px -24px;
    }
    
    .logo-container {
      height: 60px;
      padding: 8px;
    }
    
    .vs-divider {
      width: 32px;
      height: 32px;
      margin: 0 12px;
    }
    
    .logo-section .text-body-2 {
      font-size: 0.8rem;
    }

    .promotion-value {
      padding: 16px;
      margin: 0 -24px -24px -24px;
    }
  }

  /* Height and flex utilities */
  .h-100 {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .h-100 .v-card-text {
    flex-grow: 1;
  }

  /* Remove old styles */
  .ecommerce-section,
  .program-section {
    display: none;
  }

  .current-value-section {
    display: none;
  }
</style>
