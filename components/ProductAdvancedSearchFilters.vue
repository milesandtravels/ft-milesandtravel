<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.display.mobile"
    :max-width="$vuetify.display.mobile ? undefined : 600"
    hide-overlay
    transition="dialog-bottom-transition"
    class="filter-modal"
    scrollable
  >
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

            <!-- Loading State -->
            <div v-if="isLoadingEcommerces" class="text-center py-4">
              <v-progress-circular
                indeterminate
                color="primary"
                size="32"
              ></v-progress-circular>
              <p class="text-body-2 mt-2">Carregando e-commerces...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="errorLoadingEcommerces" class="text-center py-4">
              <v-icon color="error" size="48" class="mb-2"
                >mdi-alert-circle</v-icon
              >
              <p class="text-body-2 mb-3">Erro ao carregar e-commerces</p>
              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                @click="fetchEcommerces"
              >
                Tentar novamente
              </v-btn>
            </div>

            <!-- E-commerces Select -->
            <div v-else>
              <v-select
                v-model="selectedEcommerces"
                :items="ecommerceOptions"
                item-title="name"
                item-value="id"
                label="Selecionar marketplaces"
                variant="outlined"
                multiple
                chips
                closable-chips
                hide-details
                class="ecommerce-select mb-3"
                :disabled="ecommerceOptions.length === 0"
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
                        :model-value="selectedEcommerces.includes(item.raw.id)"
                        color="primary"
                      />
                    </template>

                    <template #title>
                      <div class="d-flex align-center">
                        <v-avatar v-if="item.raw.logo" size="24" class="me-3">
                          <v-img :src="item.raw.logo" :alt="item.raw.name" />
                        </v-avatar>
                        <v-avatar v-else size="24" color="primary" class="me-3">
                          <v-icon icon="mdi-store" size="14" color="white" />
                        </v-avatar>
                        <span>{{ item.raw.name }}</span>
                      </div>
                    </template>

                    <template #append>
                      <v-chip
                        v-if="item.raw.products_count"
                        size="small"
                        color="primary"
                        variant="tonal"
                      >
                        {{ formatCount(item.raw.products_count) }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </template>

                <template #chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    color="primary"
                    size="small"
                    variant="tonal"
                    class="ma-1"
                  >
                    <v-avatar v-if="item.raw.logo" size="16" start>
                      <v-img :src="item.raw.logo" :alt="item.raw.name" />
                    </v-avatar>
                    <v-icon v-else icon="mdi-store" size="16" start />
                    {{ item.raw.name }}
                  </v-chip>
                </template>

                <template #selection="{ item, index }">
                  <v-chip
                    v-if="index < 2"
                    color="primary"
                    size="small"
                    variant="tonal"
                    closable
                    @click:close="removeEcommerce(item.raw.id)"
                    class="ma-1"
                  >
                    <v-avatar v-if="item.raw.logo" size="16" start>
                      <v-img :src="item.raw.logo" :alt="item.raw.name" />
                    </v-avatar>
                    <v-icon v-else icon="mdi-store" size="16" start />
                    {{ item.raw.name }}
                  </v-chip>
                  <span
                    v-else-if="index === 2"
                    class="text-grey text-caption align-self-center"
                  >
                    (+{{ selectedEcommerces.length - 2 }} outros)
                  </span>
                </template>

                <template #no-data>
                  <div class="text-center py-4">
                    <v-icon color="grey" size="48" class="mb-2"
                      >mdi-store-off</v-icon
                    >
                    <p class="text-body-2">Nenhum e-commerce disponível</p>
                  </div>
                </template>
              </v-select>

              <!-- Selected Summary -->
              <div
                v-if="selectedEcommerces.length > 0"
                class="selected-summary"
              >
                <v-chip-group class="selected-chips">
                  <v-chip
                    v-for="ecommerce in selectedEcommercesDetails"
                    :key="ecommerce.id"
                    color="primary"
                    size="small"
                    variant="tonal"
                    closable
                    @click:close="removeEcommerce(ecommerce.id)"
                  >
                    <v-avatar v-if="ecommerce.logo" size="14" start>
                      <v-img :src="ecommerce.logo" :alt="ecommerce.name" />
                    </v-avatar>
                    <v-icon v-else icon="mdi-store" size="14" start />
                    {{ ecommerce.name }}
                  </v-chip>
                </v-chip-group>
              </div>
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
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { computed, defineModel, ref, onMounted } from 'vue'

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

  // E-commerce options from API
  const ecommerceOptions = ref([])
  const isLoadingEcommerces = ref(false)
  const errorLoadingEcommerces = ref(false)

  // Fetch e-commerces from API
  const fetchEcommerces = async () => {
    isLoadingEcommerces.value = true
    errorLoadingEcommerces.value = false

    try {
      const { data, error } = await useSanctumFetch('/api/ecommerces', {
        method: 'GET',
      })

      if (data.value) {
        // Assumindo que a API retorna { data: [...] }
        ecommerceOptions.value = data.value.data || data.value
      }

      if (error.value) {
        throw new Error('Failed to fetch ecommerces')
      }
    } catch (err) {
      console.error('Error fetching ecommerces:', err)
      errorLoadingEcommerces.value = true
      ecommerceOptions.value = []
    } finally {
      isLoadingEcommerces.value = false
    }
  }

  // Filter states
  const selectedSort = ref('id')
  const selectedEcommerces = ref([])
  const selectedRating = ref(null)

  // Computed
  const activeFiltersCount = computed(() => {
    let count = 0

    if (selectedSort.value !== 'id') count++
    if (selectedEcommerces.value.length > 0) count++
    if (selectedRating.value !== null) count++

    return count
  })

  const selectedEcommercesDetails = computed(() => {
    return ecommerceOptions.value.filter(ecommerce =>
      selectedEcommerces.value.includes(ecommerce.id)
    )
  })

  const isAllEcommercesSelected = computed(() => {
    return (
      selectedEcommerces.value.length === ecommerceOptions.value.length &&
      ecommerceOptions.value.length > 0
    )
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
      id: 'mdi-star-outline',
      price: 'mdi-arrow-up',
      reviews: 'mdi-comment-multiple-outline',
      rating: 'mdi-star',
    }
    return icons[value] || 'mdi-sort'
  }

  const formatCount = count => {
    if (!count) return '0'

    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M'
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k'
    }

    return count.toString()
  }

  const toggleAllEcommerces = () => {
    if (isAllEcommercesSelected.value) {
      selectedEcommerces.value = []
    } else {
      selectedEcommerces.value = ecommerceOptions.value.map(e => e.id)
    }
  }

  const removeEcommerce = id => {
    const index = selectedEcommerces.value.indexOf(id)
    if (index > -1) {
      selectedEcommerces.value.splice(index, 1)
    }
  }

  const closeModal = () => {
    dialog.value = false
  }

  const clearAllFilters = () => {
    selectedSort.value = 'id'
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

  // Initialize on mount
  onMounted(() => {
    fetchEcommerces()
  })
</script>

<style scoped>
  .filter-modal-card {
    display: flex;
    flex-direction: column;
  }

  /* Desktop styles - max 600px width */
  .filter-modal-card {
    max-height: 80vh;
  }

  /* Mobile styles - fullscreen */
  @media (max-width: 959px) {
    .filter-modal-card {
      height: 100vh;
      max-height: 100vh;
    }
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

  .filter-actions {
    flex-shrink: 0;
    border-top: 1px solid #e0e0e0;
    background: #fafafa;
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
