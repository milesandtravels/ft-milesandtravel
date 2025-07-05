<template>
  <v-dialog v-model="dialogModel" max-width="900px" persistent scrollable>
    <v-card>
      <v-card-title class="pa-4 bg-primary text-white">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon icon="mdi-filter-variant" class="me-2" />
            <span class="text-h6">Filtros de Ofertas</span>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
            @click="closeDialog"
          />
        </div>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-row>
          <!-- Filtro por Tipos de Programa -->
          <v-col cols="12">
            <h3 class="text-h6 mb-3">Tipos de Programa</h3>
            <v-chip-group
              v-model="localFilters.promotionTypes"
              color="primary"
              filter
              multiple
              class="mb-4"
            >
              <v-chip
                v-for="type in programTypeOptions"
                :key="type.value"
                :value="type.value"
                filter
                :prepend-icon="getProgramTypeIcon(type.value)"
              >
                {{ type.label }}
              </v-chip>
            </v-chip-group>
          </v-col>

          <v-divider class="my-4" />

          <!-- Filtro por E-commerces -->
          <v-col cols="12" md="6">
            <h3 class="text-h6 mb-3">E-commerces</h3>
            <v-select
              v-model="localFilters.ecommerces"
              :items="ecommerceOptions"
              :loading="loadingOptions"
              label="Selecione os e-commerces"
              multiple
              chips
              closable-chips
              clearable
              variant="outlined"
              density="comfortable"
              max-height="300"
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :prepend-avatar="item.raw?.logo_url"
                  size="small"
                >
                  {{ item.title }}
                </v-chip>
              </template>
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :prepend-avatar="item.raw?.logo_url"
                  :title="item.title"
                />
              </template>
            </v-select>
          </v-col>

          <!-- Filtro por Produtos -->
          <v-col cols="12" md="6">
            <h3 class="text-h6 mb-3">Produtos</h3>
            <v-select
              v-model="localFilters.products"
              :items="productOptions"
              label="Selecione os produtos"
              multiple
              chips
              closable-chips
              clearable
              variant="outlined"
              density="comfortable"
              max-height="300"
            >
              <template v-slot:chip="{ props, item }">
                <v-chip v-bind="props" size="small">
                  {{ item.title }}
                </v-chip>
              </template>
            </v-select>
          </v-col>

          <!-- Filtro por Programas de Milhas -->
          <v-col cols="12" md="4">
            <h3 class="text-h6 mb-3">
              <v-icon icon="mdi-airplane" class="me-2" />
              Programas de Milhas
            </h3>
            <v-select
              v-model="localFilters.milesPrograms"
              :items="milesProgramOptions"
              :loading="loadingOptions"
              label="Selecione programas de milhas"
              multiple
              chips
              closable-chips
              clearable
              variant="outlined"
              density="comfortable"
              max-height="300"
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :prepend-avatar="item.raw?.logo_url"
                  size="small"
                  color="purple"
                >
                  {{ item.title }}
                </v-chip>
              </template>
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :prepend-avatar="item.raw?.logo_url"
                  :title="item.title"
                />
              </template>
            </v-select>
          </v-col>

          <!-- Filtro por Programas de Pontos -->
          <v-col cols="12" md="4">
            <h3 class="text-h6 mb-3">
              <v-icon icon="mdi-star" class="me-2" />
              Programas de Pontos
            </h3>
            <v-select
              v-model="localFilters.pointsPrograms"
              :items="pointsProgramOptions"
              :loading="loadingOptions"
              label="Selecione programas de pontos"
              multiple
              chips
              closable-chips
              clearable
              variant="outlined"
              density="comfortable"
              max-height="300"
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :prepend-avatar="item.raw?.logo_url"
                  size="small"
                  color="blue"
                >
                  {{ item.title }}
                </v-chip>
              </template>
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :prepend-avatar="item.raw?.logo_url"
                  :title="item.title"
                />
              </template>
            </v-select>
          </v-col>

          <!-- Filtro por Programas de Cashback -->
          <v-col cols="12" md="4">
            <h3 class="text-h6 mb-3">
              <v-icon icon="mdi-cash" class="me-2" />
              Programas de Cashback
            </h3>
            <v-select
              v-model="localFilters.cashbackPrograms"
              :items="cashbackProgramOptions"
              :loading="loadingOptions"
              label="Selecione programas de cashback"
              multiple
              chips
              closable-chips
              clearable
              variant="outlined"
              density="comfortable"
              max-height="300"
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :prepend-avatar="item.raw?.logo_url"
                  size="small"
                  color="green"
                >
                  {{ item.title }}
                </v-chip>
              </template>
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :prepend-avatar="item.raw?.logo_url"
                  :title="item.title"
                />
              </template>
            </v-select>
          </v-col>
        </v-row>

        <!-- Resumo dos filtros selecionados -->
        <div v-if="hasActiveFilters" class="mt-6">
          <v-divider class="mb-4" />
          <h4 class="text-subtitle-1 mb-3">Resumo dos Filtros Selecionados:</h4>
          <div class="d-flex flex-wrap gap-2">
            <!-- Chips dos filtros ativos -->
            <v-chip
              v-for="type in localFilters.promotionTypes"
              :key="`type-${type}`"
              size="small"
              color="primary"
              variant="flat"
            >
              {{ getProgramTypeLabel(type) }}
            </v-chip>

            <v-chip
              v-for="ecommerce in selectedEcommerceItems"
              :key="`ecommerce-${ecommerce.id}`"
              size="small"
              color="primary"
              variant="outlined"
              :prepend-avatar="ecommerce.logo_url"
            >
              {{ ecommerce.name }}
            </v-chip>

            <v-chip
              v-for="program in selectedProgramItems"
              :key="`program-${program.type}-${program.id}`"
              size="small"
              :color="getProgramTypeColor(program.type)"
              variant="outlined"
              :prepend-avatar="program.logo_url"
            >
              {{ program.name }}
            </v-chip>

            <v-chip
              v-if="localFilters.products.length > 0"
              size="small"
              color="primary"
              variant="outlined"
            >
              {{ localFilters.products.length }} produto(s)
            </v-chip>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4 bg-grey-lighten-5">
        <v-spacer />
        <v-btn
          variant="outlined"
          color="grey"
          @click="clearAllFilters"
          :disabled="!hasActiveFilters"
        >
          <v-icon icon="mdi-filter-off" class="me-2" />
          Limpar Tudo
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="applyFilters"
          :loading="applyingFilters"
        >
          <v-icon icon="mdi-check" class="me-2" />
          Aplicar Filtros
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { FilterData, OfferItem, ProgramType } from '~/interfaces/offers'

  interface LocalFilters {
    promotionTypes: ProgramType[]
    ecommerces: any[]
    products: number[]
    milesPrograms: any[]
    pointsPrograms: any[]
    cashbackPrograms: any[]
  }

  interface FilterOptions {
    ecommerces: number[]
    products: number[]
    miles_programs: number[]
    points_programs: number[]
    cashback_programs: number[]
    program_types: ProgramType[]
  }

  interface Props {
    modelValue: boolean
    availableOffers: OfferItem[]
    filters: FilterOptions
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    apply: [filters: FilterOptions]
    clear: []
  }>()

  // Computed para controlar o dialog
  const dialogModel = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value),
  })

  // Estados locais
  const loadingOptions = ref(false)
  const applyingFilters = ref(false)

  // Filtros locais (cópia dos filtros para edição na modal)
  const localFilters = ref<LocalFilters>({
    promotionTypes: [],
    ecommerces: [],
    products: [],
    milesPrograms: [],
    pointsPrograms: [],
    cashbackPrograms: [],
  })

  // Dados das opções dos filtros vindos da API
  const filterData = ref<FilterData>({
    ecommerces: [],
    points: [],
    miles: [],
    cashback: [],
  })

  // Opções dos filtros
  const programTypeOptions = [
    { label: 'Cashback', value: 'cashback' as ProgramType },
    { label: 'Pontos', value: 'points' as ProgramType },
    { label: 'Milhas', value: 'miles' as ProgramType },
  ]

  const ecommerceOptions = computed(() => {
    return filterData.value.ecommerces
      .map(ecommerce => ({
        title: ecommerce.name,
        value: ecommerce,
        raw: ecommerce,
      }))
      .sort((a, b) => a.title.localeCompare(b.title))
  })

  const productOptions = computed(() => {
    const products = new Map()
    props.availableOffers.forEach(offer => {
      if (!products.has(offer.product.id)) {
        products.set(offer.product.id, {
          title: offer.product.name,
          value: offer.product.id,
          raw: offer.product,
        })
      }
    })
    return Array.from(products.values()).sort((a, b) =>
      a.title.localeCompare(b.title)
    )
  })

  const milesProgramOptions = computed(() => {
    return filterData.value.miles
      .map(program => ({
        title: program.name,
        value: program,
        raw: program,
      }))
      .sort((a, b) => a.title.localeCompare(b.title))
  })

  const pointsProgramOptions = computed(() => {
    return filterData.value.points
      .map(program => ({
        title: program.name,
        value: program,
        raw: program,
      }))
      .sort((a, b) => a.title.localeCompare(b.title))
  })

  const cashbackProgramOptions = computed(() => {
    return filterData.value.cashback
      .map(program => ({
        title: program.name,
        value: program,
        raw: program,
      }))
      .sort((a, b) => a.title.localeCompare(b.title))
  })

  // Computed para verificar filtros ativos
  const hasActiveFilters = computed(() => {
    return (
      localFilters.value.promotionTypes.length > 0 ||
      localFilters.value.ecommerces.length > 0 ||
      localFilters.value.products.length > 0 ||
      localFilters.value.milesPrograms.length > 0 ||
      localFilters.value.pointsPrograms.length > 0 ||
      localFilters.value.cashbackPrograms.length > 0
    )
  })

  // Computed para items selecionados (para exibição)
  const selectedEcommerceItems = computed(() => localFilters.value.ecommerces)
  const selectedProgramItems = computed(() => [
    ...localFilters.value.milesPrograms.map(p => ({ ...p, type: 'miles' })),
    ...localFilters.value.pointsPrograms.map(p => ({ ...p, type: 'points' })),
    ...localFilters.value.cashbackPrograms.map(p => ({
      ...p,
      type: 'cashback',
    })),
  ])

  // Métodos auxiliares
  const getProgramTypeIcon = (type: ProgramType) => {
    const icons = {
      cashback: 'mdi-cash',
      points: 'mdi-star',
      miles: 'mdi-airplane',
    }
    return icons[type] || 'mdi-gift'
  }

  const getProgramTypeColor = (type: string) => {
    const colors = {
      cashback: 'green',
      points: 'blue',
      miles: 'purple',
    }
    return colors[type] || 'primary'
  }

  const getProgramTypeLabel = (type: ProgramType) => {
    const option = programTypeOptions.find(opt => opt.value === type)
    return option?.label || type
  }

  // Buscar opções dos filtros via API
  const fetchFilterOptions = async () => {
    try {
      loadingOptions.value = true

      const [{ data: ecommercesData }, { data: programsData }] =
        await Promise.all([
          useSanctumFetch<any>('/api/ecommerces'),
          useSanctumFetch<any>('/api/programs'),
        ])

      filterData.value = {
        ecommerces: ecommercesData.value?.data || [],
        points: programsData.value?.points || [],
        miles: programsData.value?.miles || [],
        cashback: programsData.value?.cashback || [],
      }
    } catch (error) {
      console.error('Erro ao buscar opções dos filtros:', error)
    } finally {
      loadingOptions.value = false
    }
  }

  // Métodos principais
  const applyFilters = async () => {
    try {
      applyingFilters.value = true

      const filters: FilterOptions = {
        ecommerces: localFilters.value.ecommerces.map(e => e.id),
        products: localFilters.value.products,
        miles_programs: localFilters.value.milesPrograms.map(p => p.id),
        points_programs: localFilters.value.pointsPrograms.map(p => p.id),
        cashback_programs: localFilters.value.cashbackPrograms.map(p => p.id),
        program_types: localFilters.value.promotionTypes,
      }

      emit('apply', filters)
      dialogModel.value = false
    } finally {
      applyingFilters.value = false
    }
  }

  const clearAllFilters = () => {
    localFilters.value = {
      promotionTypes: [],
      ecommerces: [],
      products: [],
      milesPrograms: [],
      pointsPrograms: [],
      cashbackPrograms: [],
    }
  }

  const closeDialog = () => {
    dialogModel.value = false
  }

  // Sincronizar filtros externos com filtros locais
  const syncFiltersFromProps = () => {
    // Aqui você pode sincronizar os filtros recebidos via props
    // com os filtros locais se necessário
  }

  // Watchers
  watch(
    () => props.modelValue,
    newValue => {
      if (newValue) {
        syncFiltersFromProps()
      }
    }
  )

  // Inicialização
  onMounted(async () => {
    await fetchFilterOptions()
  })
</script>

<style scoped>
  .gap-2 {
    gap: 8px;
  }

  :deep(.v-dialog) {
    align-items: flex-start;
    padding-top: 50px;
  }

  :deep(.v-card-text) {
    max-height: 70vh;
    overflow-y: auto;
  }
</style>
