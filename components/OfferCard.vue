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
    </v-card-text>

    <!-- Componente de ações -->
    <OfferCardActions
      :offer="offer"
      @view:product="handleViewProduct"
      @go:program="handleGoToProgram"
    />
    

    <!-- Modal de confirmação do programa -->
     <ProgramConfirmationModal
       v-model="showConfirmationModal"
       :program="offer.program"
       @confirm="handleProgramConfirm"
     />
  </v-card>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
import type { OfferItem } from '~/interfaces/offers';
import { useSnackbarStore } from '~/store/snackbar';

  interface Props {
    offer: OfferItem
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    'view:product': [offer: OfferItem]
    'go:program': [offer: OfferItem]
    'favorite-updated': [{ selected: boolean }]
  }>()

  const snackbarStore = useSnackbarStore()
  const route = useRoute()
  
  // Estados para favoritar
  const isLoadingFavorite = ref(false)
  const isFavorited = ref(props.offer.selected)

  const handleViewProduct = (offer: OfferItem): void => {
    // Lógica para visualizar produto
    console.log('Ver produto:', offer)
  }

  const handleGoToProgram = (offer: OfferItem): void => {
    showConfirmationModal.value = true
  }

  // Estados para modal de confirmação
  const showConfirmationModal = ref(false)

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

   // Função para confirmar programa
   const handleProgramConfirm = (): void => {
     window.open(props.offer.promotion_link, '_blank')
     emit('go:program', props.offer)
     showConfirmationModal.value = false
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
        return `${numValue.toLocaleString()} pts`
      case 'miles':
        return `${numValue.toLocaleString()} milhas`
      default:
        return value
    }
  }

  const getRewardColor = (type: string): string => {
    const colors = {
      cashback: 'green',
      points: 'blue', 
      miles: 'purple'
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
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
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
