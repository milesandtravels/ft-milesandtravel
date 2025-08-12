<template>
  <v-card
    class="product-card"
    :class="cardClasses"
    :elevation="cardElevation"
    @click="handleCardClick"
  >
    <!-- Selection States -->
    <div v-if="isSelected && isMobile" class="selection-overlay">
      <div class="selection-check">
        <v-icon color="white" size="x-large">mdi-check-circle</v-icon>
      </div>
    </div>

    <!-- Desktop Selection Checkbox -->
    <v-checkbox
      v-if="!isMobile"
      :model-value="isSelected"
      color="primary"
      density="compact"
      hide-details
      class="desktop-checkbox"
      @update:model-value="$emit('toggle-selection')"
      @click.stop
    />

    <!-- Mobile Selection Indicator -->
    <div
      v-if="isMobile"
      class="mobile-selection-indicator"
      :class="{ active: isSelected }"
    >
      <v-icon :color="selectionIconColor" size="small">
        {{ selectionIcon }}
      </v-icon>
    </div>

    <!-- Product Image Section -->
    <div class="image-section">
      <!-- Image Carousel -->
      <div class="image-carousel">
        <v-carousel
          v-model="currentImageIndex"
          :height="imageHeight"
          hide-delimiters
          :show-arrows="showCarouselArrows"
          :cycle="false"
          class="product-carousel"
        >
          <v-carousel-item
            v-for="(image, index) in productImages"
            :key="index"
            :src="image"
            class="carousel-item"
          >
            <template #placeholder>
              <div class="image-placeholder">
                <v-progress-circular
                  indeterminate
                  :size="isMobile ? 20 : 28"
                  width="2"
                  color="primary"
                />
              </div>
            </template>
          </v-carousel-item>
        </v-carousel>

        <!-- Image Counter -->
        <div v-if="productImages.length > 1" class="image-counter">
          <span class="counter-text">
            {{ currentImageIndex + 1 }}/{{ productImages.length }}
          </span>
        </div>
      </div>

      <!-- Custom Product Badge -->
      <v-chip
        v-if="product.isCustomProduct"
        class="custom-badge"
        color="success"
        variant="flat"
        size="x-small"
        label
      >
        <v-icon start size="x-small">mdi-star</v-icon>
        <span class="custom-text">Personalizado</span>
      </v-chip>
    </div>

    <!-- Product Content -->
    <v-card-text class="product-content">
      <!-- Price Section -->
      <div class="price-section">
        <span class="price-text">
          {{ formattedPrice }}
        </span>
      </div>

      <!-- Product Title -->
      <h4 class="product-title">
        {{ product.name }}
      </h4>

      <!-- Rating and Reviews -->
      <div v-if="hasRating" class="rating-section">
        <div class="rating-stars">
          <v-icon
            v-for="star in 5"
            :key="star"
            :color="
              star <= Math.floor(numericRating) ? 'amber' : 'grey-lighten-2'
            "
            size="x-small"
            class="star-icon"
          >
            mdi-star
          </v-icon>
          <span class="rating-value">{{ formattedRating }}</span>
        </div>
        <span v-if="product.reviews > 0" class="reviews-count">
          ({{ formattedReviews }})
        </span>
      </div>

      <!-- Marketplace Info -->
      <div class="marketplace-info-section">
        <div class="marketplace-details">
          <BaseLogoAvatar
            :src="product.ecommerce.logo_url"
            :alt="product.ecommerce.name"
            :size="isMobile ? 'xs' : 'sm'"
            :type="'points'"
            class="marketplace-avatar"
          />
          <div class="marketplace-text">
            <span class="marketplace-name">{{ product.ecommerce.name }}</span>
            <span class="marketplace-category">{{
              product.ecommerce.category
            }}</span>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div class="action-section">
        <v-btn
          color="primary"
          variant="flat"
          :size="isMobile ? 'small' : 'default'"
          class="visit-store-btn"
          block
          @click.stop="handleViewProduct"
        >
          <v-icon start :size="isMobile ? 'small' : 'default'"
            >mdi-open-in-new</v-icon
          >
          Ver produto
        </v-btn>
      </div>
    </v-card-text>
  </v-card>

  <ProductRedirectConfirmationModal
    v-model="showProductRedirectModal"
    :product="productData"
    @confirm="handleProductRedirect"
    @cancel="handleProductCancel"
  />
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue'

  // Interfaces atualizadas
  interface Ecommerce {
    id: number
    name: string
    logo_url: string
    category: string
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
    ecommerce: Ecommerce
    isCustomProduct: boolean
    selected: boolean
    thumbnails?: string
  }

  interface Props {
    product: Product
    isSelected: boolean
  }

  interface Emits {
    (e: 'toggle-selection'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // Reactive properties
  const currentImageIndex = ref(0)
  const showProductRedirectModal = ref(false)

  const isMobile = computed(() => {
    if (process.client) {
      return window.innerWidth < 768
    }
    return false
  })

  const productData = computed(() => ({
    id: props.product.id.toString() || '',
    name: props.product.name || 'Produto sem nome',
    image: props.product.image_url || '',
    ecommerce: props.product.ecommerce.name || 'E-commerce não informado',
    url: props.product.product_url || '',
  }))

  const handleViewProduct = (): void => {
    showProductRedirectModal.value = true
  }

  const handleProductRedirect = (): void => {
    window.open(props.product.product_url, '_blank', 'noopener,noreferrer')
    showProductRedirectModal.value = false
  }

  const handleProductCancel = (): void => {
    showProductRedirectModal.value = false
  }

  // Parse thumbnails and create image array
  const productImages = computed(() => {
    const images = []

    if (props.product.image_url && props.product.thumbnails?.length === 0) {
      images.push(props.product.image_url)
    }

    // Parse thumbnails if available
    if (props.product.thumbnails) {
      try {
        const thumbnails = JSON.parse(props.product.thumbnails)
        if (Array.isArray(thumbnails)) {
          // Filter out the main image to avoid duplicates
          const additionalImages = thumbnails.filter(
            thumb => thumb !== props.product.image_url
          )
          images.push(...additionalImages)
        }
      } catch (error) {
        console.warn('Error parsing thumbnails:', error)
      }
    }

    return images.length > 0 ? images : [props.product.image_url]
  })

  const showCarouselArrows = computed(() => {
    return productImages.value.length > 1 && !isMobile.value
  })

  // Computed properties
  const formattedPrice = computed(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(props.product.price)
  })

  const marketplaceDisplayName = computed(() => {
    return props.product.ecommerce.name
  })

  const numericRating = computed(() => {
    return parseFloat(props.product.rating) || 0
  })

  const formattedRating = computed(() => {
    return numericRating.value.toFixed(1)
  })

  const formattedReviews = computed(() => {
    const reviews = props.product.reviews
    if (reviews > 1000) {
      return `${(reviews / 1000).toFixed(1)}k`
    }
    return reviews.toString()
  })

  const hasRating = computed(() => {
    return numericRating.value > 0
  })

  const hasDiscount = computed(() => {
    // Lógica para determinar se há desconto (exemplo)
    return Math.random() > 0.7 // 30% chance de ter desconto
  })

  const selectionIcon = computed(() => {
    return props.isSelected
      ? 'mdi-checkbox-marked-circle'
      : 'mdi-checkbox-blank-circle-outline'
  })

  const selectionIconColor = computed(() => {
    return props.isSelected ? 'primary' : 'grey-lighten-2'
  })

  const cardClasses = computed(() => ({
    'mobile-card': isMobile.value,
    'desktop-card': !isMobile.value,
    'selected-card': props.isSelected,
    'custom-product': props.product.isCustomProduct,
  }))

  const cardElevation = computed(() => {
    if (props.isSelected) return 8
    return isMobile.value ? 2 : 3
  })

  const imageHeight = computed(() => {
    return isMobile.value ? 120 : 200
  })

  // Methods
  const handleCardClick = () => {
    if (isMobile.value) {
      emit('toggle-selection')
    }
  }
</script>

<style scoped>
  /* ================================
   BASE STYLES - MOBILE FIRST
   ================================ */

  .product-card {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgb(var(--v-theme-surface));
    min-height: 280px;
  }

  /* ================================
   MOBILE STYLES (DEFAULT)
   ================================ */

  .mobile-card {
    min-height: 280px;
    border-radius: 12px;
  }

  .mobile-card:active {
    transform: scale(0.97);
    transition: transform 0.15s ease;
  }

  /* Mobile carousel specific styles */
  .mobile-card .product-carousel :deep(.v-carousel__controls) {
    display: none;
  }

  .mobile-card .image-counter {
    bottom: 6px;
    right: 6px;
    padding: 3px 6px;
    font-size: 0.6rem;
    border-radius: 8px;
  }

  /* ================================
   SELECTION STATES
   ================================ */

  .selected-card {
    border-color: rgb(var(--v-theme-primary));
    background: rgba(var(--v-theme-primary), 0.03);
    transform: scale(1.02);
  }

  .selection-overlay {
    position: absolute;
    inset: 0;
    background: rgba(var(--v-theme-primary), 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    backdrop-filter: blur(2px);
  }

  .selection-check {
    background: rgba(var(--v-theme-primary), 0.9);
    border-radius: 50%;
    padding: 8px;
    animation: bounceIn 0.3s ease;
  }

  .mobile-selection-indicator {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 5;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    padding: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.25s ease;
    backdrop-filter: blur(8px);
  }

  .mobile-selection-indicator.active {
    background: rgba(var(--v-theme-primary), 0.95);
    transform: scale(1.15);
    box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.3);
  }

  /* ================================
   IMAGE SECTION
   ================================ */

  .image-section {
    position: relative;
  }

  .image-carousel {
    position: relative;
    width: 100%;
  }

  .product-carousel {
    border-radius: 0;
    overflow: hidden;
  }

  .product-carousel :deep(.v-carousel__controls) {
    background: transparent;
  }

  .product-carousel :deep(.v-btn--icon) {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    width: 32px;
    height: 32px;
  }

  .product-carousel :deep(.v-btn--icon:hover) {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.05);
  }

  .carousel-item {
    transition: transform 0.3s ease;
  }

  .carousel-item :deep(.v-img__img) {
    object-fit: contain !important;
    background: rgba(var(--v-theme-surface), 1);
  }

  .carousel-item :deep(.v-responsive__content) {
    background: rgba(var(--v-theme-surface), 1);
  }

  .image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: rgba(var(--v-theme-on-surface), 0.05);
  }

  .image-counter {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.65rem;
    font-weight: 600;
    backdrop-filter: blur(8px);
    z-index: 5;
  }

  .counter-text {
    line-height: 1;
  }

  .custom-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    font-size: 0.65rem !important;
    font-weight: 700;
    z-index: 4;
  }

  .custom-text {
    font-size: 0.65rem;
    font-weight: 700;
  }

  /* ================================
   CONTENT SECTION
   ================================ */

  .product-content {
    padding: 12px !important;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .price-section {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .price-text {
    font-size: 1rem;
    font-weight: 700;
    color: rgb(var(--v-theme-primary));
    line-height: 1.2;
  }

  .discount-chip {
    font-size: 0.6rem !important;
    height: 18px !important;
    font-weight: 700;
  }

  .product-title {
    font-size: 0.8rem;
    font-weight: 500;
    line-height: 1.3;
    color: rgba(var(--v-theme-on-surface), 0.9);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 2.6em;
    margin: 0;
  }

  .rating-section {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 2px;
  }

  .rating-stars {
    display: flex;
    align-items: center;
    gap: 1px;
  }

  .star-icon {
    opacity: 0.9;
  }

  .rating-value {
    font-size: 0.7rem;
    font-weight: 600;
    color: rgba(var(--v-theme-on-surface), 0.8);
    margin-left: 4px;
  }

  .reviews-count {
    font-size: 0.65rem;
    color: rgba(var(--v-theme-on-surface), 0.6);
    font-weight: 500;
  }

  .marketplace-info-section {
    margin-top: 6px;
    padding-top: 8px;
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  }

  .marketplace-details {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .marketplace-avatar {
    flex-shrink: 0;
  }

  .marketplace-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    flex: 1;
  }

  .marketplace-name {
    font-size: 0.75rem;
    color: rgba(var(--v-theme-on-surface), 0.9);
    font-weight: 600;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .marketplace-category {
    font-size: 0.65rem;
    color: rgba(var(--v-theme-on-surface), 0.6);
    font-weight: 500;
    line-height: 1.1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .action-section {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  }

  .visit-store-btn {
    font-size: 0.75rem !important;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0.3px;
    transition: all 0.25s ease;
  }

  .visit-store-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
  }

  .mobile-quick-action {
    padding: 8px 12px 12px;
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  }

  .quick-action-btn {
    font-size: 0.7rem !important;
    height: 32px !important;
    font-weight: 600;
  }

  /* ================================
   DESKTOP STYLES (768px+)
   ================================ */

  @media (min-width: 768px) {
    .desktop-card {
      min-height: 380px;
      cursor: default;
      border-radius: 16px;
    }

    .desktop-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
    }

    .desktop-card:hover .carousel-item {
      transform: scale(1.05);
    }

    .product-carousel :deep(.v-btn--icon) {
      width: 36px;
      height: 36px;
    }

    .image-counter {
      bottom: 12px;
      right: 12px;
      padding: 6px 10px;
      font-size: 0.7rem;
    }

    .desktop-checkbox {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 5;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      padding: 6px;
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      transition: all 0.25s ease;
    }

    .desktop-checkbox:hover {
      background: rgba(255, 255, 255, 1);
      transform: scale(1.08);
    }

    .product-content {
      padding: 16px !important;
      gap: 10px;
    }

    .price-text {
      font-size: 1.25rem;
    }

    .product-title {
      font-size: 0.9rem;
      min-height: 2.8em;
    }

    .visit-store-btn {
      font-size: 0.8rem !important;
    }

    .action-buttons {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
    }

    .view-btn {
      font-size: 0.75rem !important;
      font-weight: 600;
    }
  }

  /* ================================
   LARGE DESKTOP (1200px+)
   ================================ */

  @media (min-width: 1200px) {
    .desktop-card {
      min-height: 420px;
    }

    .product-content {
      padding: 20px !important;
      gap: 12px;
    }

    .price-text {
      font-size: 1.4rem;
    }

    .product-title {
      font-size: 1rem;
    }

    .visit-store-btn {
      font-size: 0.85rem !important;
    }
  }

  /* ================================
   ANIMATIONS & INTERACTIONS
   ================================ */

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .custom-product {
    border-color: rgba(var(--v-theme-success), 0.5);
  }

  .custom-product::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      rgb(var(--v-theme-success)),
      rgb(var(--v-theme-success-lighten-1))
    );
    z-index: 1;
  }

  /* ================================
   ACCESSIBILITY & PERFORMANCE
   ================================ */

  @media (prefers-reduced-motion: reduce) {
    .product-card,
    .product-image,
    .mobile-selection-indicator,
    .desktop-checkbox {
      transition: none !important;
    }

    .desktop-card:hover {
      transform: none !important;
    }

    .desktop-card:hover .carousel-item {
      transform: none !important;
    }
  }

  .product-card:focus-visible {
    outline: 3px solid rgb(var(--v-theme-primary));
    outline-offset: 2px;
  }

  /* ================================
   DARK THEME SUPPORT
   ================================ */

  @media (prefers-color-scheme: dark) {
    .desktop-checkbox,
    .mobile-selection-indicator {
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .marketplace-info-section {
      border-color: rgba(255, 255, 255, 0.08);
    }

    .mobile-quick-action {
      border-color: rgba(255, 255, 255, 0.08);
    }
  }
</style>
