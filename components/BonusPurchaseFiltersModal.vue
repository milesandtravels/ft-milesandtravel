<template>
  <v-dialog 
    v-model="localDialog" 
    :max-width="$vuetify.display.mobile ? undefined : '800px'"
    :fullscreen="$vuetify.display.mobile"
    :transition="$vuetify.display.mobile ? 'dialog-bottom-transition' : 'dialog-transition'"
    persistent 
    scrollable
  >
    <v-card>
      <!-- Header padronizado -->
      <ModalHeader title="Filtros de Busca" @close="closeModal" />

      <v-divider />

      <v-card-text class="pa-4 pa-md-6" style="max-height: 70vh">
        <v-container class="pa-0">
          <v-row class="gy-2">
            <v-col
              v-for="filter in availableFilters"
              :key="filter.type"
              cols="12"
              md="6"
            >
              <!-- Checkbox para múltiplas seleções -->
              <div v-if="filter.input_type === 'checkbox'">
                <v-autocomplete
                  v-model="selectedFilters[filter.type]"
                  :label="filter.type"
                  :items="filter.options"
                  item-title="text"
                  item-value="text"
                  density="comfortable"
                  variant="outlined"
                  multiple
                  clearable
                  single-line
                  chips
                  closable-chips
                />
              </div>

              <!-- Select para price_range -->
              <div v-else-if="filter.input_type === 'price_range'">
                <v-select
                  v-model="selectedFilters[filter.type]"
                  :label="filter.type"
                  :items="filter.options"
                  item-title="text"
                  item-value="text"
                  density="comfortable"
                  variant="outlined"
                  clearable
                  single-line
                />
              </div>

              <!-- Select para link -->
              <div v-else-if="filter.input_type === 'link'">
                <v-select
                  v-model="selectedFilters[filter.type]"
                  :label="filter.type"
                  :items="filter.options"
                  item-title="text"
                  item-value="text"
                  density="comfortable"
                  variant="outlined"
                  clearable
                  single-line
                />
              </div>

              <!-- Select padrão para outros tipos -->
              <div v-else>
                <v-select
                  v-model="selectedFilters[filter.type]"
                  :label="filter.type"
                  :items="filter.options"
                  item-title="text"
                  item-value="text"
                  density="comfortable"
                  variant="outlined"
                  clearable
                  single-line
                />
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider />

      <!-- Footer padronizado -->
      <v-card-actions class="pa-4 pa-md-6 bg-grey-lighten-5">
        <v-btn 
          variant="outlined" 
          color="grey"
          @click="clearAllFilters"
          prepend-icon="mdi-refresh"
        >
          Limpar Todos
        </v-btn>

        <v-spacer />

        <v-btn 
          variant="outlined" 
          @click="closeModal"
          class="me-2"
        >
          Cancelar
        </v-btn>

        <v-btn 
          color="primary" 
          variant="flat"
          :loading="isApplying" 
          @click="applyFilters"
          prepend-icon="mdi-check"
        >
          Aplicar Filtros
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import type { VForm } from 'vuetify/components'

  interface FilterOption {
    text: string
  }

  interface Filter {
    type: string
    input_type: string
    options: FilterOption[]
  }

  interface Props {
    modelValue: boolean
    filters: Filter[]
    searchId: number | undefined
    searchTerm: string
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'filtersApplied', results: any[]): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const filtersForm = ref<VForm | null>(null)
  const selectedFilters = ref<Record<string, any>>({})
  const isApplying = ref(false)

  // Computed para controlar o estado da modal
  const localDialog = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value),
  })

  // Filtros disponíveis (removendo link_with_icon)
  const availableFilters = computed(() => {
    return props.filters.filter(
      filter => filter.input_type !== 'link_with_icon'
    )
  })

  // Inicializar os filtros selecionados
  const initializeFilters = () => {
    const filters: Record<string, any> = {}

    availableFilters.value.forEach(filter => {
      if (filter.input_type === 'checkbox') {
        filters[filter.type] = []
      } else {
        filters[filter.type] = null
      }
    })

    selectedFilters.value = filters
  }

  // Observar mudanças nos filtros disponíveis
  watch(
    () => props.filters,
    () => {
      initializeFilters()
    },
    { immediate: true }
  )

  // Limpar todos os filtros
  const clearAllFilters = () => {
    initializeFilters()
  }

  // Fechar modal
  const closeModal = () => {
    emit('update:modelValue', false)
  }

  // Aplicar filtros
  const applyFilters = async () => {
    if (!props.searchId || !props.searchTerm) {
      console.error('SearchId ou searchTerm não disponível')
      return
    }

    try {
      isApplying.value = true

      // Construir payload com filtros ativos
      const activeFilters: Array<{ type: string; options: string[] }> = []

      Object.entries(selectedFilters.value).forEach(([type, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value) && value.length > 0) {
            // Para checkboxes (múltiplas seleções)
            activeFilters.push({
              type,
              options: value,
            })
          } else if (!Array.isArray(value) && value !== '') {
            // Para selects únicos
            activeFilters.push({
              type,
              options: [value],
            })
          }
        }
      })

      const payload = {
        active_filters: activeFilters,
      }
      // Fazer chamada para API
      const { data, error } = await useSanctumFetch(
        `/api/searches/${props.searchId}/automatic-products`,
        {
          method: 'POST',
          query: {
            search_term: props.searchTerm.trim().toLowerCase(),
          },
          body: payload,
        }
      )

      if (data.value) {
        // Emitir os novos resultados
        emit('filtersApplied', data.value.data)

        // Fechar modal
        closeModal()

        console.log(
          'Filtros aplicados com sucesso. Novos resultados:',
          data.value.data
        )
      }

      if (error.value) {
        console.error('Erro ao aplicar filtros:', error.value)
      }
    } catch (err) {
      console.error('Erro ao aplicar filtros:', err)
    } finally {
      isApplying.value = false
    }
  }
</script>

<style scoped>
  .v-checkbox :deep(.v-selection-control) {
    min-height: 32px;
  }

  .v-checkbox :deep(.v-label) {
    font-size: 0.875rem;
  }
</style>
