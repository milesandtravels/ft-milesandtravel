<template>
  <div>
    <v-card class="elevation-4 rounded-lg mb-4 mb-md-6 mx-auto search-card">
      <v-card-title class="pa-4 pa-md-6 pb-2 pb-md-4">
        <h2 class="text-h6 font-weight-bold">Buscar Produtos</h2>
      </v-card-title>

      <v-card-text class="pa-4 pa-md-6 pt-2">
        <v-form @submit.prevent ref="searchForm">
          <v-text-field
            v-model="searchQuery"
            class="mb-3 mb-md-4"
            clearable
            density="comfortable"
            label="Digite o nome do produto..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            validate-on="blur"
            :rules="[v => !!v || 'Campo obrigatório']"
          />

          <div class="action-buttons">
            <v-btn
              block
              class="clear-btn"
              size="large"
              variant="outlined"
              @click="clearAll"
            >
              <v-icon left>mdi-refresh</v-icon>
              Limpar
            </v-btn>
            <v-btn
              block
              class="search-btn"
              color="primary"
              :loading="isSearching"
              size="large"
              type="submit"
              @click="handleSearch"
            >
              <v-icon left>mdi-magnify</v-icon>
              Buscar
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <template v-if="results.length > 0">
      <product-advanced-search-results
        :results="results"
        :searchId="searchId"
      />
    </template>
    <product-advanced-search-empty-results v-else-if="hasSearched" />
    <product-advanced-search-initial-state v-else />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
import type { Product } from '~/interfaces/products'

  import type { VForm } from 'vuetify/components'
import type { SearchRecord } from '~/interfaces/search'

  const searchId = ref<number>()
  const searchForm = ref<VForm | null>(null)
  const searchQuery = ref('')
  const results = ref<Product[]>([])
  const isLoading = ref(false)
  const isSearching = ref(false)
  const hasSearched = ref(false)

  const route = useRoute()
  const router = useRouter()

  onMounted(() => {
    initializeSearch()
  })

  const initializeSearch = async () => {
    // Verifica se há um searchId na URL
    const urlSearchId = route.query.searchId as string
    
    if (urlSearchId && !isNaN(Number(urlSearchId))) {
      // Se tem searchId na URL, usa ele
      searchId.value = Number(urlSearchId)
    } else {
      // Se não tem searchId na URL, gera um novo e adiciona na URL
      await fetchGenerateSearchId()
    }
  }

  const fetchGenerateSearchId = async () => {
    const { data, refresh } = await useSanctumFetch<SearchRecord>(
      `/api/searches/temporary-searches`,
      {
        method: 'POST',
      }
    )

    if (!data.value) {
      refresh()
      return
    }

    searchId.value = data.value?.data.id
    
    // Adiciona o searchId na URL
    if (searchId.value) {
      await router.push({
        query: {
          ...route.query,
          searchId: searchId.value.toString()
        }
      })
    }
  }

  const fetchProducts = async () => {
    searchForm.value

    isSearching.value = true
    isLoading.value = true

    const { data, error } = await useSanctumFetch(
      `/api/searches/${searchId.value}/automatic-products`,
      {
        method: 'GET',
        query: {
          search_term: searchQuery.value.trim().toLocaleLowerCase(),
        },
      }
    ).finally(() => {
      isSearching.value = false
      isLoading.value = false
    })

    if (data.value) {
      results.value = data.value.data
    }

    if (error.value) {
      results.value = []
    }

  }

  const handleSearch = async () => {
    const { valid } = await searchForm.value?.validate()

    if (!valid) {
      return // Para a execução se inválido
    }
    fetchProducts()
  }

  const clearAll = () => {
    searchQuery.value = ''
    results.value = []
    hasSearched.value = false
  }
</script>

<style scoped>
  .search-card {
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .action-buttons {
    display: grid;
    grid-template-columns: 150px 150px;
    gap: 12px;
    align-items: end;
    justify-content: end;
  }

  @media (max-width: 600px) {
    .action-buttons {
      grid-template-columns: 1fr;
      gap: 8px;
    }
  }

  .product-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  }

  .image-container {
    position: relative;
    overflow: hidden;
  }

  .product-image {
    transition: transform 0.3s ease;
  }

  .product-card:hover .product-image {
    transform: scale(1.05);
  }

  .marketplace-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 2;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .price-text {
    font-size: 0.9rem;
    line-height: 1.2;
  }

  @media (min-width: 768px) {
    .price-text {
      font-size: 1rem;
    }
  }

  .product-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
    min-height: 2.6em;
    max-height: 2.6em;
  }

  /* Responsive Typography */
  @media (max-width: 600px) {
    .product-title {
      font-size: 0.8rem;
      line-height: 1.2;
      min-height: 2.4em;
      max-height: 2.4em;
    }
  }

  /* Utilities */
  .text-white {
    color: white !important;
  }

  /* Grid responsive improvements */
  @media (max-width: 400px) {
    .v-col {
      padding: 2px !important;
    }

    .product-card .v-card-text {
      padding: 8px !important;
    }

    .marketplace-badge {
      top: 4px;
      left: 4px;
    }
  }

  /* Empty and Initial States */
  .empty-state,
  .initial-state {
    max-width: 400px;
    margin: 0 auto;
  }

  /* Dark theme enhancements */
  .v-theme--dark .search-card {
    background: rgba(30, 30, 30, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .v-theme--dark .product-card {
    background: rgba(40, 40, 40, 0.95);
  }

  /* Smooth animations */
  .v-col {
    animation: fadeInUp 0.4s ease-out backwards;
  }

  .v-col:nth-child(1) {
    animation-delay: 0.05s;
  }
  .v-col:nth-child(2) {
    animation-delay: 0.1s;
  }
  .v-col:nth-child(3) {
    animation-delay: 0.15s;
  }
  .v-col:nth-child(4) {
    animation-delay: 0.2s;
  }
  .v-col:nth-child(n + 5) {
    animation-delay: 0.25s;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Performance optimizations */
  .v-img {
    will-change: transform;
  }

  .product-card {
    contain: layout style paint;
  }
</style>