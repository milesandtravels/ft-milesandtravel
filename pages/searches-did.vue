<template>
  <v-container fluid class="searches-page">
    <!-- Header da página -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap mb-4">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">Minhas Buscas</h1>
            <p class="text-body-1 text-medium-emphasis">
              Acesse rapidamente suas pesquisas anteriores e continue de onde
              parou
            </p>
          </div>

          <!-- Botão para nova busca -->
          <v-btn
            color="primary"
            size="large"
            prepend-icon="mdi-magnify"
            @click="navigateToNewSearch"
            class="mt-4 mt-md-0"
          >
            Nova Busca
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <v-progress-circular indeterminate color="primary" size="48" />
      <p class="mt-4 text-center">Carregando suas buscas...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="!searches.length" class="empty-state">
      <v-icon
        icon="mdi-magnify-scan"
        size="80"
        color="grey-lighten-1"
        class="mb-4"
      />
      <h3 class="text-h5 font-weight-medium mb-2">Nenhuma busca encontrada</h3>
      <p class="text-body-1 text-medium-emphasis mb-6">
        Você ainda não realizou nenhuma busca. Comece agora e encontre os
        melhores produtos com cashback!
      </p>
      <v-btn
        color="primary"
        size="large"
        prepend-icon="mdi-magnify"
        @click="navigateToNewSearch"
      >
        Fazer Primeira Busca
      </v-btn>
    </div>

    <!-- Grid de buscas -->
    <v-row v-else class="searches-grid">
      <v-col
        v-for="search in searches"
        :key="search.id"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
      >
        <SearchCard
          :search="search"
          @continue-search="handleContinueSearch"
          @view-offers="handleViewOffers"
        />
      </v-col>
    </v-row>

    <!-- Paginação -->
    <div v-if="searches.length > 0" class="pagination-container mt-6">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="isMobile ? 5 : 7"
        @update:model-value="loadSearches"
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import type { SearchRecord } from '~/interfaces/search'
  import { useSnackbarStore } from '~/store/snackbar'

  // Meta da página
  definePageMeta({
    middleware: ['sanctum:auth'],
  })

  useSeoMeta({
    title: 'Minhas Buscas - Miles&Travels',
    ogTitle: 'Minhas Buscas - Miles&Travels',
    description: 'Acesse suas buscas anteriores e continue de onde parou',
    ogDescription: 'Acesse suas buscas anteriores e continue de onde parou',
  })

  // Stores
  const snackbarStore = useSnackbarStore()

  // Estados reativos
  const loading = ref(true)
  const searches = ref<SearchRecord[]>([])
  const currentPage = ref(1)
  const totalPages = ref(1)

  // Computed
  const isMobile = computed(() => {
    if (process.client) {
      return window.innerWidth < 768
    }
    return false
  })

  // Métodos
  const loadSearches = async (page = 1) => {
    try {
      loading.value = true

      const { data, error } = await useSanctumFetch<{
        data: SearchRecord[]
        links: {
          first: string | null
          last: string | null
          prev: string | null
          next: string | null
        }
        meta: {
          current_page: number
          from: number | null
          last_page: number
          links: Array<{
            url: string | null
            label: string
            active: boolean
          }>
          path: string
          per_page: number
          to: number | null
          total: number
        }
      }>(`/api/searches/independent-searches?page=${page}`)

      if (data.value) {
        searches.value = data.value.data
        currentPage.value = data.value.meta.current_page
        totalPages.value = data.value.meta.last_page
      }

      if (error.value) {
        snackbarStore.showError('Erro ao carregar buscas. Tente novamente.')
      }
    } catch (err) {
      snackbarStore.showError('Erro inesperado ao carregar buscas.')
    } finally {
      loading.value = false
    }
  }

  const handleContinueSearch = (searchId: number) => {
    navigateTo(`/search-products?searchId=${searchId}`)
  }

  const handleViewOffers = (searchId: number) => {
    navigateTo(`/offers?searchId=${searchId}`)
  }

  const navigateToNewSearch = () => {
    navigateTo('/search-products')
  }

  // Lifecycle
  onMounted(() => {
    loadSearches()
  })
</script>

<style scoped>
  .searches-page {
    min-height: 100vh;
    background-color: rgb(var(--v-theme-surface));
    padding: 24px;
  }

  .searches-grid {
    margin-top: 0;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 80px 20px;
    min-height: 400px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 80px 20px;
    text-align: center;
    min-height: 400px;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }

  /* Responsividade */
  @media (max-width: 960px) {
    .searches-page {
      padding: 16px;
    }
  }

  @media (max-width: 600px) {
    .searches-page {
      padding: 12px;
    }

    .d-flex.justify-space-between {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .loading-container,
    .empty-state {
      padding: 40px 16px;
      min-height: 300px;
    }
  }

  /* Performance optimizations */
  .searches-page {
    will-change: scroll-position;
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
    }
  }
</style>
