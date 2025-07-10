<template>
  <div>
    <v-autocomplete
      v-model="selectedProducts"
      :items="productOptions"
      item-title="name"
      item-value="id"
      label="Selecionar Produtos"
      variant="outlined"
      density="comfortable"
      prepend-inner-icon="mdi-package-variant"
      multiple
      chips
      closable-chips
      clearable
      no-data-text="Nenhum produto encontrado"
      :loading="isLoadingProducts"
      :error="errorLoadingProducts"
      :error-messages="errorLoadingProducts ? 'Erro ao carregar produtos' : []"
      class="mb-3"
      @update:model-value="handleSelectionChange"
    >
      <template #chip="{ props, item }">
        <v-chip v-bind="props" size="small" color="primary" variant="outlined">
          <v-avatar start>
            <v-img
              :src="item.raw.image_url"
              :alt="`Imagem ${item.raw.name}`"
              cover
            >
              <template #error>
                <v-icon
                  icon="mdi-package-variant"
                  size="16"
                  color="grey"
                ></v-icon>
              </template>
            </v-img>
          </v-avatar>
          {{ item.raw.name }}
        </v-chip>
      </template>

      <template #item="{ props, item }">
        <v-list-item v-bind="props" :title="item.raw.name">
          <template #prepend>
            <div class="product-image-container mr-3">
              <v-img
                :src="item.raw.image_url"
                :alt="`Imagem ${item.raw.name}`"
                contain
                height="40"
                max-width="40"
                class="product-image"
              >
                <template #error>
                  <div class="image-error">
                    <v-icon
                      icon="mdi-package-variant"
                      size="20"
                      color="grey"
                    ></v-icon>
                  </div>
                </template>
              </v-img>
            </div>
          </template>
          <template #subtitle>
            <div class="d-flex align-center gap-2">
              <v-chip size="x-small" variant="tonal" color="green">
                R$ {{ formatPrice(item.raw.price) }}
              </v-chip>
              <v-chip
                v-if="item.raw.rating"
                size="x-small"
                variant="tonal"
                color="orange"
                prepend-icon="mdi-star"
              >
                {{ item.raw.rating }}
              </v-chip>
              <v-chip
                v-if="item.raw.reviews"
                size="x-small"
                variant="tonal"
                color="blue"
              >
                {{ item.raw.reviews }} avaliações
              </v-chip>
            </div>
          </template>
        </v-list-item>
      </template>

      <template #append-item>
        <div v-if="errorLoadingProducts" class="pa-4 text-center">
          <v-btn
            variant="text"
            size="small"
            color="primary"
            prepend-icon="mdi-refresh"
            @click="fetchProducts"
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

  interface Product {
    id: number
    name: string
    price: number
    image_url: string
    product_url: string
    created_at: string
    updated_at: string
    reviews: number
    rating: string
    isCustomProduct: boolean
    selected: any
  }

  interface Props {
    modelValue?: number[]
    searchId: string | number
    autoFetch?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    autoFetch: true,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: number[]]
    'products-selected': [products: Product[]]
  }>()

  // Reactive state
  const selectedProducts = ref<number[]>(props.modelValue)
  const productOptions = ref<Product[]>([])
  const isLoadingProducts = ref(false)
  const errorLoadingProducts = ref(false)

  // Methods
  const fetchProducts = async () => {
    if (!props.searchId) {
      console.warn('Search ID is required to fetch products')
      return
    }

    isLoadingProducts.value = true
    errorLoadingProducts.value = false

    try {
      const { data, error } = await useSanctumFetch(
        `/api/searches/${props.searchId}/selected-products`,
        {
          method: 'GET',
        }
      )

      if (data.value) {
        productOptions.value = Array.isArray(data.value)
          ? data.value
          : data.value.data || []
      }

      if (error.value) {
        throw new Error('Failed to fetch products')
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      errorLoadingProducts.value = true
      productOptions.value = []
    } finally {
      isLoadingProducts.value = false
    }
  }

  const handleSelectionChange = (value: number[]) => {
    selectedProducts.value = value
    emit('update:modelValue', value)

    const selectedProductsData = value
      .map(id => productOptions.value.find(p => p.id === id))
      .filter(Boolean) as Product[]

    emit('products-selected', selectedProductsData)
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  // Watchers
  watch(
    () => props.modelValue,
    newValue => {
      selectedProducts.value = newValue
    }
  )

  watch(
    () => props.searchId,
    newSearchId => {
      if (newSearchId && props.autoFetch) {
        fetchProducts()
      }
    }
  )

  // Lifecycle
  onMounted(() => {
    if (
      props.searchId &&
      props.autoFetch &&
      productOptions.value.length === 0
    ) {
      fetchProducts()
    }
  })

  // Expose methods for parent component
  defineExpose({
    fetchProducts,
    selectedProducts,
    productOptions,
  })
</script>

<style scoped>
  .product-image-container {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 8px;
    padding: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .product-image {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
    border-radius: 4px;
  }

  .image-error {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .gap-2 {
    gap: 8px;
  }

  .v-theme--dark .product-image-container {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
  }

  .v-theme--dark .image-error {
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
