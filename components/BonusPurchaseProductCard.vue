<template>
  <v-card
    class="product-card h-100"
    :class="{
      'selected-card': isSelected,
      'mobile-card': $vuetify.display.mobile,
      'desktop-card': !$vuetify.display.mobile,
    }"
    :hover="!$vuetify.display.mobile"
    :elevation="isSelected ? 6 : $vuetify.display.mobile ? 1 : 2"
    @click="$vuetify.display.mobile ? $emit('toggle-selection') : null"
  >
    <!-- Selection Overlay for Mobile -->
    <div v-if="$vuetify.display.mobile && isSelected" class="selection-overlay">
      <v-icon color="white" size="large">mdi-check-circle</v-icon>
    </div>

    <!-- Desktop Checkbox -->
    <v-checkbox
      v-if="!$vuetify.display.mobile"
      :model-value="isSelected"
      color="primary"
      density="compact"
      hide-details
      class="product-checkbox-desktop"
      @update:model-value="$emit('toggle-selection')"
      @click.stop
    />

    <!-- Mobile Selection Indicator -->
    <div
      v-if="$vuetify.display.mobile"
      class="mobile-selection-indicator"
      :class="{ selected: isSelected }"
    >
      <v-icon :color="isSelected ? 'primary' : 'grey-lighten-2'" size="small">
        {{
          isSelected
            ? 'mdi-checkbox-marked-circle'
            : 'mdi-checkbox-blank-circle-outline'
        }}
      </v-icon>
    </div>

    <!-- Product Image -->
    <div class="image-container">
      <v-img
        class="product-image"
        cover
        :height="$vuetify.display.mobile ? 140 : 180"
        :src="product.image_url"
        :aspect-ratio="1"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular
              indeterminate
              :size="$vuetify.display.mobile ? 24 : 32"
              width="2"
              color="primary"
            />
          </div>
        </template>
      </v-img>

      <!-- Marketplace Badge -->
      <v-chip
        class="marketplace-badge"
        :color="marketplaceColor"
        :size="$vuetify.display.mobile ? 'x-small' : 'small'"
        variant="flat"
        label
      >
        <span class="marketplace-text text-white font-weight-bold">
          {{ marketplaceText }}
        </span>
      </v-chip>
    </div>

    <!-- Product Content -->
    <v-card-text class="product-content">
      <div class="price-container">
        <span
          class="price-text text-primary font-weight-bold"
          :class="$vuetify.display.mobile ? 'text-body-2' : 'text-h6'"
        >
          {{ formattedPrice }}
        </span>
      </div>

      <h4
        class="product-title font-weight-medium"
        :class="
          $vuetify.display.mobile ? 'text-caption mt-1' : 'text-body-2 mt-2'
        "
      >
        {{ product.name }}
      </h4>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Product } from '~/interfaces/products'

  interface Props {
    product: Product
    isSelected: boolean
  }

  interface Emits {
    (e: 'toggle-selection'): void
  }

  const props = defineProps<Props>()
  defineEmits<Emits>()

  // Computed properties
  const formattedPrice = computed(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(props.product.price)
  })

  const marketplaceColor = computed(() => {
    const colors: Record<string, string> = {
      Amazon: '#FF9900',
      Shopee: '#EE4D2D',
      'Mercado Livre': '#FFF159',
      AliExpress: '#FF6A00',
      Americanas: '#E60014',
    }
    return colors[props.product.ecommerce.name] || '#666'
  })

  const marketplaceText = computed(() => {
    if (process.client && window.innerWidth < 600) {
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
</script>

<style scoped>
  .product-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  }

  .mobile-card {
    cursor: pointer;
    border-radius: 8px;
    min-height: 240px;
  }

  .mobile-card:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }

  .desktop-card {
    cursor: default;
    min-height: 320px;
  }

  .desktop-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
  }

  .selected-card {
    border: 2px solid rgb(var(--v-theme-primary));
    background: rgba(var(--v-theme-primary), 0.02);
  }

  .selected-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      rgb(var(--v-theme-primary)),
      rgb(var(--v-theme-secondary))
    );
    z-index: 1;
  }

  .selection-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(var(--v-theme-primary), 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    border-radius: inherit;
    backdrop-filter: blur(2px);
  }

  .mobile-selection-indicator {
    position: absolute;
    top: 6px;
    left: 6px;
    z-index: 3;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    padding: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
    backdrop-filter: blur(4px);
  }

  .mobile-selection-indicator.selected {
    background: rgba(var(--v-theme-primary), 0.95);
    border: 1px solid rgb(var(--v-theme-primary));
    transform: scale(1.1);
  }

  .product-checkbox-desktop {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 3;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    padding: 4px;
    backdrop-filter: blur(8px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
  }

  .product-checkbox-desktop:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.05);
  }

  .image-container {
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  .product-image {
    transition: transform 0.3s ease;
  }

  .desktop-card:hover .product-image {
    transform: scale(1.02);
  }

  .marketplace-badge {
    position: absolute;
    z-index: 2;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
  }

  @media (max-width: 599px) {
    .marketplace-badge {
      top: 4px;
      right: 4px;
      font-size: 0.6rem !important;
    }
  }

  @media (min-width: 600px) {
    .marketplace-badge {
      top: 8px;
      right: 8px;
    }
  }

  .marketplace-text {
    font-size: 0.7rem;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 599px) {
    .marketplace-text {
      font-size: 0.6rem !important;
      letter-spacing: 0.3px;
    }
  }

  .product-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    background: rgba(var(--v-theme-surface), 1);
  }

  @media (max-width: 599px) {
    .product-content {
      padding: 10px 8px 12px 8px !important;
      gap: 4px;
    }
  }

  @media (min-width: 600px) and (max-width: 959px) {
    .product-content {
      padding: 12px 10px 14px 10px !important;
      gap: 6px;
    }
  }

  @media (min-width: 960px) {
    .product-content {
      padding: 16px 14px 18px 14px !important;
      gap: 8px;
    }
  }

  .price-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .price-text {
    line-height: 1.2;
    text-shadow: 0 1px 2px rgba(var(--v-theme-primary), 0.1);
  }

  .product-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
    color: rgba(var(--v-theme-on-surface), 0.87);
    transition: color 0.2s ease;
    min-height: 2.6em;
  }

  .product-card:hover .product-title {
    color: rgba(var(--v-theme-on-surface), 1);
  }

  @media (max-width: 599px) {
    .product-title {
      line-height: 1.2;
      font-size: 0.75rem !important;
      min-height: 2.4em;
    }

    .price-text {
      font-size: 0.875rem !important;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .product-card,
    .product-image,
    .mobile-selection-indicator,
    .product-checkbox-desktop {
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
    outline: 2px solid rgb(var(--v-theme-primary));
    outline-offset: 2px;
  }

  @media (max-width: 599px) {
    .mobile-selection-indicator {
      min-width: 24px;
      min-height: 24px;
    }

    .product-card {
      min-height: 240px;
    }
  }

  @media (prefers-color-scheme: dark) {
    .product-checkbox-desktop {
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .mobile-selection-indicator {
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .marketplace-badge {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    }
  }
</style>
