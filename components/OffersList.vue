<template>
  <div class="offers-container">
    <v-row justify="center">
      <v-col
        v-for="offer in offers"
        :key="`${offer.ecommerce.id}-${offer.product.id}-${offer.program.id}`"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card :class="['offer-card']" elevation="2">
          <!-- Header com logo do e-commerce -->
          <v-card-item class="pa-3">
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-avatar
                  v-if="offer.ecommerce.logo_url"
                  size="32"
                  class="me-2"
                >
                  <v-img
                    :src="offer.ecommerce.logo_url"
                    :alt="offer.ecommerce.name"
                  />
                </v-avatar>
                <span class="text-body-2 font-weight-medium">
                  {{ offer.ecommerce.name }}
                </span>
              </div>

              <v-chip
                :color="getProgramTypeColor(offer.program.type)"
                size="small"
                variant="flat"
                class="text-white"
              >
                {{ getProgramTypeLabel(offer.program.type) }}
              </v-chip>
            </div>
          </v-card-item>

          <!-- Imagem do produto -->
          <div class="product-image-container">
            <v-img
              :src="offer.product.image_url"
              :alt="offer.product.name"
              aspect-ratio="1"
              cover
              class="product-image"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular color="grey-lighten-4" indeterminate />
                </div>
              </template>
            </v-img>

            <!-- Badge de desconto -->
            <v-chip
              v-if="parseFloat(offer.discount_percentage) > 0"
              class="discount-badge text-white font-weight-bold"
              color="error"
              size="small"
              variant="flat"
            >
              {{ formatDiscount(offer.discount_percentage) }}%
            </v-chip>
          </div>

          <!-- Informações do produto -->
          <v-card-text class="pa-3">
            <!-- Nome do produto -->
            <h3 class="text-body-1 font-weight-medium mb-2 product-name">
              {{ offer.product.name }}
            </h3>

            <!-- Avaliações -->
            <div
              v-if="offer.product.reviews > 0"
              class="d-flex align-center mb-2"
            >
              <v-rating
                :model-value="parseFloat(offer.product.rating)"
                color="amber"
                density="compact"
                size="small"
                readonly
                half-increments
              />
              <span class="text-caption text-medium-emphasis ms-1">
                ({{ formatReviews(offer.product.reviews) }})
              </span>
            </div>

            <!-- Preços -->
            <div class="price-section mb-3">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <span class="text-h6 font-weight-bold text-primary">
                    {{ formatPrice(parseFloat(offer.final_price)) }}
                  </span>
                  <div
                    v-if="
                      parseFloat(offer.product.price) !==
                      parseFloat(offer.final_price)
                    "
                    class="text-caption text-medium-emphasis text-decoration-line-through"
                  >
                    {{ formatPrice(offer.product.price) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Programa de recompensa -->
            <div class="reward-section">
              <div class="d-flex align-center mb-2">
                <v-avatar v-if="offer.program.logo_url" size="20" class="me-2">
                  <v-img
                    :src="offer.program.logo_url"
                    :alt="offer.program.name"
                  />
                </v-avatar>
                <span class="text-caption font-weight-medium">
                  {{ offer.program.name }}
                </span>
              </div>

              <v-chip
                :color="getProgramTypeColor(offer.program.type)"
                variant="tonal"
                size="small"
                class="reward-chip"
              >
                <v-icon
                  :icon="getProgramTypeIcon(offer.program.type)"
                  size="16"
                  class="me-1"
                />
                {{ formatBenefit(offer) }}
              </v-chip>
            </div>
          </v-card-text>

          <!-- Botões de ação -->
          <v-card-actions class="pa-3 pt-0">
            <v-btn
              color="primary"
              variant="flat"
              size="large"
              class="flex-grow-1 text-white font-weight-medium"
              @click="handleViewProduct(offer)"
            >
              VISUALIZAR PRODUTO
            </v-btn>
          </v-card-actions>

          <!-- Botão secundário - Ir para o programa -->
          <v-card-actions class="px-3 pt-0 pb-3">
            <v-btn
              variant="outlined"
              size="large"
              class="flex-grow-1"
              :color="getProgramTypeColor(offer.program.type)"
              @click="handleGoToProgram(offer)"
            >
              <v-icon size="18" class="me-2">
                {{ getProgramTypeIcon(offer.program.type) }}
              </v-icon>
              {{ offer.program.name.toUpperCase() }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
  interface Ecommerce {
    id: number
    name: string
    logo_url: string | null
    created_at: string
    updated_at: string
  }

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
  }

  interface Program {
    id: number
    name: string
    logo_url: string | null
    link_url: string
    created_at: string
    updated_at: string | null
    value_per_mile?: number
    type: ProgramType
  }

  type ProgramType = 'cashback' | 'points' | 'miles'

  interface OfferItem {
    ecommerce: Ecommerce
    product: Product
    program: Program
    current_value_promotion: number
    selected: boolean
    final_price: string
    discount_percentage: string
    reward_value: string
    created_at: string
    updated_at: string
  }

  interface Props {
    offers: OfferItem[]
  }

  const props = defineProps<Props>()

  // Definir o nome do componente para o auto import
  defineOptions({
    name: 'OffersCards',
  })

  // Estado do filtro
  // const selectedType = ref<ProgramType | null>(null)

  // Opções de filtro
  // const programTypes = [
  //   { title: 'Cashback', value: 'cashback' },
  //   { title: 'Pontos', value: 'points' },
  //   { title: 'Milhas', value: 'miles' }
  // ]

  // Computed para ofertas filtradas
  // const filteredOffers = computed(() => {
  //   if (!selectedType.value) {
  //     return props.offers
  //   }
  //   return props.offers.filter(offer => offer.program.type === selectedType.value)
  // })

  // Computed para total de ofertas
  // const totalOffers = computed(() => {
  //   return filteredOffers.value.length
  // })

  const emit = defineEmits<{
    'view:product': [offer: OfferItem]
    'go:program': [offer: OfferItem]
  }>()

  // Métodos auxiliares
  const handleViewProduct = (offer: OfferItem): void => {
    // Abrir URL do produto em nova aba
    window.open(offer.product.product_url, '_blank')
    emit('view:product', offer)
  }

  const handleGoToProgram = (offer: OfferItem): void => {
    // Usar o link_url do programa da API
    window.open(offer.program.link_url, '_blank')
    emit('go:program', offer)
  }

  const getProgramTypeColor = (type: ProgramType): string => {
    const colors = {
      cashback: 'green',
      points: 'blue',
      miles: 'purple',
    }
    return colors[type] || 'primary'
  }

  const getProgramTypeLabel = (type: ProgramType): string => {
    const labels = {
      cashback: 'Cashback',
      points: 'Pontos',
      miles: 'Milhas',
    }
    return labels[type] || type
  }

  const getProgramTypeIcon = (type: ProgramType): string => {
    const icons = {
      cashback: 'mdi-cash',
      points: 'mdi-star',
      miles: 'mdi-airplane',
    }
    return icons[type] || 'mdi-gift'
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const formatDiscount = (discount: string): string => {
    const discountNum = parseFloat(discount)
    return discountNum % 1 === 0
      ? discountNum.toString()
      : discountNum.toFixed(1)
  }

  const formatBenefit = (offer: OfferItem): string => {
    const rewardValue = parseFloat(offer.reward_value)

    switch (offer.program.type) {
      case 'cashback':
        return `${formatPrice(rewardValue)} de cashback`
      case 'points':
        return `${Math.round(rewardValue)} pontos`
      case 'miles':
        return `${Math.round(rewardValue)} milhas`
      default:
        return `${rewardValue} de desconto`
    }
  }

  const formatReviews = (reviews: number): string => {
    if (reviews >= 1000) {
      return `${Math.floor(reviews / 1000)}k`
    }
    return reviews.toString()
  }
</script>

<style scoped>
  .offers-container {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* .header-section {
  margin-bottom: 32px;
}

.filter-chip {
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.filter-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.filters-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
} */

  .offer-card {
    border-radius: 12px !important;
    transition: all 0.3s ease;
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .offer-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }

  .product-image-container {
    position: relative;
    overflow: hidden;
  }

  .product-image {
    transition: transform 0.3s ease;
  }

  .offer-card:hover .product-image {
    transform: scale(1.05);
  }

  .discount-badge {
    position: absolute;
    top: 8px;
    right: 8px;
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
    border-bottom: 1px solid
      rgba(var(--v-border-color), var(--v-border-opacity));
    padding-bottom: 12px;
  }

  .reward-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .reward-chip {
    align-self: flex-start;
  }

  .selection-overlay {
    background-color: rgba(76, 175, 80, 0.1) !important;
  }

  /* Responsividade */
  @media (max-width: 768px) {
    .offers-container {
      padding: 16px;
    }

    /* .header-section {
    margin-bottom: 24px;
  }

  .filter-chip {
    font-size: 0.75rem;
  } */
  }
  @media (max-width: 600px) {
    .offers-container {
      padding: 12px;
    }

    .offer-card {
      margin-bottom: 16px;
    }

    .product-name {
      font-size: 0.875rem;
    }

    /* .header-section .d-flex {
    flex-direction: column !important;
    align-items: flex-start !important;
  }

  .filter-chip {
    font-size: 0.7rem;
    height: 28px;
  } */
  }

  @media (max-width: 400px) {
    .offer-card {
      border-radius: 8px !important;
    }

    .discount-badge {
      top: 4px;
      right: 4px;
    }
  }
</style>
