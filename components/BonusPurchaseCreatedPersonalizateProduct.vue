<template>
  <v-dialog v-model="isOpen" max-width="650px" persistent scrollable>
    <v-card class="elevation-8">
      <v-card-title class="text-h6 pa-6 bg-primary text-white">
        <v-icon class="mr-3" color="white">mdi-plus-circle</v-icon>
        Inserir/Editar Produto (Manual)
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form ref="form" v-model="isFormValid" lazy-validation>
          <EcommerceAutocomplete
            v-model="selectedEcommerce"
            @ecommerce-selected="handleEcommerceSelected"
          />

          <v-text-field
            v-model="productForm.name"
            label="Nome Do Produto"
            variant="outlined"
            density="comfortable"
            :rules="nameRules"
            required
            prepend-inner-icon="mdi-tag"
            class="mb-5"
          />

          <v-text-field
            v-model="productForm.price"
            label="Preço"
            variant="outlined"
            density="comfortable"
            :rules="priceRules"
            required
            type="number"
            step="0.01"
            min="0"
            prepend-inner-icon="mdi-currency-usd"
            prefix="R$"
            class="mb-5"
          />

          <v-text-field
            v-model="productForm.product_url"
            label="Link Para O Produto"
            variant="outlined"
            density="comfortable"
            :rules="urlRules"
            required
            prepend-inner-icon="mdi-link"
            class="mb-5"
          />
        </v-form>
      </v-card-text>

      <v-divider class="mx-6" />

      <v-card-actions class="pa-6 pt-4">
        <v-spacer />
        <v-btn
          variant="outlined"
          size="large"
          @click="closeModal"
          :disabled="isSubmitting"
          class="mr-3"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          size="large"
          :loading="isSubmitting"
          :disabled="!isFormValid || !selectedEcommerce"
          @click="submitProduct"
        >
          Salvar Produto
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import EcommerceAutocomplete from './EcommerceAutocomplete.vue'

  interface ProductForm {
    name: string
    price: number | string
    product_url: string
  }

  interface Props {
    searchId?: string | number
    searchTerm?: string
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    productCreated: [product: any]
    close: []
  }>()

  // Reactive state
  const isOpen = ref(false)
  const isFormValid = ref(false)
  const isSubmitting = ref(false)
  // Form data
  const productForm = ref<ProductForm>({
    name: '',
    price: '',
    product_url: '',
  })

  const selectedEcommerce = ref<number | null>(null)
  const selectedEcommerceData = ref<any>(null)
  const nameRules = [
    (v: string) => !!v || 'Nome é obrigatório',
    (v: string) =>
      (v && v.length >= 2) || 'Nome deve ter pelo menos 2 caracteres',
  ]

  const priceRules = [
    (v: string | number) => !!v || 'Preço é obrigatório',
    (v: string | number) => {
      const price = typeof v === 'string' ? parseFloat(v) : v
      return (!isNaN(price) && price > 0) || 'Preço deve ser maior que 0'
    },
  ]

  const urlRules = [
    (v: string) => !!v || 'URL é obrigatória',
    (v: string) => {
      try {
        new URL(v)
        return true
      } catch {
        return 'URL deve ser válida'
      }
    },
  ]

  const handleEcommerceSelected = (ecommerce: any) => {
    selectedEcommerceData.value = ecommerce
  }

  const submitProduct = async () => {
    if (!props.searchId || !props.searchTerm) {
      console.error('SearchId ou searchTerm não disponível')
      return
    }

    try {
      isSubmitting.value = true

      const payload = {
        name: productForm.value.name,
        price:
          typeof productForm.value.price === 'string'
            ? parseFloat(productForm.value.price)
            : productForm.value.price,
        product_url: productForm.value.product_url,
        ecommerce_id: selectedEcommerce.value,
      }

      const { data, error } = await useSanctumFetch(
        `/api/searches/${props.searchId}/user-products`,
        {
          method: 'POST',
          query: {
            search_term: props.searchTerm.trim().toLowerCase(),
          },
          body: payload,
        }
      )

      if (data.value) {
        emit('productCreated', data.value.data || data.value)
        closeModal()

        console.log('Produto criado com sucesso:', data.value)
      }

      if (error.value) {
        console.error('Erro ao criar produto:', error.value)
      }
    } catch (err) {
      console.error('Erro ao criar produto:', err)
    } finally {
      isSubmitting.value = false
    }
  }

  const openModal = () => {
    isOpen.value = true
  }

  const closeModal = () => {
    isOpen.value = false
    resetForm()
    emit('close')
  }

  const resetForm = () => {
    productForm.value = {
      name: '',
      price: '',
      product_url: '',
    }
    selectedEcommerce.value = null
    selectedEcommerceData.value = null
  }

  // Watch for modal state changes
  watch(isOpen, newValue => {
    if (!newValue) {
      // Reset form when modal closes
      setTimeout(() => {
        resetForm()
      }, 300) // Delay to allow modal animation
    }
  })

  defineExpose({
    openModal,
    closeModal,
  })
</script>

<style scoped>
  .v-card {
    border-radius: 16px !important;
    overflow: hidden;
  }

  .v-card-title {
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%) !important;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
  }

  .hover-bg {
    transition: background-color 0.2s ease;
    border-radius: 8px;
  }

  .hover-bg:hover {
    background-color: rgba(25, 118, 210, 0.04);
  }

  .v-text-field {
    transition: all 0.3s ease;
  }

  .v-text-field:focus-within {
    transform: translateY(-1px);
  }

  .v-btn {
    border-radius: 8px !important;
    text-transform: none !important;
    font-weight: 500;
  }

  .v-card .v-divider {
    opacity: 0.12;
  }

  .v-label {
    color: rgba(0, 0, 0, 0.87) !important;
  }

  .v-chip {
    font-size: 0.75rem;
    font-weight: 500;
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
