<template>
  <div>
    <v-autocomplete
      v-model="selectedPrograms"
      :items="programOptions"
      item-title="name"
      item-value="id"
      :label="`Selecionar ${getProgramTypeLabel(programType)}`"
      variant="outlined"
      density="comfortable"
      :prepend-inner-icon="getProgramTypeIcon(programType)"
      multiple
      chips
      closable-chips
      clearable
      no-data-text="Nenhum programa encontrado"
      :loading="isLoadingPrograms"
      :error="errorLoadingPrograms"
      :error-messages="errorLoadingPrograms ? 'Erro ao carregar programas' : []"
      class="mb-3"
      @update:model-value="handleSelectionChange"
    >
      <template #chip="{ props, item }">
        <v-chip
          v-bind="props"
          size="small"
          :color="getProgramTypeColor(programType)"
          variant="outlined"
        >
          <v-avatar start>
            <v-img
              :src="item.raw.logo_url"
              :alt="`Logo ${item.raw.name}`"
              cover
            >
              <template #error>
                <v-icon
                  :icon="getProgramTypeIcon(programType)"
                  size="16"
                  color="grey"
                ></v-icon>
              </template>
            </v-img>
          </v-avatar>
          {{ item.raw.name }}
        </v-chip>
      </template>

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
                  <div class="logo-error">
                    <v-icon
                      :icon="getProgramTypeIcon(programType)"
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
              :color="getProgramTypeColor(programType)"
            >
              {{ getProgramTypeLabel(programType) }}
            </v-chip>
          </template>
        </v-list-item>
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
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, computed } from 'vue'

  type ProgramType = 'cashback' | 'miles' | 'points'

  interface Program {
    id: number
    name: string
    logo_url: string
    type?: ProgramType
  }

  interface Props {
    modelValue?: number[]
    programType: ProgramType
    autoFetch?: boolean
    programs?: Program[]
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    autoFetch: true,
    programs: undefined,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: number[]]
    'programs-selected': [programs: Program[]]
  }>()

  // Reactive state
  const selectedPrograms = ref<number[]>(props.modelValue)
  const programOptions = ref<Program[]>([])
  const isLoadingPrograms = ref(false)
  const errorLoadingPrograms = ref(false)

  // Computed
  const apiEndpoint = computed(() => {
    return '/api/programs'
  })

  // Methods
  const getProgramTypeIcon = (type: ProgramType): string => {
    const icons = {
      cashback: 'mdi-cash',
      points: 'mdi-star',
      miles: 'mdi-airplane',
    }
    return icons[type] || 'mdi-gift'
  }

  const getProgramTypeColor = (type: ProgramType): string => {
    const colors = {
      cashback: 'green',
      points: 'blue',
      miles: 'purple',
    }
    return colors[type] || 'primary'
  }

  const getProgramTypeLabel = (type: ProgramType): string => {
    const labels = {
      cashback: 'Programas de Cashback',
      points: 'Programas de Pontos',
      miles: 'Programas de Milhas',
    }
    return labels[type] || type
  }

  const fetchPrograms = async () => {
    isLoadingPrograms.value = true
    errorLoadingPrograms.value = false

    try {
      const { data, error } = await useSanctumFetch(apiEndpoint.value, {
        method: 'GET',
      })

      if (data.value) {
        // A API retorna um objeto com arrays separados por tipo
        const programsData = data.value
        let programs: Program[] = []

        if (props.programType === 'cashback' && programsData.cashback) {
          programs = programsData.cashback.map((p: Program) => ({
            ...p,
            type: 'cashback',
          }))
        } else if (props.programType === 'points' && programsData.points) {
          programs = programsData.points.map((p: Program) => ({
            ...p,
            type: 'points',
          }))
        } else if (props.programType === 'miles' && programsData.miles) {
          programs = programsData.miles.map((p: Program) => ({
            ...p,
            type: 'miles',
          }))
        }

        programOptions.value = programs
      }

      if (error.value) {
        throw new Error('Failed to fetch programs')
      }
    } catch (err) {
      console.error('Error fetching programs:', err)
      errorLoadingPrograms.value = true
      programOptions.value = []
    } finally {
      isLoadingPrograms.value = false
    }
  }

  const handleSelectionChange = (value: number[]) => {
    selectedPrograms.value = value
    emit('update:modelValue', value)

    const selectedProgramsData = value
      .map(id => programOptions.value.find(p => p.id === id))
      .filter(Boolean) as Program[]

    emit('programs-selected', selectedProgramsData)
  }

  // Watchers
  watch(
    () => props.modelValue,
    newValue => {
      selectedPrograms.value = newValue
    }
  )

  watch(
    () => props.programType,
    () => {
      if (props.autoFetch) {
        fetchPrograms()
      }
    }
  )

  // Watchers para programs prop
  watch(
    () => props.programs,
    newPrograms => {
      if (newPrograms) {
        // Filtrar programas pelo tipo
        const filteredPrograms = newPrograms.filter(
          p => p.type === props.programType
        )
        programOptions.value = filteredPrograms
      }
    },
    { immediate: true }
  )

  // Lifecycle
  onMounted(() => {
    // Só faz fetch se não tiver programs prop e autoFetch estiver habilitado
    if (
      !props.programs &&
      props.autoFetch &&
      programOptions.value.length === 0
    ) {
      fetchPrograms()
    }
  })

  // Expose methods for parent component
  defineExpose({
    fetchPrograms,
    selectedPrograms,
    programOptions,
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

  .v-theme--dark .program-logo-container {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
  }

  .v-theme--dark .logo-error {
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
