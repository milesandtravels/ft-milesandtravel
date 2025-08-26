<template>
  <v-container fluid class="pa-0">
    <!-- Header Component -->
    <BonusPurchaseResultsHeader
      :results-count="results.length"
      :selected-count="selectedProducts.length"
      :select-all="selectAll"
      :is-indeterminate="isIndeterminate"
      @select-all="handleSelectAll"
      @deselect-all="deselectAll"
      @open-filter="emit('open-filter')"
    />

    <!-- Products Grid -->
    <BonusPurchaseResultsGrid
      :products="results"
      :selected-products="selectedProducts"
      @toggle-selection="toggleSelection"
      @view-individual-offers="handleViewIndividualOffers"
    />

    <!-- Action Bar -->
    <BonusPurchaseResultsActionBar
      v-if="selectedProducts.length > 0"
      :selected-count="selectedProducts.length"
      :loading="loadingAdvantages"
      @deselect-all="deselectAll"
      @explore-advantages="exploreAdvantages"
    />
  </v-container>
</template>

<script lang="ts" setup>
  import { defineEmits, defineProps } from 'vue'
  import type { Product } from '~/interfaces/products'

  interface Props {
    results: Product[]
    searchId: string | number
  }

  interface Emits {
    (e: 'update:selectedProducts', value: number[]): void
    (e: 'open-filter'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // Estado reativo
  const selectedProducts = ref<number[]>([])
  const loadingAdvantages = ref<boolean>(false)

  // Computed properties
  const selectAll = computed({
    get: () =>
      selectedProducts.value.length === props.results.length &&
      props.results.length > 0,
    set: (value: boolean) => {
      selectedProducts.value = value
        ? props.results.map(product => product.id)
        : []
    },
  })

  const isIndeterminate = computed(() => {
    return (
      selectedProducts.value.length > 0 &&
      selectedProducts.value.length < props.results.length
    )
  })

  // Watchers
  watch(
    selectedProducts,
    newValue => emit('update:selectedProducts', newValue),
    { deep: true }
  )

  // Métodos
  const handleSelectAll = (value: boolean) => {
    selectedProducts.value = value
      ? props.results.map(product => product.id)
      : []
  }

  const deselectAll = () => {
    selectedProducts.value = []
  }

  const toggleSelection = (productId: number) => {
    const index = selectedProducts.value.indexOf(productId)
    if (index > -1) {
      selectedProducts.value.splice(index, 1)
    } else {
      selectedProducts.value.push(productId)
    }
  }

  const updateSearch = () => {
    return useSanctumFetch<any>(
      `/api/searches/${props.searchId}/update-and-sync-products`,
      {
        method: 'PUT',
        body: {
          name: 'custom-search',
          products: selectedProducts.value,
        },
      }
    )
  }

  // Nova função para visualizar ofertas de um produto específico
  const handleViewIndividualOffers = async (productId: number) => {
    loadingAdvantages.value = true
    try {
      // Cria uma busca apenas com o produto selecionado
      await useSanctumFetch<any>(
        `/api/searches/${props.searchId}/update-and-sync-products`,
        {
          method: 'PUT',
          body: {
            name: 'individual-product-search',
            products: [productId],
          },
        }
      )
      // Redireciona para tela de ofertas com apenas esse produto
      navigateTo(`/offers?searchId=${props.searchId}`)
    } catch (error) {
      console.error('Erro ao visualizar ofertas individuais:', error)
    } finally {
      loadingAdvantages.value = false
    }
  }

  // Função para comparar múltiplos produtos (fluxo original)
  const exploreAdvantages = async () => {
    if (selectedProducts.value.length === 0) return

    loadingAdvantages.value = true
    try {
      await updateSearch()
      navigateTo(`/offers?searchId=${props.searchId}`)
    } catch (error) {
      console.error('Erro ao explorar vantagens:', error)
    } finally {
      loadingAdvantages.value = false
    }
  }

  defineExpose({
    selectedProducts: readonly(selectedProducts),
  })
</script>
