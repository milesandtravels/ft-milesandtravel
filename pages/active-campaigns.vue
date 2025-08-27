<template>
  <v-container class="pa-6">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h1 class="text-h4 mb-2">Campanhas Ativas</h1>
        <p class="text-subtitle-1 text-medium-emphasis ma-0 d-none d-sm-block">
          Descubra as melhores campanhas de transferência bonificada, compra de
          pontos e muito mais
        </p>
        <p class="text-body-2 text-medium-emphasis ma-0 d-sm-none">
          Melhores campanhas de pontos, milhas e cashback
        </p>
      </div>
      <v-chip
        :color="activeCampaigns.length > 0 ? 'success' : 'warning'"
        variant="flat"
        :size="$vuetify.display.xs ? 'small' : 'default'"
      >
        {{ activeCampaigns.length }}
        {{
          activeCampaigns.length === 1 ? 'campanha ativa' : 'campanhas ativas'
        }}
      </v-chip>
    </div>

    <!-- Descrição -->
    <div class="mb-6">
      <v-card
        variant="tonal"
        color="primary"
        :class="$vuetify.display.xs ? 'pa-3' : 'pa-4'"
      >
        <div class="d-flex align-start">
          <v-icon
            icon="mdi-bullhorn"
            color="primary"
            :size="$vuetify.display.xs ? '18' : '20'"
            class="mr-2 mr-sm-3 mt-1"
          />
          <div>
            <div class="d-none d-sm-block">
              <p class="text-body-2 mb-2">
                <strong>Campanhas limitadas:</strong> Aproveite ofertas
                especiais por tempo limitado de transferências bonificadas,
                compras de pontos com bônus e oportunidades exclusivas de
                upgrade e adesão de clubes.
              </p>
              <p class="text-body-2 mb-0">
                Monitore as datas de expiração e não perca as melhores
                oportunidades para maximizar seus pontos, milhas e benefícios.
              </p>
            </div>
            <div class="d-sm-none">
              <p class="text-caption mb-1">
                <strong>Ofertas por tempo limitado</strong> de transferências,
                compras e upgrades.
              </p>
              <p class="text-caption mb-0">
                Monitore as datas de expiração para não perder oportunidades.
              </p>
            </div>
          </div>
        </div>
      </v-card>
    </div>

    <!-- Tabs de Categorias -->
    <v-tabs
      v-model="activeTab"
      show-arrows
      class="mb-4"
      color="primary"
      align-tabs="start"
    >
      <v-tab
        v-for="tab in campaignTabs"
        :key="tab.key"
        :value="tab.key"
        class="text-none"
      >
        <v-icon :icon="tab.icon" start size="18"></v-icon>
        <span class="d-none d-sm-inline">{{ tab.label }}</span>
        <span class="d-sm-none">{{ tab.label.split(' ')[0] }}</span>
        <v-badge
          v-if="getCampaignCount(tab.key) > 0"
          :content="getCampaignCount(tab.key)"
          color="primary"
          inline
          class="ml-2"
        ></v-badge>
      </v-tab>
    </v-tabs>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="mt-4 text-h6">Carregando campanhas...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <v-alert type="error" variant="tonal" class="mb-4">
        <v-alert-title>Erro ao carregar dados</v-alert-title>
        Não foi possível carregar as campanhas. Tente novamente mais tarde.
      </v-alert>
    </div>

    <!-- Tab Content -->
    <v-window v-else v-model="activeTab" class="mt-4">
      <v-window-item
        v-for="tab in campaignTabs"
        :key="tab.key"
        :value="tab.key"
      >
        <!-- Campaigns Grid -->
        <v-row v-if="getFilteredCampaigns(tab.key).length > 0">
          <v-col
            v-for="campaign in getFilteredCampaigns(tab.key)"
            :key="campaign.id"
            cols="12"
            sm="12"
            md="12"
            lg="6"
            xl="6"
          >
            <ActiveCampaignCard :campaign="campaign" />
          </v-col>
        </v-row>

        <!-- Empty State for Tab -->
        <div v-else class="text-center py-8">
          <v-card class="pa-8" variant="outlined">
            <v-icon
              :icon="tab.icon"
              size="64"
              class="text-medium-emphasis mb-4"
            ></v-icon>
            <h3 class="text-h6 mb-2">Nenhuma campanha encontrada</h3>
            <p class="text-body-2 text-medium-emphasis">
              Não há campanhas ativas de {{ tab.label.toLowerCase() }} no
              momento.
            </p>
          </v-card>
        </div>
      </v-window-item>
    </v-window>

    <!-- Statistics Section -->
    <v-card
      v-if="!pending && !error && activeCampaigns.length > 0"
      class="mt-6"
      variant="outlined"
    >
      <v-card-title>
        <v-icon icon="mdi-chart-line" start></v-icon>
        Resumo das Campanhas
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-card variant="tonal" color="success" class="pa-3">
              <div class="text-center">
                <div class="text-h4 font-weight-bold">
                  {{ activeCampaigns.length }}
                </div>
                <div class="text-caption">Total de Campanhas</div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card variant="tonal" color="warning" class="pa-3">
              <div class="text-center">
                <div class="text-h4 font-weight-bold">
                  {{ expiredCampaigns.length }}
                </div>
                <div class="text-caption">Campanhas Expiradas</div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card variant="tonal" color="info" class="pa-3">
              <div class="text-center">
                <div class="text-h4 font-weight-bold">
                  {{ percentCampaigns.length }}
                </div>
                <div class="text-caption">Bônus em %</div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card variant="tonal" color="purple" class="pa-3">
              <div class="text-center">
                <div class="text-h4 font-weight-bold">
                  {{ pointsCampaigns.length }}
                </div>
                <div class="text-caption">Bônus em Pontos</div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
  import type {
    CampaignItem,
    CampaignType,
    CampaignTab,
  } from '~/interfaces/active-campaigns'

  definePageMeta({
    middleware: ['sanctum:auth'],
  })

  useSeoMeta({
    title:
      'Campanhas Ativas - Ofertas Limitadas de Pontos e Milhas | Miles&Travel',
    ogTitle:
      'Campanhas Ativas - Ofertas Limitadas de Pontos e Milhas | Miles&Travel',
    description:
      'Descubra campanhas limitadas de transferência bonificada, compra de pontos com bônus e oportunidades exclusivas de upgrade de clubes.',
    ogDescription:
      'Descubra campanhas limitadas de transferência bonificada, compra de pontos com bônus e oportunidades exclusivas de upgrade de clubes.',
  })

  // Composables
  const { fetchCampaigns, filterCampaignsByType, isCampaignExpired } =
    useActiveCampaigns()

  // State
  const activeTab = ref<CampaignType>('bonus_transfer')
  const allCampaigns = ref<CampaignItem[]>([])
  const pending = ref(true)
  const error = ref<any>(null)

  // Configuração das abas
  const campaignTabs: CampaignTab[] = [
    {
      key: 'bonus_transfer',
      label: 'Transferência Bonificada',
      icon: 'mdi-swap-horizontal',
    },
    {
      key: 'purchase_with_bonus',
      label: 'Compra com Bônus',
      icon: 'mdi-shopping',
    },
    {
      key: 'purchase_with_discount',
      label: 'Compra com Desconto',
      icon: 'mdi-sale',
    },
    {
      key: 'club_upgrade',
      label: 'Upgrade de Clube',
      icon: 'mdi-arrow-up-bold',
    },
    {
      key: 'club_subscription',
      label: 'Adesão de Clube',
      icon: 'mdi-account-plus',
    },
  ]

  // Computed
  const activeCampaigns = computed(() =>
    allCampaigns.value.filter(
      campaign => !isCampaignExpired(campaign.expiration_date)
    )
  )

  const expiredCampaigns = computed(() =>
    allCampaigns.value.filter(campaign =>
      isCampaignExpired(campaign.expiration_date)
    )
  )

  const percentCampaigns = computed(() =>
    allCampaigns.value.filter(campaign => campaign.value_type === 'percent')
  )

  const pointsCampaigns = computed(() =>
    allCampaigns.value.filter(campaign => campaign.value_type === 'points')
  )

  // Methods
  const getFilteredCampaigns = (type: CampaignType): CampaignItem[] => {
    return filterCampaignsByType(allCampaigns.value, type)
  }

  const getCampaignCount = (type: CampaignType): number => {
    return getFilteredCampaigns(type).length
  }

  const loadCampaigns = async () => {
    try {
      pending.value = true
      error.value = null
      allCampaigns.value = await fetchCampaigns()
    } catch (err) {
      console.error('Erro ao carregar campanhas:', err)
      error.value = err
    } finally {
      pending.value = false
    }
  }

  // Initialize
  await loadCampaigns()
</script>

<style scoped>
  .v-tab {
    min-width: 140px;
  }

  @media (max-width: 600px) {
    .v-tab {
      min-width: 100px;
    }
  }
</style>
