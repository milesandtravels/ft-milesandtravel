<template>
  <v-card class="flight-result-card mb-4" elevation="2" rounded="lg">
    <v-card-text class="pa-4">
      <div class="d-flex flex-column flex-md-row align-start align-md-center justify-space-between">
        <!-- Flight Info Section -->
        <div class="flight-info flex-grow-1 mb-3 mb-md-0">
          <div class="d-flex align-center mb-2">
            <!-- Program Logo -->
            <v-avatar size="32" class="mr-3">
              <v-img
                :src="flight.program.logo_url"
                :alt="`Logo ${flight.program.name}`"
                contain
              >
                <template #error>
                  <v-icon icon="mdi-airplane" color="primary"></v-icon>
                </template>
              </v-img>
            </v-avatar>
            
            <!-- Airline Name -->
            <div>
              <h3 class="text-h6 font-weight-bold mb-0">{{ flight.airline }}</h3>
              <p class="text-caption text-medium-emphasis mb-0">{{ flight.program.name }}</p>
            </div>
          </div>

          <!-- Flight Times -->
          <div class="d-flex align-center mb-2">
            <div class="text-center mr-4">
              <p class="text-h6 font-weight-bold mb-0">{{ formatTime(flight.departure_datetime) }}</p>
              <p class="text-caption text-medium-emphasis mb-0">Partida</p>
            </div>
            
            <div class="flight-duration-indicator flex-grow-1 mx-3">
              <div class="d-flex align-center justify-center position-relative">
                <v-divider class="flex-grow-1"></v-divider>
                <v-icon 
                  :icon="flight.stops === 0 ? 'mdi-airplane' : 'mdi-transit-connection-variant'"
                  size="20"
                  color="primary"
                  class="mx-2 bg-white pa-1 rounded-circle"
                ></v-icon>
                <v-divider class="flex-grow-1"></v-divider>
              </div>
              <p class="text-center text-caption text-medium-emphasis mt-1 mb-0">
                {{ stopsText }}
              </p>
            </div>
            
            <div class="text-center ml-4">
              <p class="text-h6 font-weight-bold mb-0">{{ formatTime(flight.arrival_datetime) }}</p>
              <p class="text-caption text-medium-emphasis mb-0">Chegada</p>
            </div>
          </div>
        </div>

        <!-- Price and Action Section -->
        <div class="price-action-section text-center text-md-right">
          <div class="mb-3">
            <p class="text-h5 font-weight-bold text-primary mb-1">
              {{ formatPrice(flight.price) }}
              <span class="text-caption text-medium-emphasis">{{ flight.program.type === 'miles' ? 'milhas' : 'pontos' }}</span>
            </p>
            <p class="text-caption text-medium-emphasis mb-0">
              Atualizado {{ formatDate(flight.updated_at) }}
            </p>
          </div>
          
          <v-btn
            color="primary"
            variant="flat"
            size="large"
            :href="flight.program.link_url"
            target="_blank"
            rel="noopener noreferrer"
            prepend-icon="mdi-open-in-new"
            class="text-none"
          >
            Ver Oferta
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { FlightSearchResult } from '~/interfaces/flight-search'

  interface Props {
    flight: FlightSearchResult
  }

  const props = defineProps<Props>()

  // Computed
  const stopsText = computed(() => {
    if (props.flight.stops === 0) {
      return 'Direto'
    }
    return `${props.flight.stops} parada${props.flight.stops > 1 ? 's' : ''}`
  })

  // Methods
  const formatTime = (time: string): string => {
    return time.substring(0, 5) // Remove seconds from HH:MM:SS
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR').format(price)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'agora'
    } else if (diffInHours < 24) {
      return `há ${diffInHours}h`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`
    }
  }
</script>

<style scoped>
.flight-result-card {
  transition: all 0.3s ease;
}

.flight-result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.flight-duration-indicator {
  min-width: 120px;
}

.price-action-section {
  min-width: 200px;
}

@media (max-width: 960px) {
  .flight-info {
    width: 100%;
  }
  
  .price-action-section {
    width: 100%;
    min-width: unset;
  }
}
</style>