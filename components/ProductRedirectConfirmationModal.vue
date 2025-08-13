<template>
  <v-dialog
    v-model="isVisible"
    :max-width="modalMaxWidth"
    :fullscreen="isFullscreen"
    persistent
    class="product-redirect-modal"
    :class="modalClasses"
  >
    <v-card class="modal-card" :class="cardClasses">
      <!-- Header -->
      <ProductRedirectConfirmationModalHeader />

      <!-- Content -->
      <v-card-text class="modal-content" :class="contentClasses">
        <!-- Product Info Section -->
        <ProductRedirectConfirmationModalInfoSection :product="product" />

        <!-- Alert Section -->
        <div class="alert-section" :class="alertSectionClasses">
          <ProductRedirectConfirmationModalAlert />
        </div>

        <!-- Guidelines Section -->
        <div class="guidelines-section" :class="guidelinesSectionClasses">
          <ProductRedirectConfirmationModalGuidelines
            :guidelines="guidelines"
          />
        </div>
      </v-card-text>

      <!-- Footer -->
      <div class="modal-footer-wrapper" :class="{ 'mobile-footer': isMobile }">
        <ProductRedirectConfirmationModalFooter
          @cancel="handleCancel"
          @confirm="handleConfirm"
        />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { useDisplay } from 'vuetify'

  interface Product {
    id: string
    name: string
    image: string
    ecommerce: string
    url: string
  }

  interface Props {
    modelValue: boolean
    product: Product
  }

  interface Emits {
    'update:modelValue': [value: boolean]
    confirm: [product: Product]
    cancel: []
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const { xs, sm, md } = useDisplay()

  const isMobile = computed(() => xs.value)

  const isVisible = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  const guidelines = ref([
    'Este link é apenas para visualização de detalhes, fotos e especificações do produto',
    'Para receber bonificação (pontos, milhas ou cashback), acesse o marketplace através do programa de fidelidade oficial',
    'Nunca faça compras diretamente através deste link de referência',
    'Produtos como bebidas alcoólicas ou itens +18 podem não ter links disponíveis - busque diretamente no marketplace',
    'Use este link apenas como referência para encontrar o produto no site oficial do parceiro',
  ])

  const isFullscreen = computed(() => xs.value)
  const modalMaxWidth = computed(() => {
    if (xs.value) return '100%'
    if (sm.value) return '500px'
    if (md.value) return '600px'
    return '700px'
  })

  const modalClasses = computed(() => ({
    'mobile-modal': xs.value,
    'tablet-modal': sm.value,
    'desktop-modal': !xs.value && !sm.value,
  }))

  const cardClasses = computed(() => ({
    'mobile-card': xs.value,
    'tablet-card': sm.value,
    'desktop-card': !xs.value && !sm.value,
  }))

  const contentClasses = computed(() => ({
    'mobile-content': xs.value,
    'tablet-content': sm.value,
    'desktop-content': !xs.value && !sm.value,
  }))

  const alertSectionClasses = computed(() => ({
    'mb-4': xs.value,
    'mb-5': sm.value,
    'mb-6': !xs.value && !sm.value,
  }))

  const guidelinesSectionClasses = computed(() => ({
    'mb-4': xs.value,
    'mb-5': sm.value,
    'mb-6': !xs.value && !sm.value,
  }))

  const handleCancel = () => {
    emit('cancel')
    isVisible.value = false
  }

  const handleConfirm = () => {
    emit('confirm', props.product)
    isVisible.value = false
  }
</script>

<style scoped>
  .product-redirect-dialog {
    z-index: 2000;
  }

  .product-redirect-modal {
    border-radius: 16px !important;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }

  .mobile-modal {
    border-radius: 0 !important;
    height: 100vh;
    max-height: 100vh;
    margin: 0 !important;
  }

  .mobile-card {
    height: 100vh;
    display: flex;
    flex-direction: column;
    border-radius: 0 !important;
  }

  .tablet-modal {
    border-radius: 12px !important;
    max-height: 85vh;
  }

  .desktop-modal {
    border-radius: 16px !important;
    max-height: 80vh;
  }

  .modal-content {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(var(--v-theme-primary), 0.3) transparent;
  }

  .mobile-content {
    padding: 16px !important;
    flex: 1;
    overflow-y: auto;
  }

  .modal-content::-webkit-scrollbar {
    width: 6px;
  }

  .modal-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .modal-content::-webkit-scrollbar-thumb {
    background-color: rgba(var(--v-theme-primary), 0.3);
    border-radius: 3px;
  }

  .modal-content::-webkit-scrollbar-thumb:hover {
    background-color: rgba(var(--v-theme-primary), 0.5);
  }

  /* Animações suaves */
  .product-redirect-modal {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Melhorias de acessibilidade */
  @media (prefers-reduced-motion: reduce) {
    .product-redirect-modal {
      transition: none;
    }
  }

  /* Ajustes para telas muito pequenas */
  @media (max-height: 600px) {
    .mobile-modal {
      max-height: 100vh;
    }
  }

  /* Ajustes específicos para mobile */
  @media (max-width: 600px) {
    .mobile-modal {
      height: 100dvh; /* Usa dynamic viewport height */
      max-height: 100dvh;
    }

    .mobile-card {
      height: 100dvh;
      max-height: 100dvh;
    }

    .mobile-content {
      padding: 12px !important;
      flex: 1;
      overflow-y: auto;
      max-height: calc(
        100dvh - 120px
      ); /* Reserva espaço para header e footer */
    }

    .mobile-card {
      overflow: hidden;
    }

    .alert-section,
    .guidelines-section {
      margin-bottom: 12px !important;
    }

    .mobile-footer {
      flex-shrink: 0;
      margin-top: auto;
    }

    .modal-footer-wrapper {
      width: 100%;
    }
  }
</style>
