<template>
  <div class="marketplace-badge">
    <v-chip
      class="marketplace-chip"
      :color="getMarketplaceColor(marketplace)"
      size="small"
      variant="flat"
    >
      <v-icon left size="16">{{ getMarketplaceIcon(marketplace) }}</v-icon>
      {{ marketplace }}
    </v-chip>
  </div>
</template>

<script setup lang="ts">
  // Types
  type Marketplace =
    | 'Amazon'
    | 'Shopee'
    | 'Mercado Livre'
    | 'AliExpress'
    | 'Americanas'

  // Props
  interface Props {
    marketplace: Marketplace
  }

  defineProps<Props>()

  // Marketplace configuration
  const marketplaceColors: Record<Marketplace, string> = {
    Amazon: '#FF9900',
    Shopee: '#EE4D2D',
    'Mercado Livre': '#FFF159',
    AliExpress: '#FF6A00',
    Americanas: '#E60014',
  }

  const marketplaceIcons: Record<Marketplace, string> = {
    Amazon: 'mdi-amazon',
    Shopee: 'mdi-shopping',
    'Mercado Livre': 'mdi-cart',
    AliExpress: 'mdi-shopping-outline',
    Americanas: 'mdi-store',
  }

  // Functions
  const getMarketplaceColor = (marketplace: Marketplace): string => {
    return marketplaceColors[marketplace]
  }

  const getMarketplaceIcon = (marketplace: Marketplace): string => {
    return marketplaceIcons[marketplace] || 'mdi-shopping'
  }
</script>

<style scoped>
  .marketplace-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 2;
  }

  .marketplace-chip {
    font-weight: 600;
    font-size: 0.75rem;
    color: white !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  /* Responsive adjustments */
  @media (max-width: 600px) {
    .marketplace-badge {
      top: 8px;
      left: 8px;
    }
  }
</style>
