<template>
  <v-card
    class="campaign-card"
    :class="{ 'campaign-expired': isExpired }"
    elevation="2"
    rounded="xl"
  >
    <!-- Header com benefício principal -->
    <div class="benefit-header">
      <div class="d-flex align-center justify-space-between">
        <div>
          <div class="d-flex align-center gap-2 mb-1">
            <v-icon 
              :icon="getCampaignTypeIcon()" 
              :color="getCampaignTypeColor()" 
              size="18"
            ></v-icon>
            <span class="text-body-2 font-weight-medium text-medium-emphasis">
              {{ getCampaignTypeLabel() }}
            </span>
          </div>
          <div class="benefit-value">
            <span class="text-h5 font-weight-bold" :class="`text-${getValueColor()}`">
              {{ formattedValue }}
            </span>
            <span class="text-body-2 text-medium-emphasis ml-1">
              {{ getValueDescription() }}
            </span>
          </div>
        </div>
        
        <v-chip
          v-if="!isExpired"
          :color="getUrgencyColor()"
          variant="tonal"
          size="small"
          class="font-weight-medium"
        >
          <v-icon start icon="mdi-clock-fast" size="12"></v-icon>
          {{ getDaysRemaining() }}
        </v-chip>
        <v-chip
          v-else
          color="error"
          variant="flat"
          size="small"
          class="font-weight-medium"
        >
          <v-icon start icon="mdi-clock-remove" size="12"></v-icon>
          Expirada
        </v-chip>
      </div>
    </div>

    <!-- Seção das logos -->
    <div class="logos-section">
      <!-- Layout para Transferência Bonificada (origem → destino) -->
      <div v-if="campaign.type === 'bonus_transfer'" class="transfer-flow">
        <!-- Origin -->
        <div class="program-item">
          <div class="logo-container">
            <v-img
              :src="campaign.program_origin.logo_url"
              :alt="campaign.program_origin.name"
              contain
              height="48"
              max-width="72"
            >
              <template v-slot:error>
                <div class="logo-fallback">
                  <v-icon :icon="getOriginFallbackIcon()" size="24" :color="getCampaignTypeColor()"></v-icon>
                </div>
              </template>
            </v-img>
          </div>
          <p class="program-name">{{ campaign.program_origin.name }}</p>
          <p class="program-label">ORIGEM</p>
        </div>

        <!-- Arrow -->
        <div class="transfer-arrow">
          <v-icon icon="mdi-arrow-right-bold" size="24" color="primary"></v-icon>
          <p class="text-caption text-primary font-weight-bold mt-1">TRANSFERIR</p>
        </div>

        <!-- Destination -->
        <div class="program-item">
          <div class="logo-container">
            <v-img
              :src="campaign.program_destination.logo_url"
              :alt="campaign.program_destination.name"
              contain
              height="48"
              max-width="72"
            >
              <template v-slot:error>
                <div class="logo-fallback">
                  <v-icon :icon="getDestinationFallbackIcon()" size="24" :color="getCampaignTypeColor()"></v-icon>
                </div>
              </template>
            </v-img>
          </div>
          <p class="program-name">{{ campaign.program_destination.name }}</p>
          <p class="program-label">DESTINO</p>
        </div>
      </div>

      <!-- Layout para outros tipos (apenas programa destino) -->
      <div v-else class="single-program-flow">
        <div class="program-item-single">
          <div class="logo-container-single">
            <v-img
              :src="campaign.program_destination.logo_url"
              :alt="campaign.program_destination.name"
              contain
              height="64"
              max-width="96"
            >
              <template v-slot:error>
                <div class="logo-fallback">
                  <v-icon :icon="getSingleProgramFallbackIcon()" size="28" :color="getCampaignTypeColor()"></v-icon>
                </div>
              </template>
            </v-img>
          </div>
          <p class="program-name-single">{{ campaign.program_destination.name }}</p>
          <p class="program-label-single">{{ getProgramLabel() }}</p>
        </div>
      </div>
    </div>

    <!-- Descrição da campanha -->
    <div class="campaign-description">
      <p class="text-body-2 text-center mb-0">
        {{ getCampaignDescription() }}
      </p>
    </div>

    <!-- Footer com data e ação -->
    <div class="campaign-footer">
      <div class="expiry-info mb-3">
        <v-icon 
          :icon="isExpired ? 'mdi-calendar-remove' : 'mdi-calendar-clock'"
          size="14"
          :class="isExpired ? 'text-error' : 'text-warning'"
          class="mr-1"
        ></v-icon>
        <span 
          class="text-caption"
          :class="isExpired ? 'text-error font-weight-bold' : 'text-medium-emphasis'"
        >
          {{ isExpired ? 'Expirou' : 'Válida até' }} {{ formattedExpirationDate }}
        </span>
      </div>

      <v-btn
        :href="campaign.link_url"
        target="_blank"
        rel="noopener noreferrer"
        :color="isExpired ? 'grey' : 'primary'"
        variant="flat"
        block
        size="large"
        :disabled="isExpired"
        class="text-none font-weight-bold"
        rounded="lg"
      >
        <v-icon start :icon="isExpired ? 'mdi-cancel' : 'mdi-open-in-new'" size="18"></v-icon>
        {{ isExpired ? 'Campanha Expirada' : 'Aproveitar Campanha' }}
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
  import type { CampaignItem } from '~/interfaces/active-campaigns'

  interface Props {
    campaign: CampaignItem
  }

  const props = defineProps<Props>()
  const { formatCampaignValue, isCampaignExpired, formatExpirationDate } =
    useActiveCampaigns()

  // Computed
  const formattedValue = computed(() =>
    formatCampaignValue(props.campaign.value, props.campaign.value_type)
  )

  const isExpired = computed(() =>
    isCampaignExpired(props.campaign.expiration_date)
  )

  const formattedExpirationDate = computed(() =>
    formatExpirationDate(props.campaign.expiration_date)
  )

  // Methods
  const getValueColor = (): string => {
    if (isExpired.value) return 'error'
    return props.campaign.value_type === 'percent' ? 'success' : 'info'
  }

  const getCampaignTypeColor = (): string => {
    const typeColors = {
      bonus_transfer: 'primary',
      purchase_with_bonus: 'success',
      purchase_with_discount: 'warning',
      club_upgrade: 'purple',
      club_subscription: 'indigo',
    }
    return typeColors[props.campaign.type] || 'grey'
  }

  const getCampaignTypeIcon = (): string => {
    const typeIcons = {
      bonus_transfer: 'mdi-swap-horizontal',
      purchase_with_bonus: 'mdi-shopping',
      purchase_with_discount: 'mdi-sale',
      club_upgrade: 'mdi-arrow-up-bold',
      club_subscription: 'mdi-account-plus',
    }
    return typeIcons[props.campaign.type] || 'mdi-help'
  }

  const getCampaignTypeLabel = (): string => {
    const typeLabels = {
      bonus_transfer: 'Transferência Bonificada',
      purchase_with_bonus: 'Compra com Bônus',
      purchase_with_discount: 'Compra com Desconto',
      club_upgrade: 'Upgrade de Clube',
      club_subscription: 'Adesão de Clube',
    }
    return typeLabels[props.campaign.type] || 'Campanha'
  }

  const getValueDescription = (): string => {
    const descriptions = {
      percent: 'bônus na transferência',
      points: 'pontos extras'
    }
    return descriptions[props.campaign.value_type] || 'benefício'
  }

  const getDaysRemaining = (): string => {
    const today = new Date()
    const expiryDate = new Date(props.campaign.expiration_date)
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 0) return 'Expirada'
    if (diffDays === 1) return '1 dia'
    if (diffDays <= 7) return `${diffDays} dias`
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} sem.`
    return `${Math.ceil(diffDays / 30)} mês`
  }

  const getUrgencyColor = (): string => {
    const today = new Date()
    const expiryDate = new Date(props.campaign.expiration_date)
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 1) return 'error'
    if (diffDays <= 3) return 'warning'
    if (diffDays <= 7) return 'orange'
    return 'success'
  }

  const getProgramLabel = (): string => {
    const labels = {
      purchase_with_bonus: 'COMPRA COM BÔNUS',
      purchase_with_discount: 'COMPRA COM DESCONTO',
      club_upgrade: 'UPGRADE DE CLUBE',
      club_subscription: 'ADESÃO DE CLUBE',
    }
    return labels[props.campaign.type] || 'PROGRAMA'
  }

  const getCampaignDescription = (): string => {
    const value = props.campaign.value
    const programName = props.campaign.program_destination.name
    const valueText = props.campaign.value_type === 'percent' ? `${value}%` : `${value.toLocaleString('pt-BR')}`
    
    const descriptions = {
      bonus_transfer: `Transfira seus pontos na promoção: ${props.campaign.program_origin.name} e ${props.campaign.program_destination.name} e ganhe até ${valueText} de bônus`,
      purchase_with_bonus: `Ganhe até ${valueText} de bônus na compra de pontos no programa ${programName}`,
      purchase_with_discount: `Ganhe até ${valueText} de desconto na compra de pontos no programa ${programName}`,
      club_upgrade: `Faça o Upgrade de clube do programa ${programName} e ganhe até ${valueText} ${props.campaign.value_type === 'percent' ? 'de bônus' : 'pontos de bônus'}`,
      club_subscription: `Assine o clube do programa ${programName} e ganhe até ${valueText} ${props.campaign.value_type === 'percent' ? 'de bônus' : 'pontos bônus'}`,
    }
    return descriptions[props.campaign.type] || `Aproveite esta oportunidade especial do ${programName}`
  }

  const getOriginFallbackIcon = (): string => {
    // Ícone para programa de origem (sempre relacionado a pontos/milhas)
    return 'mdi-wallet-giftcard'
  }

  const getDestinationFallbackIcon = (): string => {
    // Ícone para programa de destino baseado no tipo de campanha
    const destinationIcons = {
      bonus_transfer: 'mdi-airplane',
      purchase_with_bonus: 'mdi-star-circle',
      purchase_with_discount: 'mdi-star-circle',
      club_upgrade: 'mdi-crown',
      club_subscription: 'mdi-crown',
    }
    return destinationIcons[props.campaign.type] || 'mdi-store'
  }

  const getSingleProgramFallbackIcon = (): string => {
    // Ícone para programa único baseado no tipo de campanha
    const singleProgramIcons = {
      purchase_with_bonus: 'mdi-shopping',
      purchase_with_discount: 'mdi-sale',
      club_upgrade: 'mdi-crown',
      club_subscription: 'mdi-account-star',
    }
    return singleProgramIcons[props.campaign.type] || 'mdi-store'
  }

</script>

<style scoped>
  /* Mobile-First Design */
  .campaign-card {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(0, 0, 0, 0.06);
    overflow: hidden;
    background: white;
  }

  .campaign-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
  }

  .campaign-expired {
    opacity: 0.65;
    filter: grayscale(0.4);
  }

  .campaign-expired:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08) !important;
  }

  /* Header com benefício */
  .benefit-header {
    background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
    padding: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  }

  .benefit-value {
    line-height: 1.2;
  }

  /* Seção das logos */
  .logos-section {
    padding: 20px 16px;
    background: #fafbff;
  }

  .transfer-flow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .program-item {
    flex: 1;
    text-align: center;
    max-width: 90px;
  }

  .logo-container {
    width: 72px;
    height: 48px;
    background: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    margin: 0 auto 8px auto;
    transition: all 0.2s ease;
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .logo-container:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  .logo-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    border-radius: 8px;
  }

  .program-name {
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 2px 0;
    color: rgba(0, 0, 0, 0.87);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .program-label {
    font-size: 0.6875rem;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.6);
    letter-spacing: 0.5px;
    margin: 0;
  }

  .transfer-arrow {
    flex: 0 0 auto;
    text-align: center;
    margin: 0 8px;
  }

  /* Layout para programa único */
  .single-program-flow {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 0;
  }

  .program-item-single {
    text-align: center;
  }

  .logo-container-single {
    width: 96px;
    height: 64px;
    background: white;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
    margin: 0 auto 12px auto;
    transition: all 0.2s ease;
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .logo-container-single:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  .program-name-single {
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.3;
    margin: 0 0 4px 0;
    color: rgba(0, 0, 0, 0.87);
  }

  .program-label-single {
    font-size: 0.75rem;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.6);
    letter-spacing: 0.5px;
    margin: 0;
  }

  /* Descrição da campanha */
  .campaign-description {
    padding: 12px 16px;
    background: #ffffff;
    border-top: 1px solid rgba(0, 0, 0, 0.04);
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  }

  /* Footer */
  .campaign-footer {
    padding: 16px;
    background: white;
  }

  .expiry-info {
    text-align: center;
  }

  /* Tablet e Desktop (768px+) */
  @media (min-width: 768px) {
    .benefit-header {
      padding: 20px;
    }

    .logos-section {
      padding: 24px 20px;
    }

    .logo-container {
      width: 80px;
      height: 56px;
    }

    .program-name {
      font-size: 0.8125rem;
    }

    .program-label {
      font-size: 0.75rem;
    }

    .transfer-arrow {
      margin: 0 12px;
    }

    .logo-container-single {
      width: 104px;
      height: 68px;
    }

    .program-name-single {
      font-size: 0.9375rem;
    }

    .program-label-single {
      font-size: 0.8125rem;
    }

    .campaign-description {
      padding: 16px 20px;
    }

    .campaign-footer {
      padding: 20px;
    }
  }

  /* Desktop Large (1200px+) */
  @media (min-width: 1200px) {
    .transfer-flow {
      gap: 16px;
    }

    .program-item {
      max-width: 100px;
    }

    .logo-container {
      width: 88px;
      height: 60px;
    }
  }

  /* Mobile pequeno (480px-) */
  @media (max-width: 480px) {
    .benefit-header {
      padding: 12px;
    }

    .logos-section {
      padding: 16px 12px;
    }

    .transfer-flow {
      gap: 8px;
    }

    .program-item {
      max-width: 75px;
    }

    .logo-container {
      width: 60px;
      height: 42px;
      padding: 6px;
    }

    .program-name {
      font-size: 0.6875rem;
    }

    .program-label {
      font-size: 0.625rem;
    }

    .transfer-arrow {
      margin: 0 4px;
    }

    .logo-container-single {
      width: 80px;
      height: 56px;
      padding: 8px;
    }

    .program-name-single {
      font-size: 0.8125rem;
    }

    .program-label-single {
      font-size: 0.6875rem;
    }

    .campaign-description {
      padding: 10px 12px;
    }

    .campaign-footer {
      padding: 12px;
    }
  }

  /* Dark theme */
  .v-theme--dark .campaign-card {
    background: #1e1e1e;
    border-color: rgba(255, 255, 255, 0.08);
  }

  .v-theme--dark .benefit-header {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
    border-bottom-color: rgba(255, 255, 255, 0.06);
  }

  .v-theme--dark .logos-section {
    background: rgba(255, 255, 255, 0.02);
  }

  .v-theme--dark .logo-container {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .v-theme--dark .logo-fallback {
    background: rgba(255, 255, 255, 0.03);
  }

  .v-theme--dark .program-name {
    color: rgba(255, 255, 255, 0.87);
  }

  .v-theme--dark .program-label {
    color: rgba(255, 255, 255, 0.6);
  }

  .v-theme--dark .campaign-description {
    background: #1e1e1e;
    border-top-color: rgba(255, 255, 255, 0.06);
    border-bottom-color: rgba(255, 255, 255, 0.06);
  }

  .v-theme--dark .campaign-footer {
    background: #1e1e1e;
  }

  .v-theme--dark .logo-container-single {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .v-theme--dark .program-name-single {
    color: rgba(255, 255, 255, 0.87);
  }

  .v-theme--dark .program-label-single {
    color: rgba(255, 255, 255, 0.6);
  }
</style>
