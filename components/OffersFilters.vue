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

      <v-card-text class="pa-4" >
        <v-container >
          <v-row class="gy-1">
            <!-- Primeira linha: Marketplace e Produtos -->
            <v-col cols="12" md="6" >
              <EcommerceAutocomplete
                v-model="selectedEcommerces"
                :search-id="searchId"
                @ecommerce-selected="handleEcommerceSelection"
                multiple
              />
            </v-col>
            
            <v-col cols="12" md="6" >
              <OfferProductsSelected
                v-model="selectedProducts"
                :search-id="searchId"
                @products-selected="handleProductsSelection"
              />
            </v-col>

            <!-- Segunda linha: Programas de Milhas e Pontos -->
            <v-col cols="12" md="6" >
              <OfferProgramsAutocomplete
                v-model="selectedMilesPrograms"
                program-type="miles"
                :programs="allPrograms"
                :auto-fetch="false"
                @programs-selected="handleMilesProgramsSelection"
              />
            </v-col>
            
            <v-col cols="12" md="6" >
              <OfferProgramsAutocomplete
                v-model="selectedPointsPrograms"
                program-type="points"
                :programs="allPrograms"
                :auto-fetch="false"
                @programs-selected="handlePointsProgramsSelection"
              />
            </v-col>

            <!-- Terceira linha: Cashback (centralizado) -->
            <v-col cols="12" md="6"  >
              <OfferProgramsAutocomplete
                v-model="selectedCashbackPrograms"
                program-type="cashback"
                :programs="allPrograms"
                :auto-fetch="false"
                @programs-selected="handleCashbackProgramsSelection"
              />
            </v-col>
          </v-row>

          <div v-if="hasActiveFilters" class="mt-6">
            <v-divider  />
          </div>
        </v-container>
      </v-card-text>

      <v-divider />

      <!-- Footer padronizado -->
      <v-card-actions class="pa-3 bg-grey-lighten-5">
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
  const allPrograms = ref<any[]>([])
  const isLoadingPrograms = ref(false)

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
  function handleEcommerceSelection(ecommerces: any[] | any | null) {
    // Garantir que sempre trabalhamos com um array
    const ecommercesArray = Array.isArray(ecommerces) ? ecommerces : (ecommerces ? [ecommerces] : [])
    
    selectedEcommerces.value = ecommercesArray
    localFilters.value.ecommerces = ecommercesArray.map(e => e.id)
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

  // Função para buscar todos os programas uma única vez
  const fetchPrograms = async () => {
    if (allPrograms.value.length > 0) return // Já carregou
    
    isLoadingPrograms.value = true
    
    try {
      const { data, error } = await useSanctumFetch('/api/programs', {
        method: 'GET',
      })

      if (data.value) {
        const programsData = data.value
        const programs: any[] = []

        // Combinar todos os tipos de programas em um array único
        if (programsData.cashback) {
          programs.push(...programsData.cashback.map((p: any) => ({ ...p, type: 'cashback' })))
        }
        if (programsData.points) {
          programs.push(...programsData.points.map((p: any) => ({ ...p, type: 'points' })))
        }
        if (programsData.miles) {
          programs.push(...programsData.miles.map((p: any) => ({ ...p, type: 'miles' })))
        }

        allPrograms.value = programs
      }

      if (error.value) {
        console.error('Erro ao carregar programas:', error.value)
      }
    } catch (err) {
      console.error('Erro ao buscar programas:', err)
    } finally {
      isLoadingPrograms.value = false
    }
  }

  // Watchers
   watch(
     () => props.modelValue,
     (isOpen) => {
       if (isOpen) {
         fetchPrograms() // Carrega programas quando o modal abre
       }
     }
   )

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
