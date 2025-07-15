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
      <v-img
        class="product-image"
        :src="product.image_url"
        :height="imageHeight"
        cover
        :aspect-ratio="1"
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
      </v-img>

      <!-- Marketplace Logo Badge -->
      <div class="marketplace-badge">
        <v-avatar :size="isMobile ? 32 : 36" class="marketplace-logo">
          <v-icon size="small">mdi-store</v-icon>
        </v-avatar>
        <div v-if="!isMobile" class="marketplace-info">
          <span class="marketplace-name">{{ product.ecommerce.name }}</span>
          <span class="marketplace-category">{{
            product.ecommerce.category
          }}</span>
        </div>
        <!-- Mobile: Mostrar apenas logo maior -->
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
        <v-chip
          v-if="hasDiscount"
          color="error"
          variant="flat"
          size="x-small"
          class="discount-chip"
        >
          -15%
        </v-chip>
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

      <!-- Ecommerce Info (Mobile Only) -->
      <div v-if="isMobile" class="ecommerce-info">
        <span class="ecommerce-category">{{ product.ecommerce.category }}</span>
        <span class="ecommerce-name">{{ marketplaceDisplayName }}</span>
      </div>

      <!-- Action Buttons (Desktop) -->
      <div v-if="!isMobile" class="action-buttons">
        <v-btn
          variant="outlined"
          size="small"
          color="primary"
          class="view-btn"
          :href="product.product_url"
          target="_blank"
          @click.stop
        >
          <v-icon start size="small">mdi-eye</v-icon>
          Ver produto
        </v-btn>
      </div>
    </v-card-text>

    <!-- Quick Action (Mobile) -->
    <div v-if="isMobile" class="mobile-quick-action" @click.stop>
      <v-btn
        :href="product.product_url"
        target="_blank"
        variant="text"
        size="small"
        color="primary"
        block
        class="quick-action-btn"
      >
        <v-icon start size="small">mdi-open-in-new</v-icon>
        Ver no {{ marketplaceDisplayName }}
      </v-btn>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'

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
  const isMobile = computed(() => {
    if (process.client) {
      return window.innerWidth < 768
    }
    return false
  })

  // Computed properties
  const formattedPrice = computed(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(props.product.price)
  })

  const marketplaceDisplayName = computed(() => {
    if (isMobile.value) {
      const abbreviations: Record<string, string> = {
        'Mercado Livre': 'ML',
        AliExpress: 'Ali',
        Americanas: 'Ame',
        Amazon: 'AMZ',
        Shopee: 'SHP',
      }
      return (
        abbreviations[props.product.ecommerce.name] ||
        props.product.ecommerce.name.substring(0, 3).toUpperCase()
      )
    }
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

  .product-image {
    transition: transform 0.3s ease;
  }

  .image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: rgba(var(--v-theme-on-surface), 0.05);
  }

  .marketplace-badge {
    position: absolute;
    bottom: 12px;
    left: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(0, 0, 0, 0.9);
    border-radius: 28px;
    padding: 8px;
    backdrop-filter: blur(12px);
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    transition: all 0.3s ease;
  }

  .marketplace-badge:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
  }

  .marketplace-logo {
    border: 2px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    background: white;
  }

  .marketplace-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-right: 8px;
  }

  .marketplace-name {
    color: white;
    font-size: 0.85rem;
    font-weight: 700;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
    letter-spacing: 0.3px;
    line-height: 1.1;
  }

  .marketplace-category {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.65rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
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

  .ecommerce-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
    padding-top: 6px;
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  }

  .ecommerce-category {
    font-size: 0.65rem;
    color: rgba(var(--v-theme-on-surface), 0.6);
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .ecommerce-name {
    font-size: 0.7rem;
    color: rgba(var(--v-theme-on-surface), 0.8);
    font-weight: 600;
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

    .desktop-card:hover .product-image {
      transform: scale(1.05);
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

    .action-buttons {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
    }

    .view-btn {
      font-size: 0.75rem !important;
      font-weight: 600;
    }

    .marketplace-badge {
      padding: 6px 12px;
    }

    .marketplace-name {
      font-size: 0.75rem;
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

    .desktop-card:hover .product-image {
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

    .marketplace-badge {
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .ecommerce-info {
      border-color: rgba(255, 255, 255, 0.08);
    }

    .mobile-quick-action {
      border-color: rgba(255, 255, 255, 0.08);
    }
  }
</style>
