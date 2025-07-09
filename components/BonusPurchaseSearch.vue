<template>
  <div>
    <v-card
      class="elevation-4 rounded-lg mb-4 mb-md-6 mx-auto search-card"
      data-onboarding="search-input"
    >
      <v-card-title class="pa-4 pa-md-6 pb-2 pb-md-4">
        <h2 class="text-h6 font-weight-bold">Buscar Produto(s)</h2>
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
      <BonusPurchaseResults
        :results="results"
        :searchId="searchId"
      />
    </template>
    <BonusPurchaseEmptyResults v-else-if="hasSearched" />
    <BonusPurchaseInitialState v-else />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
import type { VForm } from 'vuetify/components'
import type { Product } from '~/interfaces/products'
import type { SearchRecord } from '~/interfaces/search'
import { useLoadingStore } from '~/store/loading'

  const loadingStore = useLoadingStore()

  const searchId = ref<number>()
  const searchForm = ref<VForm | null>(null)
  const searchQuery = ref('')
  const results = ref<Product[]>([])
  const isSearching = ref(false)
  const hasSearched = ref(false)

  const route = useRoute()
  const router = useRouter()

  onMounted(() => {
    initializeSearch()
  })

  const initializeSearch = async () => {
    loadingStore.startLoading('Inicializando busca...', true)

    try {
      loadingStore.updateProgress(20)

      const urlSearchId = route.query.searchId as string

      loadingStore.updateProgress(40)

      if (urlSearchId && !isNaN(Number(urlSearchId))) {
        searchId.value = Number(urlSearchId)
        loadingStore.updateText('Carregando dados da busca...')
        loadingStore.updateProgress(60)

        await loadSearchTerm()
      } else {
        loadingStore.updateText('Gerando nova busca...')
        loadingStore.updateProgress(60)

        await fetchGenerateSearchId()
      }

      loadingStore.updateProgress(100)

      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (error) {
      console.error('Erro na inicialização:', error)
    } finally {
      loadingStore.stopLoading()
    }
  }

  const loadSearchTerm = async () => {
    if (!searchId.value) return

    try {
      loadingStore.updateProgress(70)

      const { data, error } = await useSanctumFetch<SearchRecord>(
        `/api/searches/${searchId.value}`,
        {
          method: 'GET',
        }
      )

      loadingStore.updateProgress(85)

      if (data.value && data.value.data) {
        const searchData = data.value.data

        if (searchData.search_term) {
          searchQuery.value = searchData.search_term
          hasSearched.value = true

          loadingStore.updateText('Buscando produtos...')
          loadingStore.updateProgress(90)

          await fetchProducts(false)
        }
      }

      if (error.value) {
        console.error('Erro ao carregar search term:', error.value)
      }
    } catch (err) {
      console.error('Erro ao carregar search term:', err)
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

    loadingStore.updateProgress(80)

    if (searchId.value) {
      await router.push({
        query: {
          ...route.query,
          searchId: searchId.value.toString(),
        },
      })
    }
  }

  const fetchProducts = async (showIndividualLoading = true) => {
    if (!searchQuery.value.trim()) return

    try {
      if (showIndividualLoading) {
        loadingStore.startLoading('Buscando produtos...')
      }

      isSearching.value = true

      const { data, error } = await useSanctumFetch(
        `/api/searches/${searchId.value}/automatic-products`,
        {
          method: 'POST',
          query: {
            search_term: searchQuery.value.trim().toLocaleLowerCase(),
          },
        }
      )

      if (data.value) {
        results.value = data.value.data
        hasSearched.value = true
      }

      if (error.value) {
        results.value = []
        hasSearched.value = true
      }
    } catch (error) {
      console.error('Erro ao Compras Bonificadas:', error)
      results.value = []
      hasSearched.value = true
    } finally {
      isSearching.value = false

      if (showIndividualLoading) {
        loadingStore.stopLoading()
      }
    }
  }

  const handleSearch = async () => {
    const { valid } = await searchForm.value?.validate()

    if (!valid) {
      return
    }

    await fetchProducts()
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

  .v-theme--dark .search-card {
    background: rgba(30, 30, 30, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
</style>
