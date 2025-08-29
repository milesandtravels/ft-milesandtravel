<template>
  <div class="campaigns-preview-section mb-8">
    <!-- Header da seção -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h4 font-weight-bold mb-2">
          <v-icon
            icon="mdi-bullhorn"
            color="primary"
            size="32"
            class="mr-2"
          ></v-icon>
          Campanhas Ativas
        </h2>
        <p class="text-body-1 text-medium-emphasis">
          Ofertas limitadas de transferência, compra e upgrades de clubes
        </p>
      </div>

      <v-chip
        v-if="!pending && !error"
        :color="campaignCount > 0 ? 'success' : 'warning'"
        variant="flat"
        size="large"
        class="font-weight-bold"
      >
        {{ campaignCount }} {{ campaignCount === 1 ? 'campanha' : 'campanhas' }}
      </v-chip>
    </div>

    <!-- Loading State -->
    <v-card v-if="pending" class="pa-8 text-center" variant="outlined">
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
        class="mb-4"
      ></v-progress-circular>
      <p class="text-body-1">Carregando campanhas...</p>
    </v-card>

    <!-- Error State -->
    <v-card v-else-if="error" class="pa-8 text-center" variant="outlined">
      <v-icon
        icon="mdi-alert-circle"
        color="error"
        size="48"
        class="mb-4"
      ></v-icon>
      <p class="text-body-1 mb-4">Erro ao carregar campanhas</p>
      <v-btn color="primary" variant="outlined" @click="loadCampaigns">
        Tentar Novamente
      </v-btn>
    </v-card>

    <!-- Campaigns Preview -->
    <div v-else-if="campaigns.length > 0">
      <!-- Featured Campaign (maior) -->
      <v-card
        v-if="featuredCampaign"
        class="featured-campaign-card mb-4"
        elevation="4"
        rounded="xl"
        @click="navigateTo('/active-campaigns')"
      >
        <div class="d-flex align-center">
          <div class="featured-content pa-6 flex-grow-1">
            <div class="d-flex align-center gap-3 mb-3">
              <v-icon
                :icon="getCampaignTypeIcon(featuredCampaign.type)"
                :color="getCampaignTypeColor(featuredCampaign.type)"
                size="24"
              ></v-icon>
              <v-chip
                :color="getCampaignTypeColor(featuredCampaign.type)"
                variant="tonal"
                size="small"
              >
                {{ getCampaignTypeLabel(featuredCampaign.type) }}
              </v-chip>
              <v-chip
                :color="getUrgencyColor(featuredCampaign.expiration_date)"
                variant="flat"
                size="small"
                class="font-weight-medium"
              >
                <v-icon start icon="mdi-clock-fast" size="12"></v-icon>
                {{ getDaysRemaining(featuredCampaign.expiration_date) }}
              </v-chip>
            </div>

            <h3 class="text-h5 font-weight-bold mb-2">
              Ganhe até
              {{
                formatValue(featuredCampaign.value, featuredCampaign.value_type)
              }}
            </h3>

            <p class="text-body-1 mb-4">
              {{ getCampaignDescription(featuredCampaign) }}
            </p>

            <v-btn
              color="primary"
              variant="flat"
              size="large"
              class="text-none"
            >
              <v-icon start icon="mdi-rocket-launch" size="18"></v-icon>
              Ver Todas as Campanhas
            </v-btn>
          </div>

          <!-- Logos da campanha featured -->
          <div class="featured-logos pa-4">
            <div
              v-if="featuredCampaign.type === 'bonus_transfer'"
              class="transfer-logos"
            >
              <div class="logo-item text-center">
                <div class="logo-container">
                  <v-img
                    :src="featuredCampaign.program_origin.logo_url"
                    :alt="featuredCampaign.program_origin.name"
                    contain
                    height="40"
                    max-width="60"
                  >
                    <template v-slot:error>
                      <v-icon
                        icon="mdi-card-giftcard"
                        size="20"
                        color="grey"
                      ></v-icon>
                    </template>
                  </v-img>
                </div>
                <p class="text-caption mt-1">
                  {{ featuredCampaign.program_origin.name }}
                </p>
              </div>

              <v-icon
                icon="mdi-arrow-right-bold"
                size="20"
                color="primary"
                class="mx-2"
              ></v-icon>

              <div class="logo-item text-center">
                <div class="logo-container">
                  <v-img
                    :src="featuredCampaign.program_destination.logo_url"
                    :alt="featuredCampaign.program_destination.name"
                    contain
                    height="40"
                    max-width="60"
                  >
                    <template v-slot:error>
                      <v-icon
                        icon="mdi-airplane"
                        size="20"
                        color="grey"
                      ></v-icon>
                    </template>
                  </v-img>
                </div>
                <p class="text-caption mt-1">
                  {{ featuredCampaign.program_destination.name }}
                </p>
              </div>
            </div>

            <div v-else class="single-logo text-center">
              <div class="logo-container-large">
                <v-img
                  :src="featuredCampaign.program_destination.logo_url"
                  :alt="featuredCampaign.program_destination.name"
                  contain
                  height="60"
                  max-width="80"
                >
                  <template v-slot:error>
                    <v-icon icon="mdi-airplane" size="28" color="grey"></v-icon>
                  </template>
                </v-img>
              </div>
              <p class="text-body-2 font-weight-medium mt-2">
                {{ featuredCampaign.program_destination.name }}
              </p>
            </div>
          </div>
        </div>
      </v-card>

      <!-- Quick Action Cards -->
      <v-row>
        <v-col cols="12" sm="6">
          <v-card
            class="quick-campaign-card pa-4"
            variant="outlined"
            hover
            @click="navigateTo('/active-campaigns')"
          >
            <div class="d-flex align-center justify-space-between">
              <div>
                <h4 class="text-h6 font-weight-bold mb-1">
                  {{ campaigns.length }} Campanhas
                </h4>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Ver todas as ofertas ativas
                </p>
              </div>
              <v-icon icon="mdi-arrow-right" color="primary" size="24"></v-icon>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card
            class="quick-campaign-card pa-4"
            variant="outlined"
            hover
            @click="navigateTo('/active-campaigns')"
          >
            <div class="d-flex align-center justify-space-between">
              <div>
                <h4 class="text-h6 font-weight-bold mb-1">
                  {{ activeCampaignsCount }} Válidas
                </h4>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Campanhas ainda ativas
                </p>
              </div>
              <v-icon icon="mdi-clock-check" color="success" size="24"></v-icon>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Empty State -->
    <v-card v-else class="pa-8 text-center" variant="outlined">
      <v-icon
        icon="mdi-bullhorn-outline"
        color="grey"
        size="64"
        class="mb-4"
      ></v-icon>
      <h3 class="text-h6 font-weight-bold mb-2">Nenhuma campanha ativa</h3>
      <p class="text-body-2 text-medium-emphasis">
        No momento não há campanhas especiais disponíveis
      </p>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  import type { CampaignItem } from '~/interfaces/active-campaigns'

  // State
  const campaigns = ref<CampaignItem[]>([])
  const pending = ref(true)
  const error = ref(false)

  // Composables
  const { fetchCampaigns, isCampaignExpired } = useActiveCampaigns()

  // Computed
  const campaignCount = computed(() => campaigns.value.length)
  const activeCampaignsCount = computed(
    () =>
      campaigns.value.filter(c => !isCampaignExpired(c.expiration_date)).length
  )

  const featuredCampaign = computed(() => {
    // Pega a campanha com maior valor que não está expirada
    const activeCampaigns = campaigns.value.filter(
      c => !isCampaignExpired(c.expiration_date)
    )
    return activeCampaigns.sort((a, b) => b.value - a.value)[0] || null
  })

  // Methods
  const loadCampaigns = async () => {
    try {
      pending.value = true
      error.value = false
      campaigns.value = await fetchCampaigns()
    } catch (err) {
      console.error('Erro ao carregar campanhas para home:', err)
      error.value = true
    } finally {
      pending.value = false
    }
  }

  const getCampaignTypeIcon = (type: string): string => {
    const typeIcons = {
      bonus_transfer: 'mdi-swap-horizontal',
      purchase_with_bonus: 'mdi-shopping',
      purchase_with_discount: 'mdi-sale',
      club_upgrade: 'mdi-arrow-up-bold',
      club_subscription: 'mdi-account-plus',
    }
    return typeIcons[type] || 'mdi-help'
  }

  const getCampaignTypeColor = (type: string): string => {
    const typeColors = {
      bonus_transfer: 'primary',
      purchase_with_bonus: 'success',
      purchase_with_discount: 'warning',
      club_upgrade: 'purple',
      club_subscription: 'indigo',
    }
    return typeColors[type] || 'grey'
  }

  const getCampaignTypeLabel = (type: string): string => {
    const typeLabels = {
      bonus_transfer: 'Transferência Bonificada',
      purchase_with_bonus: 'Compra com Bônus',
      purchase_with_discount: 'Compra com Desconto',
      club_upgrade: 'Upgrade de Clube',
      club_subscription: 'Adesão de Clube',
    }
    return typeLabels[type] || 'Campanha'
  }

  const formatValue = (value: number, valueType: string): string => {
    return valueType === 'percent'
      ? `${value}%`
      : `${value.toLocaleString('pt-BR')} pontos`
  }

  const getDaysRemaining = (expirationDate: string): string => {
    const today = new Date()
    const expiryDate = new Date(expirationDate)
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) return 'Expirada'
    if (diffDays === 1) return '1 dia'
    if (diffDays <= 7) return `${diffDays} dias`
    return `${Math.ceil(diffDays / 7)} sem.`
  }

  const getUrgencyColor = (expirationDate: string): string => {
    const today = new Date()
    const expiryDate = new Date(expirationDate)
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 1) return 'error'
    if (diffDays <= 3) return 'warning'
    if (diffDays <= 7) return 'orange'
    return 'success'
  }

  const getCampaignDescription = (campaign: CampaignItem): string => {
    const value = formatValue(campaign.value, campaign.value_type)
    const programName = campaign.program_destination.name

    const descriptions = {
      bonus_transfer: `Transfira pontos entre ${campaign.program_origin.name} e ${programName}`,
      purchase_with_bonus: `Compra de pontos no programa ${programName}`,
      purchase_with_discount: `Desconto na compra de pontos do ${programName}`,
      club_upgrade: `Upgrade de clube do programa ${programName}`,
      club_subscription: `Adesão ao clube do ${programName}`,
    }
    return descriptions[campaign.type] || `Campanha especial do ${programName}`
  }

  // Initialize
  onMounted(() => {
    loadCampaigns()
  })
</script>

<style scoped>
  /* Featured Campaign Card */
  .featured-campaign-card {
    background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
    border: 1px solid rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .featured-campaign-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
  }

  .featured-content {
    flex: 1;
  }

  .featured-logos {
    flex: 0 0 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .transfer-logos {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .logo-container {
    width: 60px;
    height: 40px;
    background: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .logo-container-large {
    width: 80px;
    height: 60px;
    background: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  /* Quick Campaign Cards */
  .quick-campaign-card {
    cursor: pointer;
    transition: all 0.2s ease;
    height: 100%;
  }

  .quick-campaign-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .featured-campaign-card .d-flex {
      flex-direction: column;
    }

    .featured-logos {
      flex: none;
      padding: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.06);
    }

    .featured-content {
      text-align: center;
    }
  }

  @media (max-width: 600px) {
    .logo-container {
      width: 50px;
      height: 35px;
    }

    .logo-container-large {
      width: 70px;
      height: 50px;
    }
  }

  /* Dark theme */
  .v-theme--dark .featured-campaign-card {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.03) 0%,
      rgba(255, 255, 255, 0.01) 100%
    );
    border-color: rgba(255, 255, 255, 0.08);
  }

  .v-theme--dark .logo-container,
  .v-theme--dark .logo-container-large {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .v-theme--dark .featured-logos {
    border-top-color: rgba(255, 255, 255, 0.08);
  }
</style>
