<template>
  <v-container class="pa-6">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h1 class="text-h4 mb-2">Busca de Voos</h1>
        <p class="text-subtitle-1 text-medium-emphasis ma-0 d-none d-sm-block">
          Encontre as melhores ofertas de voos com milhas e pontos
        </p>
      </div>
    </div>

    <!-- Search Form -->
    <v-row class="mb-6">
      <v-col cols="12" lg="8">
        <v-card class="elevation-4 rounded-lg search-form-card" data-onboarding="flight-search">
          <v-card-title class="d-flex align-center pa-4 pb-2">
            <v-icon icon="mdi-airplane-takeoff" class="mr-2" color="primary"></v-icon>
            <span class="text-h6">Pesquisar Voos</span>
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-card-text class="pa-4">
            <v-form ref="searchForm" @submit.prevent="searchFlights">
              <v-row>
                <!-- Origin Airport -->
                <v-col cols="12" md="6">
                  <AirportAutocomplete
                    v-model="searchFilters.origin"
                    label="Origem"
                    icon="mdi-airplane-takeoff"
                    @airport-selected="onOriginSelected"
                  />
                </v-col>

                <!-- Destination Airport -->
                <v-col cols="12" md="6">
                  <AirportAutocomplete
                    v-model="searchFilters.destination"
                    label="Destino"
                    icon="mdi-airplane-landing"
                    @airport-selected="onDestinationSelected"
                  />
                </v-col>

                <!-- Departure Date -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="searchFilters.departure_date"
                    label="Data de Ida"
                    type="date"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-calendar"
                    :min="minDate"
                    required
                    class="mb-3"
                  />
                </v-col>

                <!-- Search Button -->
                <v-col cols="12" md="6" class="d-flex align-end">
                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    variant="flat"
                    prepend-icon="mdi-magnify"
                    :loading="isSearching"
                    :disabled="!canSearch"
                    class="text-none mb-3"
                    block
                  >
                    Pesquisar Voos
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Search History Sidebar -->
       <v-col cols="12" lg="4">
         <FlightSearchHistory ref="flightSearchHistoryRef" @search-selected="applyHistorySearch" />
       </v-col>
    </v-row>

    <!-- Search Results -->
    <div v-if="hasSearched">
      <!-- Results Header -->
      <div class="d-flex justify-space-between align-center mb-4">
        <div>
          <h2 class="text-h5 mb-1">Resultados da Busca</h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{ searchResults.length }} voo{{ searchResults.length !== 1 ? 's' : '' }} encontrado{{ searchResults.length !== 1 ? 's' : '' }}
            {{ searchFilters.origin && searchFilters.destination ? `de ${searchFilters.origin} para ${searchFilters.destination}` : '' }}
          </p>
        </div>
        
        <div class="d-flex align-center ga-2">
          <!-- Real-time indicator -->
          <v-chip
            v-if="isListeningToChannel"
            color="success"
            variant="tonal"
            size="small"
            prepend-icon="mdi-wifi"
          >
            Tempo Real
          </v-chip>
          
          <v-btn
            variant="outlined"
            size="small"
            prepend-icon="mdi-refresh"
            @click="searchFlights"
            :loading="isSearching"
            class="text-none"
          >
            Atualizar
          </v-btn>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isSearching" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
        <p class="text-body-1 text-medium-emphasis mt-4 mb-0">Buscando voos...</p>
      </div>

      <!-- Error State -->
      <v-card v-else-if="searchError" class="pa-6 text-center" color="error" variant="tonal">
        <v-icon icon="mdi-alert-circle" size="48" class="mb-3"></v-icon>
        <h3 class="text-h6 mb-2">Erro na Busca</h3>
        <p class="text-body-2 mb-4">{{ searchError }}</p>
        <v-btn
          variant="flat"
          color="error"
          prepend-icon="mdi-refresh"
          @click="searchFlights"
        >
          Tentar Novamente
        </v-btn>
      </v-card>

      <!-- Empty Results -->
      <v-card v-else-if="!searchResults.length" class="pa-6 text-center">
        <v-icon icon="mdi-airplane-off" size="48" color="grey" class="mb-3"></v-icon>
        <h3 class="text-h6 mb-2">Nenhum voo encontrado</h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Não encontramos voos para os critérios selecionados. Tente ajustar sua busca.
        </p>
        <v-btn
          variant="outlined"
          color="primary"
          prepend-icon="mdi-magnify"
          @click="clearSearch"
        >
          Nova Busca
        </v-btn>
      </v-card>

      <!-- Results List -->
      <div v-else>
        <FlightResultCard
          v-for="flight in searchResults"
          :key="flight.id"
          :flight="flight"
        />
      </div>
    </div>

    <!-- Initial State -->
    <div v-else class="text-center py-8">
      <v-icon icon="mdi-airplane-search" size="64" color="primary" class="mb-4"></v-icon>
      <h3 class="text-h5 mb-2">Encontre os Melhores Voos</h3>
      <p class="text-body-1 text-medium-emphasis mb-4 mx-auto" style="max-width: 500px;">
        Compare preços em milhas e pontos de diferentes programas de fidelidade.
        Preencha os campos acima para começar sua busca.
      </p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type {
    Airport,
    FlightSearchFilters,
    FlightSearchHistory,
    FlightSearchResponse,
    FlightSearchResult
} from '~/interfaces/flight-search'
import { useSnackbarStore } from '~/store/snackbar'

  // Page meta
  definePageMeta({
    middleware: ['sanctum:auth'],
  })

  useSeoMeta({
    title: 'Busca de Voos - Miles&Travels',
    ogTitle: 'Busca de Voos - Miles&Travels',
    description: 'Encontre as melhores ofertas de voos com milhas e pontos de diferentes programas de fidelidade.',
    ogDescription: 'Encontre as melhores ofertas de voos com milhas e pontos de diferentes programas de fidelidade.',
  })

  // Stores
  const snackbarStore = useSnackbarStore()
  const { $echo } = useNuxtApp()

  // Reactive state
  const searchForm = ref()
  const flightSearchHistoryRef = ref()
  const searchFilters = ref<FlightSearchFilters>({
    origin: '',
    destination: '',
    departure_date: '',
  })
  const searchResults = ref<FlightSearchResult[]>([])
  const isSearching = ref(false)
  const searchError = ref<string | null>(null)
  const hasSearched = ref(false)
  const selectedOriginAirport = ref<Airport | null>(null)
  const selectedDestinationAirport = ref<Airport | null>(null)
  const currentFlightSearchId = ref<number | null>(null)
  const isListeningToChannel = ref(false)

  // Computed
  const minDate = computed(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })

  const canSearch = computed(() => {
    return (
      searchFilters.value.origin &&
      searchFilters.value.destination &&
      searchFilters.value.departure_date
    )
  })

  // WebSocket Methods
  const startListeningToFlightUpdates = (flightSearchId: number) => {
    if (!$echo || isListeningToChannel.value) return

    currentFlightSearchId.value = flightSearchId
    isListeningToChannel.value = true

    const channelName = `flight_search.${flightSearchId}`
    
    $echo.channel(channelName)
      .listen('.flight.created', (event: any) => {
        console.log('FlightCreated event received:', event)
        
        try {
          // The event itself contains the flight data, not event.data
          let flightData: FlightSearchResult
          
          if (event.data) {
            // If event has a data property, use it
            flightData = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
          } else if (event.id && event.airline) {
            // If event is the flight data directly
            flightData = event
          } else {
            console.error('Invalid event structure:', event)
            return
          }
          
          // Add new flight to results if not already exists
          const existingFlight = searchResults.value.find(flight => flight.id === flightData.id)
          if (!existingFlight) {
            searchResults.value.push(flightData)
            snackbarStore.showInfo(`Novo voo encontrado: ${flightData.airline}`)
          }
        } catch (error) {
          console.error('Erro ao fazer parse do evento FlightCreated:', error, event)
        }
      })
      .listen('.flight.updated', (event: any) => {
        console.log('FlightUpdated event received:', event)
        
        try {
          // The event itself contains the flight data, not event.data
          let flightData: FlightSearchResult
          
          if (event.data) {
            // If event has a data property, use it
            flightData = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
          } else if (event.id && event.airline) {
            // If event is the flight data directly
            flightData = event
          } else {
            console.error('Invalid event structure:', event)
            return
          }
          
          // Update existing flight or add if not exists
          const flightIndex = searchResults.value.findIndex(flight => flight.id === flightData.id)
          if (flightIndex !== -1) {
            searchResults.value[flightIndex] = flightData
            snackbarStore.showInfo(`Voo atualizado: ${flightData.airline}`)
          } else {
            searchResults.value.push(flightData)
            snackbarStore.showInfo(`Novo voo encontrado: ${flightData.airline}`)
          }
        } catch (error) {
          console.error('Erro ao fazer parse do evento FlightUpdated:', error, event)
        }
      })

    console.log(`Listening to channel: ${channelName}`)
  }

  const stopListeningToFlightUpdates = () => {
    if (!$echo || !currentFlightSearchId.value || !isListeningToChannel.value) return

    const channelName = `flight_search.${currentFlightSearchId.value}`
    $echo.leaveChannel(channelName)
    
    currentFlightSearchId.value = null
    isListeningToChannel.value = false
    
    console.log(`Stopped listening to channel: ${channelName}`)
  }

  // Methods
  const searchFlights = async () => {
    if (!canSearch.value) {
      snackbarStore.showWarning('Preencha todos os campos para pesquisar')
      return
    }

    isSearching.value = true
    searchError.value = null

    try {
      const { data, error } = await useSanctumFetch<FlightSearchResponse>('/api/flight-searches', {
        query: {
          origin: searchFilters.value.origin,
          destination: searchFilters.value.destination,
          departure_date: searchFilters.value.departure_date,
        },
      })

      if (error.value) {
        throw error.value
      }

      if (data.value?.data) {
        const searchData = data.value.data
        searchResults.value = searchData.flights || []
        hasSearched.value = true
        
        if (searchResults.value.length > 0) {
          snackbarStore.showSuccess(
            `${searchResults.value.length} voo${searchResults.value.length !== 1 ? 's' : ''} encontrado${searchResults.value.length !== 1 ? 's' : ''}!`
          )
        }
        
        // Start listening to WebSocket updates using the search ID
        if (searchData.id) {
          // Stop previous listening if any
          stopListeningToFlightUpdates()
          // Start listening to new search
          startListeningToFlightUpdates(searchData.id)
        }
        
        // Update search history after successful search
        if (flightSearchHistoryRef.value?.fetchHistory) {
          flightSearchHistoryRef.value.fetchHistory()
        }
      }
    } catch (err: any) {
      console.error('Erro ao buscar voos:', err)
      searchError.value = err?.data?.message || 'Erro ao buscar voos. Tente novamente.'
      snackbarStore.showError('Erro ao buscar voos')
    } finally {
      isSearching.value = false
    }
  }

  const applyHistorySearch = (search: FlightSearchHistory) => {
    searchFilters.value = {
      origin: search.origin,
      destination: search.destination,
      departure_date: search.departure_date,
    }
    
    // Trigger search automatically
    searchFlights()
    
    snackbarStore.showInfo('Pesquisa aplicada do histórico')
  }

  const onOriginSelected = (airport: Airport | null) => {
    selectedOriginAirport.value = airport
  }

  const onDestinationSelected = (airport: Airport | null) => {
    selectedDestinationAirport.value = airport
  }

  const clearSearch = () => {
    // Stop WebSocket listening
    stopListeningToFlightUpdates()
    
    searchFilters.value = {
      origin: '',
      destination: '',
      departure_date: '',
    }
    searchResults.value = []
    hasSearched.value = false
    searchError.value = null
    selectedOriginAirport.value = null
    selectedDestinationAirport.value = null
  }

  // Initialize with today's date
  onMounted(() => {
    if (!searchFilters.value.departure_date) {
      const today = new Date()
      today.setDate(today.getDate() + 1) // Default to tomorrow
      searchFilters.value.departure_date = today.toISOString().split('T')[0]
    }
  })

  // Cleanup WebSocket connection on component unmount
  onBeforeUnmount(() => {
    stopListeningToFlightUpdates()
  })
</script>

<style scoped>
.search-form-card {
  transition: all 0.3s ease;
}

.search-form-card:hover {
  transform: translateY(-2px);
}

@media (max-width: 960px) {
  .pa-6 {
    padding: 1rem !important;
  }
}
</style>