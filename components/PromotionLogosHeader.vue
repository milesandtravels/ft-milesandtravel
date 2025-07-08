<template>
  <div class="logos-header mb-4">
    <div class="d-flex justify-space-between align-center">
      <PromotionLogoSection
        :logo-url="ecommerce.logo_url"
        :name="ecommerce.name"
        :alt="ecommerce.name"
        label="E-commerce"
        fallback-icon="mdi-store"
      />

      <div class="vs-divider mx-3">
        <v-icon icon="mdi-plus" size="16" color="grey-lighten-1"></v-icon>
      </div>

      <PromotionLogoSection
        :logo-url="program.logo_url"
        :name="formatters.toTitleCase(program.name)"
        :alt="program.name"
        label="Programa"
        fallback-icon="mdi-card-giftcard"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Ecommerce } from '~/interfaces/ecommerces'
  import type { Program } from '~/interfaces/program'

  interface Props {
    ecommerce: Ecommerce
    program: Program
  }

  defineProps<Props>()
</script>

<style scoped>
  .logos-header {
    background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
    padding: 20px;
    border-radius: 16px;
    margin: -24px -24px 20px -24px;
  }

  .vs-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }

  /* Responsive */
  @media (max-width: 600px) {
    .logos-header {
      padding: 16px;
      margin: -24px -24px 16px -24px;
    }

    .vs-divider {
      width: 32px;
      height: 32px;
      margin: 0 12px;
    }
  }

  /* Dark theme */
  .v-theme--dark .logos-header {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.05) 0%,
      rgba(255, 255, 255, 0.02) 100%
    );
  }

  .v-theme--dark .vs-divider {
    background: rgba(255, 255, 255, 0.08);
  }
</style>
