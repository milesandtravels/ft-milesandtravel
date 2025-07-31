<template>
  <v-card class="search-card" elevation="2">
    <v-card-title class="pa-4 pb-2">
      <div class="d-flex align-center">
        <v-icon icon="mdi-magnify" color="primary" size="20" class="mr-2" />
        <span class="text-body-1 font-weight-medium search-title">
          {{ searchTitle }}
        </span>
      </div>
    </v-card-title>

    <v-card-text class="pa-4 pt-0">
      <div v-if="search.search_term" class="mb-3">
        <v-chip color="primary" variant="tonal" size="small" prepend-icon="mdi-tag-outline">
          {{ search.search_term }}
        </v-chip>
      </div>

      <div class="d-flex align-center mb-3">
        <v-icon icon="mdi-calendar-outline" size="16" color="medium-emphasis" class="mr-2" />
        <span class="text-caption text-medium-emphasis">
          {{ formatDate(search.created_at) }}
        </span>
      </div>
    </v-card-text>

    <v-card-actions class="pa-4 pt-0">
      <div class="actions-container">
        <v-btn 
          color="primary" 
          variant="outlined" 
           size="small" 
          prepend-icon="mdi-magnify" 
          @click="$emit('continue-search', search.id)"
          class="action-btn"
        >
          Continuar Busca
        </v-btn>
        <v-btn 
          color="primary" 
          variant="elevated" 
          size="small" 
          prepend-icon="mdi-eye" 
          @click="$emit('view-offers', search.id)"
          class="action-btn"
        >
          Ver Ofertas
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface SearchData {
  id: number
  name: string | null
  active_filters: any | null
  filters: string
  search_term: string | null
  created_at: string
  updated_at: string
}

interface Props {
  search: SearchData
}

const props = defineProps<Props>()

defineEmits<{
  'continue-search': [searchId: number]
  'view-offers': [searchId: number]
}>()

const searchTitle = computed(() => {
  if (props.search.name) return props.search.name
  if (props.search.search_term) return `Busca: ${props.search.search_term}`
  return `Busca #${props.search.id}`
})

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Hoje'
  if (diffInDays === 1) return 'Ontem'
  if (diffInDays < 7) return `${diffInDays} dias atrás`
  
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>

<style scoped>
.search-card {
  border-radius: 12px !important;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
}

.search-title {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.actions-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.action-btn {
  width: 100%;
  height: 35px;

}

@media (max-width: 600px) {
  .search-card {
    border-radius: 8px !important;
  }
  

}
</style>