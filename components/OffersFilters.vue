<template>
  <v-dialog 
    v-model="dialogModel" 
    :max-width="$vuetify.display.mobile ? undefined : '900px'"
    :fullscreen="$vuetify.display.mobile"
    :transition="$vuetify.display.mobile ? 'dialog-bottom-transition' : 'dialog-transition'"
    persistent 
    scrollable
  >
    <v-card>
      <!-- Header padronizado -->
      <ModalHeader title="Filtros de Ofertas" @close="closeDialog" />

      <v-divider />

      <v-card-text class="pa-4 pa-md-6" style="max-height: 70vh">
        <v-container class="pa-0">
        <v-row class="gy-2">

            <!-- Filtro por E-commerces -->
            <v-col cols="12" md="6">
              <EcommerceAutocomplete
                v-model="selectedEcommerces"
                @ecommerces-selected="handleEcommerceSelection"
              />
            </v-col>

            <!-- Filtro por Produtos -->
            <v-col cols="12" md="6">
              <OfferProductsSelected
                v-model="selectedProducts"
                :search-id="searchId"
                @products-selected="handleProductsSelection"
              />
            </v-col>

            <!-- Filtro por Programas de Milhas -->
            <v-col cols="12" md="4">
              <OfferProgramsAutocomplete
                v-model="selectedMilesPrograms"
                program-type="miles"
                @programs-selected="handleMilesProgramsSelection"
              />
            </v-col>

            <!-- Filtro por Programas de Pontos -->
            <v-col cols="12" md="4">
              <OfferProgramsAutocomplete
                v-model="selectedPointsPrograms"
                program-type="points"
                @programs-selected="handlePointsProgramsSelection"
              />
            </v-col>

            <!-- Filtro por Programas de Cashback -->
            <v-col cols="12" md="4">
              <OfferProgramsAutocomplete
                v-model="selectedCashbackPrograms"
                program-type="cashback"
                @programs-selected="handleCashbackProgramsSelection"
              />
            </v-col>
          </v-row>

          <!-- Resumo dos filtros selecionados -->
          <div v-if="hasActiveFilters" class="mt-6">
            <v-divider class="mb-4" />
            <h4 class="text-subtitle-1 mb-3">Resumo dos Filtros Selecionados:</h4>
            <div class="d-flex flex-wrap" style="gap: 8px">
            <!-- Chips dos filtros ativos -->
            <v-chip
              v-for="type in localFilters.program_types"
              :key="`type-${type}`"
              size="small"
              variant="outlined"
              :prepend-icon="getProgramTypeIcon(type)"
              :color="getProgramTypeColor(type)"
            >
              {{ getProgramTypeLabel(type) }}
            </v-chip>

            <v-chip
              v-for="ecommerce in selectedEcommerces"
              :key="`ecommerce-${ecommerce.id}`"
              size="small"
              variant="outlined"
              prepend-icon="mdi-store"
              color="blue"
            >
              {{ ecommerce.name }}
            </v-chip>

            <v-chip
              v-for="product in selectedProducts"
              :key="`product-${product.id}`"
              size="small"
              variant="outlined"
              prepend-icon="mdi-package-variant"
              color="green"
            >
              {{ product.name }}
            </v-chip>

            <v-chip
              v-for="program in selectedPrograms"
              :key="`program-${program.type}-${program.id}`"
              size="small"
              variant="outlined"
              :prepend-icon="getProgramTypeIcon(program.type as ProgramType)"
              :color="getProgramTypeColor(program.type)"
            >
              {{ program.name }}
            </v-chip>
            </div>
          </div>
        </v-container>
      </v-card-text>

      <v-divider />

      <!-- Footer padronizado -->
      <v-card-actions class="pa-4 pa-md-6 bg-grey-lighten-5">
        <v-btn
          variant="outlined"
          color="grey"
          @click="clearAllFilters"
          :disabled="!hasActiveFilters"
          prepend-icon="mdi-refresh"
        >
          Limpar Tudo
        </v-btn>
        
        <v-spacer />
        
        <v-btn
          variant="outlined"
          @click="closeDialog"
          class="me-2"
        >
          Cancelar
        </v-btn>
        
        <v-btn
          color="primary"
          variant="flat"
          @click="applyFilters"
          :loading="applyingFilters"
          prepend-icon="mdi-check"
        >
          Aplicar Filtros
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { OfferFilters, ProgramType } from '~/interfaces/offers'

  type LocalFilters = {
    program_types: ProgramType[]
    ecommerces: number[]
    products: number[]
    miles_programs: number[]
    points_programs: number[]
    cashback_programs: number[]
  }

  interface Props {
    modelValue: boolean
    searchId: string | number
    filters?: OfferFilters
  }

  const props = withDefaults(defineProps<Props>(), {
    filters: () => ({
      ecommerces: [],
      products: [],
      miles_programs: [],
      points_programs: [],
      cashback_programs: [],
      program_types: [],
    }),
  })

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'filters-applied': [offers: any[]]
    clear: []
  }>()

  // Computed para controlar o dialog
  const dialogModel = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value),
  })

  // Estados locais
  const applyingFilters = ref(false)

  // Filtros locais (cópia dos filtros para edição na modal)
  const localFilters = ref<LocalFilters>({
    program_types: [],
    ecommerces: [],
    products: [],
    miles_programs: [],
    points_programs: [],
    cashback_programs: [],
  })

  // Estados para armazenar os dados selecionados
  const selectedEcommerces = ref<any[]>([])
  const selectedProducts = ref<any[]>([])
  const selectedMilesPrograms = ref<any[]>([])
  const selectedPointsPrograms = ref<any[]>([])
  const selectedCashbackPrograms = ref<any[]>([])

  // Opções dos filtros
  const programTypeOptions = [
    { label: 'Cashback', value: 'cashback' as ProgramType },
    { label: 'Pontos', value: 'points' as ProgramType },
    { label: 'Milhas', value: 'miles' as ProgramType },
  ]

  // Computed para todos os programas selecionados
  const selectedPrograms = computed(() => [
    ...selectedMilesPrograms.value.map(p => ({ ...p, type: 'miles' })),
    ...selectedPointsPrograms.value.map(p => ({ ...p, type: 'points' })),
    ...selectedCashbackPrograms.value.map(p => ({ ...p, type: 'cashback' })),
  ])

  // Computed para verificar filtros ativos
  const hasActiveFilters = computed(() => {
    return (
      localFilters.value.program_types.length > 0 ||
      selectedEcommerces.value.length > 0 ||
      selectedProducts.value.length > 0 ||
      selectedPrograms.value.length > 0
    )
  })

  const activeFiltersCount = computed(() => {
    let count = 0
    if (localFilters.value.program_types.length > 0) count++
    if (selectedEcommerces.value.length > 0) count++
    if (selectedProducts.value.length > 0) count++
    if (selectedPrograms.value.length > 0) count++
    return count
  })

  // Métodos para lidar com as seleções dos componentes
  function handleEcommerceSelection(ecommerces: any[]) {
    selectedEcommerces.value = ecommerces
    localFilters.value.ecommerces = ecommerces.map(e => e.id)
  }

  function handleProductsSelection(products: any[]) {
    selectedProducts.value = products
    localFilters.value.products = products.map(p => p.id)
  }

  function handleMilesProgramsSelection(programs: any[]) {
    selectedMilesPrograms.value = programs
    localFilters.value.miles_programs = programs.map(p => p.id)
  }

  function handlePointsProgramsSelection(programs: any[]) {
    selectedPointsPrograms.value = programs
    localFilters.value.points_programs = programs.map(p => p.id)
  }

  function handleCashbackProgramsSelection(programs: any[]) {
    selectedCashbackPrograms.value = programs
    localFilters.value.cashback_programs = programs.map(p => p.id)
  }

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

  // Métodos principais
  const applyFilters = async () => {
    try {
      applyingFilters.value = true

      const payload = {
        ecommerces: localFilters.value.ecommerces,
        products: localFilters.value.products,
        miles_programs: localFilters.value.miles_programs,
        points_programs: localFilters.value.points_programs,
        cashback_programs: localFilters.value.cashback_programs,
        program_types: localFilters.value.program_types,
      }

      // Fazer a chamada para a API de ofertas filtradas
      const { data: offersData } = await useSanctumFetch<any>(
        `/api/searches/${props.searchId}/offers`,
        {
          method: 'POST',
          body: payload,
        }
      )

      emit('filters-applied', offersData.value?.data || [])
      dialogModel.value = false
    } catch (error) {
      console.error('Erro ao aplicar filtros:', error)
    } finally {
      applyingFilters.value = false
    }
  }

  const clearAllFilters = () => {
    localFilters.value = {
      program_types: [],
      ecommerces: [],
      products: [],
      miles_programs: [],
      points_programs: [],
      cashback_programs: [],
    }
    selectedEcommerces.value = []
    selectedProducts.value = []
    selectedMilesPrograms.value = []
    selectedPointsPrograms.value = []
    selectedCashbackPrograms.value = []
    emit('clear')
  }

  const closeDialog = () => {
    dialogModel.value = false
  }

  // Watchers
  watch(
    () => props.filters,
    newFilters => {
      if (newFilters) {
        localFilters.value = {
          program_types: [...newFilters.program_types],
          ecommerces: [...newFilters.ecommerces],
          products: [...newFilters.products],
          miles_programs: [...newFilters.miles_programs],
          points_programs: [...newFilters.points_programs],
          cashback_programs: [...newFilters.cashback_programs],
        }
      }
    },
    { immediate: true, deep: true }
  )
</script>
