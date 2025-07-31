<template>
  <div class="reward-section">
    <v-card
      variant="outlined"
      class="program-header-card pa-2 mb-2"
      elevation="0"
    >
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <BaseLogoAvatar
            v-if="offer.program.logo_url"
            :src="offer.program.logo_url"
            :alt="offer.program.name"
            size="sm"
            class="mr-3"
            :type="offer.program.type"
          />

          <div class="program-info">
            <div class="program-name">
              {{ formatters.toTitleCase(offer.program.name) }}
            </div>
            <v-chip
              size="x-small"
              variant="tonal"
              color="primary"
              class="program-badge"
            >
              Programa Parceiro
            </v-chip>
          </div>
        </div>
        <v-btn
          icon="mdi-information-outline"
          variant="text"
          size="small"
          color="primary"
          class="info-btn"
        />
      </div>
    </v-card>

    <v-card
      variant="tonal"
      :color="getRewardColor(offer.program.type)"
      class="reward-value-card pa-2"
      elevation="0"
    >
      <div class="d-flex align-center justify-space-between">
        <div>
          <v-chip
            :color="getRewardColor(offer.program.type)"
            variant="flat"
            size="small"
            class="mb-1"
          >
            <v-icon
              :icon="getRewardIcon(offer.program.type)"
              size="14"
              class="me-1"
            />
            {{ getRewardLabel(offer.program.type) }}
          </v-chip>
          <div class="reward-value-text">
            {{ formatBenefit(offer) }}
          </div>
        </div>
        <v-icon
          :icon="getRewardIcon(offer.program.type)"
          :color="getRewardColor(offer.program.type)"
          size="24"
          class="reward-icon"
        />
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  import type { OfferItem } from '~/interfaces/offers'
  import { formatters } from '~/utils/formatter'

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
        return formatPrice(rewardValue)
      case 'points':
        return `${Math.round(rewardValue).toLocaleString('pt-BR')}`
      case 'miles':
        return `${Math.round(rewardValue).toLocaleString('pt-BR')}`
      default:
        return `${rewardValue}`
    }
  }

  const getRewardColor = (type: string): string => {
    const colors = {
      cashback: 'success',
      points: 'primary',
      miles: 'secondary',
    }
    return colors[type as keyof typeof colors] || 'primary'
  }

  const getRewardIcon = (type: string): string => {
    const icons = {
      cashback: 'mdi-cash-multiple',
      points: 'mdi-star-circle',
      miles: 'mdi-airplane-takeoff',
    }
    return icons[type as keyof typeof icons] || 'mdi-gift'
  }

  const getRewardLabel = (type: string): string => {
    const labels = {
      cashback: 'Cashback',
      points: 'Pontos',
      miles: 'Milhas',
    }
    return labels[type as keyof typeof labels] || 'Desconto'
  }
</script>

<style scoped>
  .reward-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .reward-chip {
    align-self: flex-start;
  }

  .program-header-card {
    border-radius: 12px;
    border: 1px solid rgba(var(--v-theme-primary), 0.12);
    background: rgba(var(--v-theme-surface), 0.9);
    transition: all 0.2s ease-in-out;
  }

  .program-header-card:hover {
    border-color: rgba(var(--v-theme-primary), 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.1);
  }

  .program-avatar {
    border: 2px solid rgba(var(--v-theme-primary), 0.1);
    transition: transform 0.2s ease-in-out;
    object-fit: contain !important;
  }

  .program-avatar:hover {
    transform: scale(1.05);
  }

  .program-info {
    flex: 1;
    min-width: 0;
  }

  .program-name {
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.3;
    color: rgba(var(--v-theme-on-surface), 0.95);
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .program-badge {
    font-size: 0.7rem;
    height: 18px;
    font-weight: 500;
  }

  .info-btn {
    opacity: 0.7;
    transition: opacity 0.2s ease-in-out;
  }

  .info-btn:hover {
    opacity: 1;
  }

  .reward-value-card {
    border-radius: 10px;
    transition: transform 0.2s ease-in-out;
  }

  .reward-value-card:hover {
    transform: translateY(-2px);
  }

  .reward-value-text {
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.2;
    color: rgba(var(--v-theme-on-surface), 0.95);
  }

  .reward-icon {
    opacity: 0.7;
  }

  /* Mobile optimizations */
  @media (max-width: 600px) {
    .reward-section {
      gap: 4px;
    }

    .reward-value-text {
      font-size: 1.125rem;
    }

    .reward-value-card {
      padding: 10px !important;
    }

    .program-header-card {
      padding: 10px !important;
      margin-bottom: 8px !important;
    }

    .program-name {
      font-size: 0.875rem;
    }

    .program-badge {
      font-size: 0.65rem;
      height: 16px;
    }

    .info-btn {
      display: none;
    }
  }

  /* Performance optimizations - reduce repaints */
  .reward-value-card,
  .program-header-card,
  .program-avatar {
    will-change: transform;
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    .program-header-card,
    .program-avatar,
    .reward-value-card,
    .info-btn {
      transition: none;
    }
  }
</style>
