<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    class="filter-modal"
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        variant="outlined"
        color="primary"
        size="large"
        prepend-icon="mdi-filter-variant"
        block
        class="mb-4"
      >
        Filtros
        <v-badge
          v-if="activeFiltersCount > 0"
          :content="activeFiltersCount"
          color="error"
          class="ms-2"
        />
      </v-btn>
    </template>

    <v-card class="filter-modal-card">
      <!-- Header -->
      <v-toolbar color="primary" dark flat class="filter-header">
        <v-btn icon="mdi-close" @click="closeModal" size="large" />

        <v-toolbar-title class="text-h6 font-weight-bold">
          Filtrar Produtos
        </v-toolbar-title>

        <v-spacer />

        <v-btn
          variant="text"
          @click="clearAllFilters"
          :disabled="activeFiltersCount === 0"
          class="text-caption"
        >
          Limpar
        </v-btn>
      </v-toolbar>

      <!-- Content -->
      <v-card-text class="filter-content pa-0">
        <v-container fluid class="pa-4">
          <!-- Ordenar por -->
          <div class="filter-section mb-6">
            <h3 class="filter-section-title mb-3">
              <v-icon class="me-2" color="primary">mdi-sort</v-icon>
              Ordenar por
            </h3>

            <v-radio-group
              v-model="selectedSort"
              class="sort-options"
              hide-details
            >
              <v-radio
                v-for="option in sortOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
                color="primary"
                class="sort-option"
              >
                <template #label>
                  <div class="d-flex align-center">
                    <v-icon
                      :icon="getSortIcon(option.value)"
                      size="20"
                      class="me-2"
                    />
                    <span class="text-body-1">{{ option.label }}</span>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </div>

          <v-divider class="mb-6" />

          <!-- E-commerces -->
          <div class="filter-section mb-6">
            <h3 class="filter-section-title mb-3">
              <v-icon class="me-2" color="primary">mdi-store</v-icon>
              E-commerces
            </h3>

            <v-select
              v-model="selectedEcommerces"
              :items="ecommerceOptions"
              item-title="label"
              item-value="value"
              label="Selecionar marketplaces"
              variant="outlined"
              multiple
              chips
              closable-chips
              hide-details
              class="ecommerce-select mb-3"
            >
              <template #prepend-item>
                <v-list-item
                  title="Selecionar todos"
                  @click="toggleAllEcommerces"
                  class="select-all-item"
                >
                  <template #prepend>
                    <v-checkbox-btn
                      :model-value="isAllEcommercesSelected"
                      :indeterminate="
                        isSomeEcommercesSelected && !isAllEcommercesSelected
                      "
                      color="primary"
                    />
                  </template>
                </v-list-item>
                <v-divider class="mt-2" />
              </template>

              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <template #prepend>
                    <v-checkbox-btn
                      :model-value="selectedEcommerces.includes(item.raw.value)"
                      color="primary"
                    />
                  </template>

                  <template #title>
                    <div class="d-flex align-center">
                      <v-avatar size="24" :color="item.raw.color" class="me-3">
                        <v-icon :icon="item.raw.icon" size="14" color="white" />
                      </v-avatar>
                      <span>{{ item.raw.label }}</span>
                    </div>
                  </template>

                  <template #append>
                    <v-chip
                      size="small"
                      :color="item.raw.color"
                      variant="tonal"
                    >
                      {{ item.raw.count }}
                    </v-chip>
                  </template>
                </v-list-item>
              </template>

              <template #chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :color="getEcommerceColor(item.raw.value)"
                  size="small"
                  variant="tonal"
                  class="ma-1"
                >
                  <v-icon
                    :icon="getEcommerceIcon(item.raw.value)"
                    size="16"
                    start
                  />
                  {{ item.raw.label }}
                </v-chip>
              </template>

              <template #selection="{ item, index }">
                <v-chip
                  v-if="index < 2"
                  :color="item.raw.color"
                  size="small"
                  variant="tonal"
                  closable
                  @click:close="removeEcommerce(item.raw.value)"
                  class="ma-1"
                >
                  <v-icon :icon="item.raw.icon" size="16" start />
                  {{ item.raw.label }}
                </v-chip>
                <span
                  v-else-if="index === 2"
                  class="text-grey text-caption align-self-center"
                >
                  (+{{ selectedEcommerces.length - 2 }} outros)
                </span>
              </template>
            </v-select>

            <!-- Selected Summary -->
            <div v-if="selectedEcommerces.length > 0" class="selected-summary">
              <v-chip-group class="selected-chips">
                <v-chip
                  v-for="ecommerce in selectedEcommercesDetails"
                  :key="ecommerce.value"
                  :color="ecommerce.color"
                  size="small"
                  variant="tonal"
                  closable
                  @click:close="removeEcommerce(ecommerce.value)"
                >
                  <v-icon :icon="ecommerce.icon" size="14" start />
                  {{ ecommerce.label }}
                </v-chip>
              </v-chip-group>
            </div>
          </div>
        </v-container>
      </v-card-text>

      <!-- Footer Actions -->
      <v-card-actions class="filter-actions pa-4">
        <v-row no-gutters class="w-100">
          <v-col cols="6" class="pe-2">
            <v-btn
              variant="outlined"
              color="grey"
              size="large"
              block
              @click="closeModal"
              class="text-body-2"
            >
              Cancelar
            </v-btn>
          </v-col>
          <v-col cols="6" class="ps-2">
            <v-btn
              color="primary"
              size="large"
              block
              @click="applyFilters"
              class="text-body-2 font-weight-bold"
            >
              Aplicar Filtros
              <v-badge
                v-if="activeFiltersCount > 0"
                :content="activeFiltersCount"
                color="white"
                text-color="primary"
                class="ms-2"
              />
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { computed, defineModel, ref } from 'vue'

  const emit = defineEmits(['apply-filters'])

  // Dialog state
 const dialog = defineModel()

  // Sort options
  const sortOptions = ref([
    {
      label: 'Relevância',
      value: 'id',
    },
    {
      label: 'Melhor preço',
      value: 'price',
    },
    {
      label: 'Mais avaliados',
      value: 'reviews',
    },
    {
      label: 'Melhores avaliados',
      value: 'rating',
    },
  ])

  // E-commerce options with fake data
  const ecommerceOptions = ref([
    {
      label: 'Amazon',
      value: 'amazon',
      icon: 'mdi-amazon',
      color: 'orange-darken-2',
      count: '2.3k',
    },
    {
      label: 'Mercado Livre',
      value: 'mercadolivre',
      icon: 'mdi-shopping',
      color: 'yellow-darken-2',
      count: '1.8k',
    },
    {
      label: 'Shopee',
      value: 'shopee',
      icon: 'mdi-store',
      color: 'orange-darken-1',
      count: '950',
    },
    {
      label: 'Magazine Luiza',
      value: 'magazineluiza',
      icon: 'mdi-store-outline',
      color: 'blue-darken-2',
      count: '1.2k',
    },
    {
      label: 'Americanas',
      value: 'americanas',
      icon: 'mdi-cart',
      color: 'red-darken-2',
      count: '840',
    },
    {
      label: 'Submarino',
      value: 'submarino',
      icon: 'mdi-submarine',
      color: 'blue-darken-3',
      count: '650',
    },
    {
      label: 'Casas Bahia',
      value: 'casasbahia',
      icon: 'mdi-home-city',
      color: 'yellow-darken-3',
      count: '720',
    },
    {
      label: 'AliExpress',
      value: 'aliexpress',
      icon: 'mdi-shopping-outline',
      color: 'red-darken-1',
      count: '3.1k',
    },
  ])
   const fetchEcommerces = async () => {
    searchForm.value

    isSearching.value = true
    isLoading.value = true

    const { data, error } = await useSanctumFetch(
      `/api/ecommerces`,
      {
        method: 'GET',
      }
    )

    if (data.value) {
      ecommerceOptions.value = data.value.data
    }

    if (error.value) {
      ecommerceOptions.value = []
    }
  }

  // Filter states
  const selectedSort = ref('relevance')
  const selectedEcommerces = ref([])
  const selectedRating = ref(null)

  // Computed
  const activeFiltersCount = computed(() => {
    let count = 0

    if (selectedSort.value !== 'relevance') count++
    if (selectedEcommerces.value.length > 0) count++
    if (selectedRating.value !== null) count++

    return count
  })

  const selectedEcommercesDetails = computed(() => {
    return ecommerceOptions.value.filter(ecommerce =>
      selectedEcommerces.value.includes(ecommerce.value)
    )
  })

  const isAllEcommercesSelected = computed(() => {
    return selectedEcommerces.value.length === ecommerceOptions.value.length
  })

  const isSomeEcommercesSelected = computed(() => {
    return (
      selectedEcommerces.value.length > 0 &&
      selectedEcommerces.value.length < ecommerceOptions.value.length
    )
  })

  // Methods
  const getSortIcon = value => {
    const icons = {
      relevance: 'mdi-star-outline',
      price_asc: 'mdi-arrow-up',
      price_desc: 'mdi-arrow-down',
      reviews_count: 'mdi-comment-multiple-outline',
      reviews_rating: 'mdi-star',
    }
    return icons[value] || 'mdi-sort'
  }

  const getEcommerceColor = value => {
    const ecommerce = ecommerceOptions.value.find(e => e.value === value)
    return ecommerce?.color || 'grey'
  }

  const getEcommerceIcon = value => {
    const ecommerce = ecommerceOptions.value.find(e => e.value === value)
    return ecommerce?.icon || 'mdi-store'
  }

  const toggleAllEcommerces = () => {
    if (isAllEcommercesSelected.value) {
      selectedEcommerces.value = []
    } else {
      selectedEcommerces.value = ecommerceOptions.value.map(e => e.value)
    }
  }

  const removeEcommerce = value => {
    const index = selectedEcommerces.value.indexOf(value)
    if (index > -1) {
      selectedEcommerces.value.splice(index, 1)
    }
  }

  const formatPrice = value => {
    return new Intl.NumberFormat('pt-BR').format(value)
  }

  const closeModal = () => {
    dialog.value = false
  }

  const clearAllFilters = () => {
    selectedSort.value = 'relevance'
    selectedEcommerces.value = []
    selectedRating.value = null
  }

  const applyFilters = () => {
    const filters = {
      sort: selectedSort.value,
      ecommerces: selectedEcommerces.value,
      rating: selectedRating.value,
    }

    emit('apply-filters', filters)
    closeModal()
  }

  onMounted(() => {
    fetchEcommerces()
  })
</script>

<style scoped>
  .filter-modal-card {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .filter-header {
    flex-shrink: 0;
  }

  .filter-content {
    flex: 1;
    overflow-y: auto;
  }

  .filter-section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #424242;
    display: flex;
    align-items: center;
  }

  .sort-options {
    background: #fafafa;
    border-radius: 12px;
    padding: 8px;
  }

  .sort-option {
    margin-bottom: 0;
    background: white;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 8px;
    transition: all 0.2s ease;
  }

  .sort-option:hover {
    background: #f5f5f5;
  }

  .sort-option:last-child {
    margin-bottom: 0;
  }

  .ecommerce-select {
    background: white;
  }

  .select-all-item {
    font-weight: 600;
    color: #1976d2;
  }

  .selected-summary {
    margin-top: 8px;
  }

  .selected-chips {
    margin: 0;
  }

  .selected-chips .v-chip {
    margin: 2px 4px 2px 0;
  }

  .price-inputs {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .price-input {
    flex: 1;
  }

  .price-separator {
    color: #757575;
    font-size: 0.875rem;
    white-space: nowrap;
  }

  .price-slider {
    margin-top: 16px;
  }

  .rating-options {
    display: flex;
    justify-content: center;
  }

  .rating-toggle {
    width: 100%;
  }

  .rating-btn {
    flex: 1;
    flex-direction: column;
    padding: 16px 8px;
    min-height: 80px;
  }

  .filter-actions {
    flex-shrink: 0;
    border-top: 1px solid #e0e0e0;
    background: #fafafa;
  }

  /* Mobile optimizations */
  @media (max-width: 600px) {
    .rating-toggle {
      flex-direction: column;
    }

    .rating-btn {
      width: 100%;
      margin-bottom: 8px;
      min-height: 60px;
    }
  }


  /* Custom scrollbar */
  .filter-content::-webkit-scrollbar {
    width: 4px;
  }

  .filter-content::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .filter-content::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
  }

  .filter-content::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
</style>
