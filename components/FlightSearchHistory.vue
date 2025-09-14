<template>
  <v-card class="flight-search-history" elevation="2" rounded="lg">
    <v-card-title class="d-flex align-center pa-4 pb-2">
      <v-icon icon="mdi-history" class="mr-2" color="primary"></v-icon>
      <span class="text-h6">Pesquisas Anteriores</span>
    </v-card-title>

    <v-divider></v-divider>

    <!-- Loading State -->
    <div v-if="isLoading" class="pa-4 text-center">
      <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
      <p class="text-body-2 text-medium-emphasis mt-2 mb-0">Carregando histórico...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="pa-4 text-center">
      <v-icon icon="mdi-alert-circle" color="error" size="32" class="mb-2"></v-icon>
      <p class="text-body-2 text-medium-emphasis mb-3">Erro ao carregar histórico</p>
      <v-btn
        variant="text"
        size="small"
        color="primary"
        prepend-icon="mdi-refresh"
        @click="fetchHistory"
      >
        Tentar Novamente
      </v-btn>
    </div>

    <!-- Empty State -->
    <div v-else-if="!searchHistory.length" class="pa-4 text-center">
      <v-icon icon="mdi-magnify-off" color="grey" size="48" class="mb-2"></v-icon>
      <p class="text-body-2 text-medium-emphasis mb-0">Nenhuma pesquisa anterior encontrada</p>
      <p class="text-caption text-medium-emphasis">Suas pesquisas aparecerão aqui</p>
    </div>

    <!-- History List -->
    <v-list v-else class="pa-0">
      <template v-for="(search, index) in searchHistory" :key="search.id">
        <v-list-item
          class="history-item pa-4"
          @click="selectSearch(search)"
        >
          <template #prepend>
            <v-avatar size="40" color="primary" variant="tonal">
              <v-icon icon="mdi-airplane-takeoff"></v-icon>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-medium mb-1">
            {{ search.origin }} → {{ search.destination }}
          </v-list-item-title>
          
          <v-list-item-subtitle class="d-flex flex-column flex-sm-row align-start align-sm-center">
            <span class="mr-sm-3 mb-1 mb-sm-0">
              <v-icon icon="mdi-calendar" size="14" class="mr-1"></v-icon>
              {{ formatDate(search.departure_date) }}
            </span>
            <span class="text-caption">
              <v-icon icon="mdi-clock-outline" size="14" class="mr-1"></v-icon>
              {{ formatSearchDate(search.created_at) }}
            </span>
          </v-list-item-subtitle>

          <template #append>
            <v-btn
              icon="mdi-chevron-right"
              variant="text"
              size="small"
              color="primary"
            ></v-btn>
          </template>
        </v-list-item>
        
        <v-divider v-if="index < searchHistory.length - 1"></v-divider>
      </template>
    </v-list>

    <!-- Show More Button -->
    <div v-if="searchHistory.length >= 5" class="pa-3 text-center">
      <v-btn
        variant="text"
        size="small"
        color="primary"
        prepend-icon="mdi-dots-horizontal"
        @click="loadMore"
        :loading="isLoadingMore"
      >
        Ver Mais
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import type { FlightSearchHistory, FlightSearchHistoryResponse } from '~/interfaces/flight-search'

  const emit = defineEmits<{
    'search-selected': [search: FlightSearchHistory]
  }>()

  // Reactive state
  const searchHistory = ref<FlightSearchHistory[]>([])
  const isLoading = ref(false)
  const isLoadingMore = ref(false)
  const hasError = ref(false)

  // Methods
  const fetchHistory = async () => {
    isLoading.value = true
    hasError.value = false

    try {
      const { data, error } = await useSanctumFetch<FlightSearchHistoryResponse>('/api/flight-search-user')

      if (error.value) {
        throw error.value
      }

      if (data.value?.data) {
        searchHistory.value = data.value.data
      }
    } catch (err) {
      console.error('Erro ao carregar histórico de pesquisas:', err)
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  const selectSearch = (search: FlightSearchHistory) => {
    emit('search-selected', search)
  }

  const loadMore = () => {
    // TODO: Implement pagination if needed
    console.log('Load more searches')
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatSearchDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'agora'
    } else if (diffInHours < 24) {
      return `há ${diffInHours}h`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) {
        return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`
      } else {
        return date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        })
      }
    }
  }

  // Expose fetchHistory method to parent
  defineExpose({
    fetchHistory,
  })

  // Lifecycle
  onMounted(() => {
    fetchHistory()
  })
</script>

<style scoped>
.history-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.history-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.flight-search-history {
  height: fit-content;
  max-height: 600px;
  overflow-y: auto;
}

@media (max-width: 960px) {
  .flight-search-history {
    max-height: 400px;
  }
}
</style>