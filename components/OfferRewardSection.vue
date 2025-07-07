<template>
  <div class="reward-section">
    <div class="d-flex align-center mb-2">
      <v-avatar v-if="offer.program.logo_url" size="20" class="me-2">
        <v-img :src="offer.program.logo_url" :alt="offer.program.name" />
      </v-avatar>
      <span class="text-caption font-weight-medium">
        {{ offer.program.name }}
      </span>
    </div>

    <ProgramTypeChip
      :type="offer.program.type"
      variant="tonal"
      show-icon
      class="reward-chip"
    >
      {{ formatBenefit(offer) }}
    </ProgramTypeChip>
  </div>
</template>

<script setup lang="ts">
  import type { OfferItem } from '~/interfaces/offers'

  interface Props {
    offer: OfferItem
  }

  defineProps<Props>()

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
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
</script>

<style scoped>
  .reward-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .reward-chip {
    align-self: flex-start;
  }
</style>
