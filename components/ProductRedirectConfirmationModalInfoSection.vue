<template>
  <div class="product-info-section" :class="sectionClasses">
    <div class="product-container">
      <div class="product-image-wrapper" :class="imageWrapperClasses">
        <v-img
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          class="product-image"
          cover
          :aspect-ratio="1"
        >
          <template v-slot:placeholder>
            <div class="image-placeholder">
              <v-icon :size="iconSize" color="grey-lighten-2">
                mdi-package-variant
              </v-icon>
            </div>
          </template>
        </v-img>
        <div v-else class="image-placeholder">
          <v-icon :size="iconSize" color="grey-lighten-2">
            mdi-package-variant
          </v-icon>
        </div>
      </div>

      <div class="product-details">
        <h4 class="product-name" :class="nameClasses">
          {{ product.name }}
        </h4>
        <div
          v-if="product.ecommerce"
          class="ecommerce-info"
          :class="ecommerceClasses"
        >
          <v-icon :size="ecommerceIconSize" color="primary" class="me-1">
            mdi-store
          </v-icon>
          <span class="ecommerce-name">{{ product.ecommerce }}</span>
        </div>
        <div class="link-info" :class="linkInfoClasses">
          <v-icon :size="linkIconSize" color="warning" class="me-1">
            mdi-link-variant
          </v-icon>
          <span class="link-text">Link de referência</span>
        </div>
      </div>
    </div>
  </div>
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
    product: Product
  }

  defineProps<Props>()

  const { xs, sm } = useDisplay()

  const sectionClasses = computed(() => ({
    'mb-4': xs.value,
    'mb-5': sm.value,
    'mb-6': !xs.value && !sm.value,
  }))

  const imageWrapperClasses = computed(() => ({
    'mobile-image-wrapper': xs.value,
    'tablet-image-wrapper': sm.value,
    'desktop-image-wrapper': !xs.value && !sm.value,
  }))

  const nameClasses = computed(() => ({
    'text-subtitle-1': xs.value,
    'text-h6': !xs.value,
  }))

  const ecommerceClasses = computed(() => ({
    'text-caption': xs.value,
    'text-body-2': !xs.value,
  }))

  const linkInfoClasses = computed(() => ({
    'text-caption': xs.value,
    'text-body-2': !xs.value,
  }))

  const iconSize = computed(() => (xs.value ? 32 : 40))
  const ecommerceIconSize = computed(() => (xs.value ? 14 : 16))
  const linkIconSize = computed(() => (xs.value ? 14 : 16))
</script>

<style scoped>
  .product-info-section {
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-surface-variant), 0.08) 0%,
      rgba(var(--v-theme-surface-variant), 0.04) 100%
    );
    border: 1px solid rgba(var(--v-theme-outline), 0.08);
    border-radius: 12px;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  .product-info-section::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(
      180deg,
      rgb(var(--v-theme-primary)) 0%,
      rgba(var(--v-theme-primary), 0.7) 100%
    );
    border-radius: 0 2px 2px 0;
  }

  .product-container {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }

  .product-image-wrapper {
    flex-shrink: 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(var(--v-theme-outline), 0.12);
    background: rgba(var(--v-theme-surface), 0.8);
  }

  .mobile-image-wrapper {
    width: 60px;
    height: 60px;
  }

  .tablet-image-wrapper {
    width: 70px;
    height: 70px;
  }

  .desktop-image-wrapper {
    width: 80px;
    height: 80px;
  }

  .product-image {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }

  .image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(var(--v-theme-surface-variant), 0.3);
  }

  .product-details {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .product-name {
    font-weight: 600;
    color: rgba(var(--v-theme-on-surface), 0.9);
    margin: 0;
    line-height: 1.3;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .ecommerce-info,
  .link-info {
    display: flex;
    align-items: center;
    color: rgba(var(--v-theme-on-surface), 0.7);
  }

  .ecommerce-name,
  .link-text {
    font-weight: 500;
  }

  .link-text {
    color: rgba(var(--v-theme-warning), 0.8);
  }

  /* Responsividade para mobile */
  @media (max-width: 600px) {
    .product-info-section {
      padding: 16px;
    }

    .product-container {
      gap: 12px;
    }

    .product-details {
      gap: 6px;
    }
  }

  /* Modo escuro */
  @media (prefers-color-scheme: dark) {
    .product-info-section {
      background: linear-gradient(
        135deg,
        rgba(var(--v-theme-surface-bright), 0.05) 0%,
        rgba(var(--v-theme-surface-bright), 0.02) 100%
      );
      border-color: rgba(var(--v-theme-outline), 0.06);
    }

    .product-image-wrapper {
      border-color: rgba(var(--v-theme-outline), 0.08);
      background: rgba(var(--v-theme-surface-bright), 0.1);
    }

    .product-name {
      color: rgba(var(--v-theme-on-surface), 0.85);
    }

    .ecommerce-info,
    .link-info {
      color: rgba(var(--v-theme-on-surface), 0.65);
    }
  }
</style>
