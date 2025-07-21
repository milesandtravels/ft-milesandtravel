<template>
  <div>
    <!-- Programs Selection -->
    <v-autocomplete
      v-if="selectionType === 'specific'"
      v-model="selectedProgram"
      :items="filteredPrograms"
      item-title="name"
      item-value="id"
      :label="multiple ? 'Selecionar Programas' : 'Selecionar Programa'"
      variant="outlined"
      density="comfortable"
      prepend-inner-icon="mdi-star"
      clearable
      :multiple="multiple"
      :chips="multiple"
      :closable-chips="multiple"
      no-data-text="Nenhum programa encontrado"
      :loading="isLoadingPrograms"
      :error="errorLoadingPrograms"
      :error-messages="errorLoadingPrograms ? 'Erro ao carregar programas' : []"
      class="mb-3"
      @update:model-value="handleSelectionChange"
    >
      <template #item="{ props, item }">
        <v-list-item v-bind="props" :title="item.raw.name">
          <template #prepend>
            <div class="program-logo-container mr-3">
              <v-img
                :src="item.raw.logo_url"
                :alt="`Logo ${item.raw.name}`"
                contain
                height="32"
                max-width="48"
                class="program-logo"
              >
                <template #error>
                  <div class="logo-error-small">
                    <v-icon
                      :icon="getTypeIcon(item.raw.type)"
                      size="16"
                      color="grey"
                    ></v-icon>
                  </div>
                </template>
              </v-img>
            </div>
          </template>
          <template #subtitle>
            <v-chip
              size="x-small"
              variant="tonal"
              :color="getTypeColor(item.raw.type)"
            >
              {{ getTypeLabel(item.raw.type) }}
            </v-chip>
          </template>
        </v-list-item>
      </template>

      <template #selection="{ item }">
        <div class="d-flex align-center">
          <div class="program-logo-container-small mr-2">
            <v-img
              :src="item.raw.logo_url"
              :alt="`Logo ${item.raw.name}`"
              contain
              height="20"
              max-width="32"
              class="program-logo"
            >
              <template #error>
                <div class="logo-error-small">
                  <v-icon
                    :icon="getTypeIcon(item.raw.type)"
                    size="12"
                    color="grey"
                  ></v-icon>
                </div>
              </template>
            </v-img>
          </div>
          <span>{{ item.raw.name }}</span>
        </div>
      </template>

      <template #append-item>
        <div v-if="errorLoadingPrograms" class="pa-4 text-center">
          <v-btn
            variant="text"
            size="small"
            color="primary"
            prepend-icon="mdi-refresh"
            @click="fetchPrograms"
          >
            Tentar Novamente
          </v-btn>
        </div>
      </template>
    </v-autocomplete>

    <!-- Program Types Selection -->
    <v-select
      v-if="selectionType === 'type'"
      v-model="selectedProgramType"
      :items="programTypesOptions"
      item-title="name"
      item-value="id"
      :label="
        multiple
          ? 'Selecionar Tipos de Programa'
          : 'Selecionar Tipo de Programa'
      "
      variant="outlined"
      density="comfortable"
      prepend-inner-icon="mdi-shape"
      clearable
      :multiple="multiple"
      :chips="multiple"
      :closable-chips="multiple"
      no-data-text="Nenhum tipo encontrado"
      class="mb-3"
      @update:model-value="handleTypeSelectionChange"
    >
      <template #item="{ props, item }">
        <v-list-item v-bind="props" :title="item.raw.name">
          <template #prepend>
            <v-icon :color="item.raw.color" class="mr-3">{{
              item.raw.icon
            }}</v-icon>
          </template>
          <template #subtitle>
            <span class="text-caption">{{ item.raw.description }}</span>
          </template>
        </v-list-item>
      </template>
    </v-select>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, ref, watch } from 'vue'
  import type {
    Program,
    ProgramsResponseDTO,
    ProgramType,
  } from '~/interfaces/program'

  interface ProgramTypeOption {
    id: ProgramType
    name: string
    icon: string
    color: string
    description: string
  }

  interface Props {
    modelValue?: number | number[] | string | string[] | null
    autoFetch?: boolean
    searchId?: string | null
    multiple?: boolean
    selectionType?: 'specific' | 'type' // Nova prop para controlar o tipo de seleção
    filterByType?: ProgramType | null // Filtrar programas por tipo específico
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    autoFetch: true,
    searchId: null,
    multiple: false,
    selectionType: 'specific',
    filterByType: null,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: number | number[] | string | string[] | null]
    'program-selected': [program: Program | Program[] | null]
    'program-type-selected': [type: ProgramType | ProgramType[] | null]
  }>()

  // Reactive state
  const selectedProgram = ref<number | number[] | null>(
    props.selectionType === 'specific'
      ? (props.modelValue as number | number[] | null)
      : null
  )
  const selectedProgramType = ref<string | string[] | null>(
    props.selectionType === 'type'
      ? (props.modelValue as string | string[] | null)
      : null
  )

  const programOptions = ref<Program[]>([])
  const isLoadingPrograms = ref(false)
  const errorLoadingPrograms = ref(false)

  // Program types options
  const programTypesOptions = ref<ProgramTypeOption[]>([
    {
      id: 'cashback',
      name: 'Cashback',
      icon: 'mdi-cash',
      color: 'success',
      description: 'Receba dinheiro de volta nas suas compras',
    },
    {
      id: 'points',
      name: 'Pontos',
      icon: 'mdi-star',
      color: 'warning',
      description: 'Acumule pontos para trocar por produtos',
    },
    {
      id: 'miles',
      name: 'Milhas',
      icon: 'mdi-airplane',
      color: 'info',
      description: 'Ganhe milhas para viajar',
    },
  ])

  // Computed para filtrar programas por tipo se necessário
  const filteredPrograms = computed(() => {
    if (!props.filterByType) {
      return programOptions.value
    }
    return programOptions.value.filter(
      program => program.type === props.filterByType
    )
  })

  // Helper functions
  const getTypeIcon = (type: ProgramType): string => {
    const iconMap: Record<ProgramType, string> = {
      cashback: 'mdi-cash',
      points: 'mdi-star',
      miles: 'mdi-airplane',
    }
    return iconMap[type] || 'mdi-star'
  }

  const getTypeColor = (type: ProgramType): string => {
    const colorMap: Record<ProgramType, string> = {
      cashback: 'success',
      points: 'warning',
      miles: 'info',
    }
    return colorMap[type] || 'primary'
  }

  const getTypeLabel = (type: ProgramType): string => {
    const labelMap: Record<ProgramType, string> = {
      cashback: 'Cashback',
      points: 'Pontos',
      miles: 'Milhas',
    }
    return labelMap[type] || type
  }

  // Cache configuration
  const PROGRAMS_CACHE_KEY = 'programs-cache'
  const PROGRAMS_TIMESTAMP_KEY = 'programs-cache-timestamp'
  const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas em millisegundos

  // Cache storage using @vueuse/nuxt
  const cachedPrograms = useLocalStorage<Program[]>(PROGRAMS_CACHE_KEY, [])
  const cacheTimestamp = useLocalStorage<number>(PROGRAMS_TIMESTAMP_KEY, 0)

  // Verificar se o cache é válido (menos de 24 horas)
  const isCacheValid = (): boolean => {
    const now = Date.now()
    const timeDiff = now - cacheTimestamp.value
    return timeDiff < CACHE_DURATION && cachedPrograms.value.length > 0
  }

  // Carregar programas do cache ou da API
  const loadPrograms = () => {
    if (isCacheValid()) {
      // Usar dados do cache
      programOptions.value = cachedPrograms.value
      console.log('Programas carregados do cache localStorage')
    } else {
      // Buscar da API
      fetchPrograms()
    }
  }

  // Methods
  const fetchPrograms = async () => {
    isLoadingPrograms.value = true
    errorLoadingPrograms.value = false

    try {
      const url = `/api/programs`

      const { data, error } = await useSanctumFetch<ProgramsResponseDTO>(url, {
        method: 'GET',
      })

      if (data.value) {
        const allPrograms = [
          ...data.value.cashback,
          ...data.value.points,
          ...data.value.miles,
        ]

        // Atualizar estado local
        programOptions.value = allPrograms

        // Salvar no cache localStorage
        cachedPrograms.value = allPrograms
        cacheTimestamp.value = Date.now()

        console.log('Programas carregados da API e salvos no cache')
      }

      if (error.value) {
        throw new Error('Failed to fetch programs')
      }
    } catch (err) {
      console.error('Error fetching programs:', err)
      errorLoadingPrograms.value = true

      // Em caso de erro, tentar usar cache mesmo que expirado
      if (cachedPrograms.value.length > 0) {
        programOptions.value = cachedPrograms.value
        console.log('Usando cache expirado devido a erro na API')
      } else {
        programOptions.value = []
      }
    } finally {
      isLoadingPrograms.value = false
    }
  }

  const handleSelectionChange = (value: number | number[] | null) => {
    selectedProgram.value = value
    emit('update:modelValue', value)

    let selectedProgramData: Program | Program[] | null = null

    if (props.multiple && Array.isArray(value)) {
      selectedProgramData =
        value.length > 0
          ? filteredPrograms.value.filter(p => value.includes(p.id))
          : []
    } else if (!props.multiple && typeof value === 'number') {
      selectedProgramData =
        filteredPrograms.value.find(p => p.id === value) || null
    } else {
      selectedProgramData = props.multiple ? [] : null
    }

    emit('program-selected', selectedProgramData)
  }

  const handleTypeSelectionChange = (value: string | string[] | null) => {
    selectedProgramType.value = value
    emit('update:modelValue', value)

    let selectedTypeData: ProgramType | ProgramType[] | null = null

    if (props.multiple && Array.isArray(value)) {
      selectedTypeData = value.length > 0 ? (value as ProgramType[]) : []
    } else if (!props.multiple && typeof value === 'string') {
      selectedTypeData = value as ProgramType
    } else {
      selectedTypeData = props.multiple ? [] : null
    }

    emit('program-type-selected', selectedTypeData)
  }

  // Watchers
  watch(
    () => props.modelValue,
    newValue => {
      if (props.selectionType === 'specific') {
        selectedProgram.value = newValue as number | number[] | null
      } else {
        selectedProgramType.value = newValue as string | string[] | null
      }
    }
  )

  watch(
    () => [props.searchId, props.filterByType],
    () => {
      if (props.autoFetch && props.selectionType === 'specific') {
        loadPrograms()
      }
    }
  )

  watch(
    () => props.selectionType,
    () => {
      // Reset selections when changing type
      selectedProgram.value = null
      selectedProgramType.value = null
      emit('update:modelValue', null)
    }
  )

  // Lifecycle
  onMounted(async () => {
    await nextTick()

    if (props.autoFetch && props.selectionType === 'specific') {
      loadPrograms()
    }
  })

  // Expose methods and computed for parent component
  defineExpose({
    fetchPrograms,
    loadPrograms,
    selectedProgram,
    selectedProgramType,
    programOptions: filteredPrograms,
    programTypesOptions,
    allPrograms: programOptions,
  })
</script>

<style scoped>
  .program-logo-container {
    width: 48px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 8px;
    padding: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .program-logo-container-small {
    width: 32px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 6px;
    padding: 2px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .program-logo {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
  }

  .logo-error-small {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .v-theme--dark .program-logo-container,
  .v-theme--dark .program-logo-container-small {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
  }

  .v-theme--dark .logo-error-small {
    background: rgba(255, 255, 255, 0.05);
  }

  :deep(.v-field--outlined) {
    border-radius: 12px;
  }

  :deep(.v-field--outlined .v-field__outline) {
    --v-field-border-width: 1px;
  }

  :deep(.v-field--focused .v-field__outline) {
    --v-field-border-width: 2px;
  }
</style>
