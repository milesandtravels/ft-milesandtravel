<template>
  <v-autocomplete
    v-model="selectedAirport"
    :items="airportOptions"
    item-title="displayName"
    item-value="iataCode"
    :label="label"
    variant="outlined"
    density="comfortable"
    :prepend-inner-icon="icon"
    clearable
    no-data-text="Nenhum aeroporto encontrado"
    :loading="isLoading"
    :error="hasError"
    :error-messages="hasError ? 'Erro ao carregar aeroportos' : []"
    :search="searchTerm"
    @update:search="handleSearch"
    @update:model-value="handleSelectionChange"
    class="mb-3"
  >
    <template #item="{ props, item }">
      <v-list-item v-bind="props" :title="item.raw.displayName">
        <template #prepend>
          <v-avatar size="32" color="primary" class="mr-3">
            <span class="text-caption font-weight-bold text-white">
              {{ item.raw.iataCode }}
            </span>
          </v-avatar>
        </template>
        <template #subtitle>
          <span class="text-caption text-medium-emphasis">
            {{ item.raw.country }}
          </span>
        </template>
      </v-list-item>
    </template>

    <template #selection="{ item }">
      <div class="d-flex align-center">
        <v-avatar size="20" color="primary" class="mr-2">
          <span class="text-caption font-weight-bold text-white">
            {{ item.raw.iataCode }}
          </span>
        </v-avatar>
        <span>{{ item.raw.displayName }}</span>
      </div>
    </template>

    <template #append-item>
      <div v-if="hasError" class="pa-4 text-center">
        <v-btn
          variant="text"
          size="small"
          color="primary"
          prepend-icon="mdi-refresh"
          @click="retrySearch"
        >
          Tentar Novamente
        </v-btn>
      </div>
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import type { Airport, AirportSearchResponse } from '~/interfaces/flight-search'

  interface AirportOption extends Airport {
    displayName: string
  }

  interface Props {
    modelValue?: string | null
    label: string
    icon?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    icon: 'mdi-airplane',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string | null]
    'airport-selected': [airport: Airport | null]
  }>()

  // Reactive state
  const selectedAirport = ref<string | null>(props.modelValue)
  const airportOptions = ref<AirportOption[]>([])
  const isLoading = ref(false)
  const hasError = ref(false)
  const searchTerm = ref('')
  const searchTimeout = ref<NodeJS.Timeout | null>(null)

  // Computed
  const selectedAirportData = computed(() => {
    return airportOptions.value.find(airport => airport.iataCode === selectedAirport.value) || null
  })

  // Methods
  const searchAirports = async (query: string) => {
    if (!query || query.length < 2) {
      // Keep only selected airport when no search
      if (selectedAirport.value && selectedAirportData.value) {
        airportOptions.value = [selectedAirportData.value]
      } else {
        airportOptions.value = []
      }
      return
    }

    isLoading.value = true
    hasError.value = false

    try {
      const { data, error } = await useSanctumFetch<AirportSearchResponse>('/api/airports', {
        query: { search: query },
      })

      if (error.value) {
        throw error.value
      }

      if (data.value?.items) {
        // Filter only airports with iataCode
        const filteredAirports = data.value.items.filter(airport => airport.iataCode && airport.iataCode.trim() !== '')
        
        const searchResults = filteredAirports.map(airport => ({
          ...airport,
          displayName: `${airport.name} (${airport.iataCode})`,
        }))
        
        // Ensure selected airport is always in options
        if (selectedAirport.value && selectedAirportData.value) {
          const isSelectedInResults = searchResults.find(opt => opt.iataCode === selectedAirport.value)
          if (!isSelectedInResults) {
            airportOptions.value = [selectedAirportData.value, ...searchResults]
          } else {
            airportOptions.value = searchResults
          }
        } else {
          airportOptions.value = searchResults
        }
      }
    } catch (err) {
      console.error('Erro ao buscar aeroportos:', err)
      hasError.value = true
      // Keep selected airport even on error
      if (selectedAirport.value && selectedAirportData.value) {
        airportOptions.value = [selectedAirportData.value]
      } else {
        airportOptions.value = []
      }
    } finally {
      isLoading.value = false
    }
  }

  const handleSearch = (query: string) => {
    searchTerm.value = query
    
    // Clear previous timeout
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
    }

    // Debounce search
    searchTimeout.value = setTimeout(() => {
      searchAirports(query)
    }, 300)
  }

  const handleSelectionChange = (value: string | null) => {
    selectedAirport.value = value
    emit('update:modelValue', value)
    emit('airport-selected', selectedAirportData.value)
    
    // Keep selected airport in options if it exists
    if (value && selectedAirportData.value && !airportOptions.value.find(opt => opt.iataCode === value)) {
      airportOptions.value.unshift(selectedAirportData.value)
    }
  }

  const retrySearch = () => {
    if (searchTerm.value) {
      searchAirports(searchTerm.value)
    }
  }

  // Watch for external changes
  watch(
    () => props.modelValue,
    (newValue) => {
      selectedAirport.value = newValue
      // If we have a new value but no options, try to find it in current options
      if (newValue && airportOptions.value.length === 0) {
        // This will be handled by the computed selectedAirportData when options are available
      }
    }
  )

  // Initialize options with selected airport if available
  watch(
    selectedAirportData,
    (newAirportData) => {
      if (newAirportData && airportOptions.value.length === 0) {
        airportOptions.value = [newAirportData]
      }
    },
    { immediate: true }
  )
</script>

<style scoped>
.text-caption {
  font-size: 0.75rem !important;
}
</style>