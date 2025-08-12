<template>
  <v-card :class="['offer-card']" elevation="2">
    <!-- Imagem do produto com overlay de informações -->
    <div class="product-section">
      <OfferProductImage
        :product="offer.product"
        :discount-percentage="offer.discount_percentage"
      />

      <!-- Header compacto sobreposto -->
      <div class="header-overlay">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <BaseLogoAvatar
              :src="offer.ecommerce.logo_url || ''"
              :alt="offer.ecommerce.name"
              size="xs"
              type="ecommerce"
              class="mr-2"
            />
            <span class="text-caption font-weight-medium text-white">
              {{ offer.ecommerce.name }}
            </span>
          </div>

          <!-- Botão de favoritar -->
          <div class="d-flex align-center mt-8">
            <v-btn
              :icon="isFavorited ? 'mdi-heart' : 'mdi-heart-outline'"
              :color="isFavorited ? 'red' : 'white'"
              variant="text"
              size="small"
              :loading="isLoadingFavorite"
              @click="toggleFavorite"
              class="favorite-btn"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Conteúdo principal simplificado -->
    <v-card-text class="pa-3">
      <!-- Nome do produto -->
      <h3 class="text-body-1 font-weight-medium mb-2 product-name">
        {{ offer.product.name }}
      </h3>

      <!-- Preços em destaque -->
      <div class="price-section mb-3">
        <div class="d-flex align-center gap-2">
          <span class="text-h6 font-weight-bold text-primary">
            {{ formatPrice(parseFloat(offer.final_price)) }}
          </span>
          <span
            v-if="offer.product.price > parseFloat(offer.final_price)"
            class="text-body-2 text-decoration-line-through text-medium-emphasis"
          >
            {{ formatPrice(offer.product.price) }}
          </span>
        </div>

        <!-- Avaliações compactas -->
        <div v-if="offer.product.reviews > 0" class="d-flex align-center mt-1">
          <v-rating
            :model-value="parseFloat(offer.product.rating)"
            color="amber"
            density="compact"
            size="x-small"
            readonly
            half-increments
          />
          <span class="text-caption text-medium-emphasis ml-1">
            ({{ offer.product.reviews }})
          </span>
        </div>
      </div>

      <!-- Recompensa em linha -->
      <div class="reward-inline mb-3">
        <v-chip
          :color="getRewardColor(offer.program.type)"
          variant="tonal"
          size="small"
          class="mr-2"
        >
          {{ formatBenefit(offer.reward_value, offer.program.type) }}
        </v-chip>
        <span class="text-caption text-medium-emphasis">
          via {{ offer.program.name }}
        </span>
      </div>

      <!-- Preço do mileiro (apenas para programas que não são cashback) -->
      <div v-if="offer.program.type !== 'cashback' && offer.program.value_per_mile && offer.program.value_per_mile > 0" class="mileiro-price-section mb-3">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon
              icon="mdi-currency-usd"
              size="small"
              class="mr-2 text-secondary"
            />
            <div>
              <span class="text-caption text-medium-emphasis">
                Preço do mileiro:
              </span>
              <span class="text-body-2 font-weight-medium ml-1">
                {{ formatPrice(offer.program.value_per_mile || 0) }}
              </span>
            </div>
          </div>
          <v-btn
            icon
            size="small"
            variant="text"
            @click="openMileiroConfigModal"
            class="ml-2"
          >
            <v-icon
              icon="mdi-cog"
              size="small"
              class="text-secondary"
            />
          </v-btn>
        </div>
      </div>

      <!-- Valor atual da promoção -->
      <div class="current-value-section mb-3">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon
              :icon="getCurrentValueIcon()"
              size="small"
              class="mr-2 text-primary"
            />
            <div>
              <span class="text-caption text-medium-emphasis"
                >Valor atual:</span
              >
              <div class="text-body-2 font-weight-medium">
                {{ getCurrentValueDisplay() }}
                <v-chip
                  v-if="offer.custom_current_value !== null"
                  color="orange"
                  variant="tonal"
                  size="x-small"
                  class="ml-1"
                >
                  Personalizado
                </v-chip>
              </div>
            </div>
          </div>
          <v-btn
            icon="mdi-pencil"
            variant="text"
            size="small"
            color="primary"
            @click="openEditModal"
          />
        </div>
      </div>
    </v-card-text>

    <!-- Componente de ações -->
    <OfferCardActions
      :offer="offer"
      @view:product="handleViewProduct"
      @go:program="handleGoToProgram"
    />

    <!-- Modal de edição do valor atual -->
    <v-dialog v-model="showEditModal" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">
          Editar Valor Atual da Promoção
        </v-card-title>

        <v-card-text>
          <div class="mb-4">
            <span class="text-body-2 text-medium-emphasis">
              Valor automático atual: {{ getAutomaticValueDisplay() }}
            </span>
          </div>

          <v-radio-group v-model="valueType" class="mb-4">
            <v-radio label="Usar valor automático" value="automatic" />
            <v-radio label="Definir valor personalizado" value="custom" />
          </v-radio-group>

          <v-text-field
            v-if="valueType === 'custom'"
            v-model="customValue"
            :label="getCustomValueLabel()"
            type="number"
            min="0"
            step="0.01"
            variant="outlined"
            density="comfortable"
            :rules="[validateCustomValue]"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text="Cancelar" @click="closeEditModal" />
          <v-btn
            color="primary"
            text="Confirmar"
            :loading="isUpdatingValue"
            @click="updateCurrentValue"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de configuração do mileiro -->
    <v-dialog 
      v-model="showMileiroConfigModal" 
      max-width="480"
      :fullscreen="$vuetify.display.xs"
      persistent
      class="mileiro-config-modal"
    >
      <v-card class="rounded-lg" :class="{ 'rounded-0': $vuetify.display.xs }">
        <!-- Header com gradiente -->
        <div class="modal-header pa-6 pb-4">
          <div class="d-flex align-center mb-2">
            <div class="icon-container mr-3">
              <v-icon 
                icon="mdi-tune-variant" 
                size="24"
                color="primary"
              />
            </div>
            <div>
              <h2 class="text-h6 font-weight-bold mb-1">
                Personalize seu Mileiro
              </h2>
              <p class="text-caption text-medium-emphasis ma-0">
                Configure valores que fazem sentido para você
              </p>
            </div>
          </div>
        </div>

        <v-card-text class="pa-6 pt-2">
          <!-- Seção principal -->
          <div class="content-section mb-5">
            <div class="d-flex align-start mb-4">
              <v-icon 
                icon="mdi-lightbulb-outline" 
                color="amber" 
                size="20"
                class="mr-3 mt-1"
              />
              <div>
                <h3 class="text-subtitle-1 font-weight-medium mb-2">
                  Por que personalizar?
                </h3>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Cada pessoa tem uma estratégia diferente para usar milhas. 
                  Defina valores que reflitam seu perfil de viagem.
                </p>
              </div>
            </div>
          </div>

          <!-- Informação sobre valor atual -->
          <div class="current-value-section mb-5">
            <v-card 
              variant="tonal" 
              color="primary"
              class="pa-4"
            >
              <div class="d-flex align-center mb-2">
                <v-icon 
                  icon="mdi-chart-line" 
                  size="18"
                  class="mr-2"
                />
                <span class="text-subtitle-2 font-weight-medium">
                  Valor atual do mercado
                </span>
              </div>
              <p class="text-body-2 mb-0">
                Estamos usando um valor base de <strong>{{ formatPrice(offer.program.value_per_mile || 0) }}</strong> 
                por milha, baseado em nossa análise de mercado.
              </p>
            </v-card>
          </div>

          <!-- Benefícios -->
          <div class="benefits-section">
            <h3 class="text-subtitle-1 font-weight-medium mb-3">
              O que você pode fazer:
            </h3>
            <div class="benefits-list">
              <div class="d-flex align-start mb-3">
                <v-icon 
                  icon="mdi-check-circle" 
                  color="success" 
                  size="18"
                  class="mr-3 mt-1"
                />
                <span class="text-body-2">
                  Ajustar preços por programa de milhas
                </span>
              </div>
              <div class="d-flex align-start mb-3">
                <v-icon 
                  icon="mdi-check-circle" 
                  color="success" 
                  size="18"
                  class="mr-3 mt-1"
                />
                <span class="text-body-2">
                  Ver cálculos mais precisos nas ofertas
                </span>
              </div>
              <div class="d-flex align-start">
                <v-icon 
                  icon="mdi-check-circle" 
                  color="success" 
                  size="18"
                  class="mr-3 mt-1"
                />
                <span class="text-body-2">
                  Tomar decisões baseadas no seu perfil
                </span>
              </div>
            </div>
          </div>
        </v-card-text>

        <!-- Actions com melhor espaçamento -->
        <v-card-actions class="pa-6 pt-0">
          <v-btn
            variant="text"
            color="medium-emphasis"
            @click="closeMileiroConfigModal"
            class="mr-3"
          >
            Agora não
          </v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            variant="elevated"
            @click="goToMileiroConfig"
            class="px-6"
          >
            <v-icon icon="mdi-cog" size="18" class="mr-2" />
            Configurar agora
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { OfferItem } from '~/interfaces/offers'
  import { useSnackbarStore } from '~/store/snackbar'

  interface Props {
    offer: OfferItem
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    'view:product': [offer: OfferItem]
    'go:program': [offer: OfferItem]
    'favorite-updated': [{ selected: boolean }]
    'value-updated': []
  }>()

  const snackbarStore = useSnackbarStore()
  const route = useRoute()

  // Estados para favoritar
  const isLoadingFavorite = ref(false)
  const isFavorited = ref(props.offer.selected)

  // Estados para modal de edição do valor atual
  const showEditModal = ref(false)
  const isUpdatingValue = ref(false)
  const valueType = ref<'automatic' | 'custom'>('automatic')
  const customValue = ref<number | null>(null)

  // Estados para modal de configuração do mileiro
  const showMileiroConfigModal = ref(false)

  // Função para abrir modal de configuração do mileiro
  const openMileiroConfigModal = (): void => {
    showMileiroConfigModal.value = true
  }

  // Função para fechar modal de configuração do mileiro
  const closeMileiroConfigModal = (): void => {
    showMileiroConfigModal.value = false
  }

  // Função para redirecionar para configuração de mileiros
  const goToMileiroConfig = (): void => {
    closeMileiroConfigModal()
    
    // Capturar parâmetros da URL atual para permitir retorno
    const currentQuery = route.query
    const returnParams = new URLSearchParams()
    
    // Adicionar parâmetros relevantes para manter o contexto da busca
    Object.keys(currentQuery).forEach(key => {
      if (currentQuery[key]) {
        returnParams.append(key, String(currentQuery[key]))
      }
    })
    
    // Adicionar parâmetro de retorno
    const returnUrl = `/offers?${returnParams.toString()}`
    
    navigateTo(`/mileiros-config?returnTo=${encodeURIComponent(returnUrl)}`)
  }

  const handleViewProduct = (offer: OfferItem): void => {
    window.open(offer.product.product_url, '_blank')
  }

  const handleGoToProgram = (offer: OfferItem): void => {
    window.open(offer.program.link_url, '_blank')
  }

  // Função para favoritar
  const toggleFavorite = async (): Promise<void> => {
    if (isLoadingFavorite.value) return

    isLoadingFavorite.value = true
    const newFavoriteState = !isFavorited.value

    const { data, error } = await useSanctumFetch<any>(
      `/api/searches/${route.query.searchId}/offers/${props.offer.id}`,
      {
        method: 'PUT',
        body: {
          selected: newFavoriteState,
        },
      }
    )

    if (data.value) {
      isFavorited.value = newFavoriteState
      emit('favorite-updated', {
        selected: newFavoriteState,
      })
      snackbarStore.showSuccess('Oferta favoritada com sucesso!!')
      isLoadingFavorite.value = false
    }

    if (error.value) {
      snackbarStore.showError('Erro ao favoritar oferta. Tente novamente.')
      isLoadingFavorite.value = false
    }
  }

  // Funções para valor atual da promoção
  const getCurrentValue = (): number => {
    return props.offer.custom_current_value !== null
      ? props.offer.custom_current_value
      : props.offer.current_value
  }

  const getCurrentValueIcon = (): string => {
    switch (props.offer.program.type) {
      case 'cashback':
        return 'mdi-percent'
      case 'points':
        return 'mdi-star-circle'
      case 'miles':
        return 'mdi-airplane'
      default:
        return 'mdi-percent'
    }
  }

  const getCurrentValueDisplay = (): string => {
    const value = getCurrentValue()
    switch (props.offer.program.type) {
      case 'cashback':
        return `${value}%`
      case 'points':
        return `${value.toLocaleString('pt-BR')} pontos`
      case 'miles':
        return `${value.toLocaleString('pt-BR')} milhas`
      default:
        return `${value}%`
    }
  }

  const getAutomaticValueDisplay = (): string => {
    switch (props.offer.program.type) {
      case 'cashback':
        return `${props.offer.current_value}%`
      case 'points':
        return `${props.offer.current_value.toLocaleString('pt-BR')} pontos`
      case 'miles':
        return `${props.offer.current_value.toLocaleString('pt-BR')} milhas`
      default:
        return `${props.offer.current_value}%`
    }
  }

  const getCustomValueLabel = (): string => {
    switch (props.offer.program.type) {
      case 'cashback':
        return 'Valor personalizado (%)'
      case 'points':
        return 'Valor personalizado (pontos)'
      case 'miles':
        return 'Valor personalizado (milhas)'
      default:
        return 'Valor personalizado (%)'
    }
  }

  const openEditModal = (): void => {
    // Inicializar valores do modal
    if (props.offer.custom_current_value !== null) {
      valueType.value = 'custom'
      customValue.value = props.offer.custom_current_value
    } else {
      valueType.value = 'automatic'
      customValue.value = null
    }
    showEditModal.value = true
  }

  const closeEditModal = (): void => {
    showEditModal.value = false
    valueType.value = 'automatic'
    customValue.value = null
  }

  const validateCustomValue = (value: number | null): boolean | string => {
    if (valueType.value === 'custom') {
      if (value === null || value === undefined) {
        return 'Valor é obrigatório'
      }
      if (value < 0) {
        return 'Valor deve ser maior que 0'
      }
      // Para cashback, limitar a 100%
      if (props.offer.program.type === 'cashback' && value > 100) {
        return 'Valor deve estar entre 0 e 100%'
      }
      // Para pontos e milhas, permitir valores maiores mas com limite razoável
      if (
        (props.offer.program.type === 'points' ||
          props.offer.program.type === 'miles') &&
        value > 999999
      ) {
        return 'Valor muito alto'
      }
    }
    return true
  }

  const updateCurrentValue = async (): Promise<void> => {
    if (isUpdatingValue.value) return

    // Validar valor personalizado se necessário
    if (valueType.value === 'custom') {
      const validation = validateCustomValue(customValue.value)
      if (validation !== true) {
        snackbarStore.showError(
          typeof validation === 'string' ? validation : 'Valor inválido'
        )
        return
      }
    }

    isUpdatingValue.value = true

    const requestBody = {
      custom_current_value:
        valueType.value === 'custom' ? Number(customValue.value) : null,
    }

    const { data, error } = await useSanctumFetch<any>(
      `/api/searches/${route.query.searchId}/offers/${props.offer.id}`,
      {
        method: 'PUT',
        body: requestBody,
      }
    )

    if (data.value) {
      // Atualizar o valor local
      props.offer.custom_current_value = requestBody.custom_current_value
      snackbarStore.showSuccess('Valor atual atualizado com sucesso!')
      closeEditModal()
      // Emitir evento para recarregar ofertas
      emit('value-updated')
    }

    if (error.value) {
      snackbarStore.showError('Erro ao atualizar valor atual. Tente novamente.')
    }

    isUpdatingValue.value = false
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const formatBenefit = (value: string, type: string): string => {
    const numValue = parseFloat(value)

    switch (type) {
      case 'cashback':
        return formatPrice(numValue)
      case 'points':
        return `${numValue.toLocaleString('pt-BR')} pts`
      case 'miles':
        return `${numValue.toLocaleString('pt-BR')} milhas`
      default:
        return value
    }
  }

  const getRewardColor = (type: string): string => {
    const colors = {
      cashback: 'green',
      points: 'blue',
      miles: 'purple',
    }
    return colors[type as keyof typeof colors] || 'primary'
  }
</script>

<style scoped>
  .offer-card {
    border-radius: 12px !important;
    transition: all 0.3s ease;
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .offer-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }

  .product-section {
    position: relative;
  }

  .header-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.6) 0%,
      transparent 100%
    );
    padding: 12px;
    z-index: 2;
  }

  .product-name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.3;
    min-height: 2.6em;
  }

  .price-section {
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
    padding-bottom: 12px;
  }

  .reward-inline {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
  }

  .mileiro-price-section {
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.05);
    background: rgba(var(--v-theme-surface-variant), 0.3);
    border-radius: 6px;
    padding: 8px 12px;
  }

  /* Estilos para modal de configuração do mileiro */
  .mileiro-config-modal {
    .modal-header {
      background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
      border-bottom: 1px solid rgba(var(--v-border-color), 0.1);
    }

    .icon-container {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(var(--v-theme-primary), 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .content-section {
      .v-icon {
        flex-shrink: 0;
      }
    }

    .current-value-section {
      .v-card {
        border: 1px solid rgba(var(--v-theme-primary), 0.2);
      }
    }

    .benefits-list {
      .v-icon {
        flex-shrink: 0;
      }
    }

    /* Responsividade mobile */
    @media (max-width: 600px) {
      .modal-header {
        padding: 20px 16px 16px 16px !important;
      }

      .v-card-text {
        padding: 16px !important;
        padding-top: 8px !important;
      }

      .v-card-actions {
        padding: 16px !important;
        padding-top: 0 !important;
        flex-direction: column;
        gap: 8px;

        .v-btn {
          width: 100%;
          margin: 0 !important;
        }
      }

      .icon-container {
        width: 40px;
        height: 40px;
      }

      .text-h6 {
         font-size: 1.1rem !important;
       }
     }
   }

  .current-value-section {
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
    padding-top: 12px;
  }

  .favorite-btn {
    background: rgba(0, 0, 0, 0.3) !important;
    backdrop-filter: blur(8px);
  }

  .favorite-btn:hover {
    background: rgba(0, 0, 0, 0.5) !important;
    transform: scale(1.1);
  }

  /* Responsividade */
  @media (max-width: 600px) {
    .offer-card {
      border-radius: 8px !important;
    }

    .header-overlay {
      padding: 8px;
    }

    .product-name {
      font-size: 0.875rem;
    }

    .reward-inline {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  /* Performance optimizations */
  .offer-card {
    will-change: transform;
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    .offer-card {
      transition: none;
    }
  }
</style>
