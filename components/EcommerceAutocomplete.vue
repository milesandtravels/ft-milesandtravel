<template>
  <div>
    <v-autocomplete
      v-model="selectedEcommerce"
      :items="ecommerceOptions"
      item-title="name"
      item-value="id"
      label="Selecionar Marketplace"
      variant="outlined"
      density="comfortable"
      prepend-inner-icon="mdi-store"
      clearable
      no-data-text="Nenhum marketplace encontrado"
      :loading="isLoadingEcommerces"
      :error="errorLoadingEcommerces"
      :error-messages="
        errorLoadingEcommerces ? 'Erro ao carregar marketplaces' : []
      "
      class="mb-3"
      @update:model-value="handleSelectionChange"
    >
      <template #item="{ props, item }">
        <v-list-item v-bind="props" :title="item.raw.name">
          <template #prepend>
            <div class="ecommerce-logo-container mr-3">
              <v-img
                :src="item.raw.logo_url"
                :alt="`Logo ${item.raw.name}`"
                contain
                height="32"
                max-width="48"
                class="ecommerce-logo"
              >
                <template #error>
                  <div class="logo-error-small">
                    <v-icon icon="mdi-store" size="16" color="grey"></v-icon>
                  </div>
                </template>
              </v-img>
            </div>
          </template>
          <template #subtitle>
            <v-chip
              v-if="item.raw.category"
              size="x-small"
              variant="tonal"
              color="primary"
            >
              {{ item.raw.category }}
            </v-chip>
          </template>
        </v-list-item>
      </template>

      <template #selection="{ item }">
        <div class="d-flex align-center">
          <div class="ecommerce-logo-container-small mr-2">
            <v-img
              :src="item.raw.logo_url"
              :alt="`Logo ${item.raw.name}`"
              contain
              height="20"
              max-width="32"
              class="ecommerce-logo"
            >
              <template #error>
                <div class="logo-error-small">
                  <v-icon icon="mdi-store" size="12" color="grey"></v-icon>
                </div>
              </template>
            </v-img>
          </div>
          <span>{{ item.raw.name }}</span>
        </div>
      </template>

      <template #append-item>
        <div v-if="errorLoadingEcommerces" class="pa-4 text-center">
          <v-btn
            variant="text"
            size="small"
            color="primary"
            prepend-icon="mdi-refresh"
            @click="fetchEcommerces"
          >
            Tentar Novamente
          </v-btn>
        </div>
      </template>
    </v-autocomplete>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'

  interface Ecommerce {
    id: number
    name: string
    logo_url: string
    category: string | null
  }

  interface Props {
    modelValue?: number | null
    autoFetch?: boolean
    searchId?: string | null
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    autoFetch: true,
    searchId: null,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: number | null]
    'ecommerce-selected': [ecommerce: Ecommerce | null]
  }>()

  // Reactive state
  const selectedEcommerce = ref<number | null>(props.modelValue)
  const ecommerceOptions = ref<Ecommerce[]>([])
  const isLoadingEcommerces = ref(false)
  const errorLoadingEcommerces = ref(false)

  // Methods
  const fetchEcommerces = async () => {
    isLoadingEcommerces.value = true
    errorLoadingEcommerces.value = false

    try {
      const queryParams = new URLSearchParams()
      if (props.searchId) {
        queryParams.append('search_id', props.searchId)
      }
      
      const url = `/api/ecommerces${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const { data, error } = await useSanctumFetch(url, {
        method: 'GET',
      })

      if (data.value) {
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

  const handleSelectionChange = (value: number | null) => {
    selectedEcommerce.value = value
    emit('update:modelValue', value)

    const selectedEcommerceData = value
      ? ecommerceOptions.value.find(e => e.id === value) || null
      : null

    emit('ecommerce-selected', selectedEcommerceData)
  }

  // Watchers
  watch(
    () => props.modelValue,
    newValue => {
      selectedEcommerce.value = newValue
    }
  )

  watch(
    () => props.searchId,
    () => {
      if (props.autoFetch) {
        fetchEcommerces()
      }
    }
  )

  // Lifecycle
  onMounted(() => {
    if (props.autoFetch && ecommerceOptions.value.length === 0) {
      fetchEcommerces()
    }
  })

  // Expose methods for parent component
  defineExpose({
    fetchEcommerces,
    selectedEcommerce,
    ecommerceOptions,
  })
</script>

<style scoped>
  .ecommerce-logo-container {
    width: 48px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 8px;
    padding: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .ecommerce-logo-container-small {
    width: 32px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 6px;
    padding: 2px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .ecommerce-logo {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
  }

  .logo-error-small {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .v-theme--dark .ecommerce-logo-container,
  .v-theme--dark .ecommerce-logo-container-small {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
  }

  .v-theme--dark .logo-error-small {
    background: rgba(255, 255, 255, 0.05);
  }

  :deep(.v-field--outlined) {
    border-radius: 12px;
  }

  :deep(.v-field--outlined .v-field__outline) {
    --v-field-border-width: 1px;
  }

  :deep(.v-field--focused .v-field__outline) {
    --v-field-border-width: 2px;
  }
</style>
