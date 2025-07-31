<template>
  <div class="product-image-container">
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

    <!-- Badge de desconto -->
    <DiscountBadge
      v-if="parseFloat(discountPercentage) > 0"
      :discount="discountPercentage"
      class="discount-badge"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
import DiscountBadge from './DiscountBadge.vue'

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
    thumbnails?: string
  }

  interface Props {
    product: Product
    discountPercentage: string
    height?: number | string
  }

  const props = defineProps<Props>()

  // Reactive properties
  const currentImageIndex = ref(0)
  
  const isMobile = computed(() => {
    if (process.client) {
      return window.innerWidth < 768
    }
    return false
  })

  // Parse thumbnails and create image array
  const productImages = computed(() => {
    const images = []
    
    // Always include the main image first
    if (props.product.image_url && props.product.thumbnails?.length === 0) { 
      images.push(props.product.image_url)
    }
    
    // Parse thumbnails if available
    if (props.product.thumbnails) {
      try {
        const thumbnails = JSON.parse(props.product.thumbnails)
        if (Array.isArray(thumbnails)) {
          // Filter out the main image to avoid duplicates
          const additionalImages = thumbnails.filter(thumb => thumb !== props.product.image_url)
          images.push(...additionalImages)
        }
      } catch (error) {
        console.warn('Error parsing thumbnails:', error)
      }
    }
    
    return images
  })


  const imageHeight = computed(() => {
    if (props.height) {
      return props.height
    }
    return isMobile.value ? 200 : 300
  })
</script>

<style scoped>
  .product-image-container {
    position: relative;
    overflow: hidden;
  }

  /* ================================
   IMAGE CAROUSEL
   ================================ */

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

  /* Mobile carousel specific styles */
  @media (max-width: 767px) {
    .product-carousel :deep(.v-carousel__controls) {
      display: none;
    }

    .image-counter {
      bottom: 6px;
      right: 6px;
      padding: 3px 6px;
      font-size: 0.6rem;
      border-radius: 8px;
    }
  }

  /* Desktop styles */
  @media (min-width: 768px) {
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

    .product-image-container:hover .carousel-item {
      transform: scale(1.05);
    }
  }

  /* ================================
   DISCOUNT BADGE
   ================================ */

  .discount-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 6;
  }

  @media (max-width: 400px) {
    .discount-badge {
      top: 4px;
      right: 4px;
    }
  }

  /* ================================
   ACCESSIBILITY & PERFORMANCE
   ================================ */

  @media (prefers-reduced-motion: reduce) {
    .carousel-item,
    .product-carousel :deep(.v-btn--icon) {
      transition: none !important;
    }

    .product-image-container:hover .carousel-item {
      transform: none !important;
    }
  }
</style>
