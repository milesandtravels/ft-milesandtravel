<template>
  <div class="alerts-configure-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="d-flex align-center mb-6">
        <v-icon class="mr-3" color="primary" size="32"> mdi-bell-cog </v-icon>
        <div>
          <h1 class="text-h4 font-weight-bold mb-1">Configurar Alertas</h1>
          <p class="text-body-1 text-medium-emphasis mb-0">
            Defina suas preferências de notificação para ofertas e promoções
          </p>
        </div>
      </div>
    </div>

    <!-- Alert Configuration Form -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-6" elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-bell-ring</v-icon>
            Tipos de Alertas
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-switch
                  v-model="alertSettings.priceDrops"
                  color="primary"
                  label="Quedas de Preço"
                  hint="Receber notificações quando produtos em sua lista de desejos baixarem de preço"
                  persistent-hint
                  class="mb-4"
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="alertSettings.newPromotions"
                  color="primary"
                  label="Novas Promoções"
                  hint="Ser notificado sobre novas ofertas e promoções disponíveis"
                  persistent-hint
                  class="mb-4"
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="alertSettings.stockAlerts"
                  color="primary"
                  label="Alertas de Estoque"
                  hint="Receber avisos quando produtos esgotados voltarem ao estoque"
                  persistent-hint
                  class="mb-4"
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="alertSettings.weeklyDigest"
                  color="primary"
                  label="Resumo Semanal"
                  hint="Receber um resumo semanal das melhores ofertas"
                  persistent-hint
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Notification Preferences -->
        <v-card class="mb-6" elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-cog</v-icon>
            Preferências de Notificação
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="alertSettings.frequency"
                  :items="frequencyOptions"
                  label="Frequência de Alertas"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="alertSettings.method"
                  :items="methodOptions"
                  label="Método de Notificação"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="alertSettings.email"
                  label="Email para Notificações"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                  hint="Email onde você receberá as notificações"
                  persistent-hint
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Price Threshold Settings -->
        <v-card class="mb-6" elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-currency-usd</v-icon>
            Configurações de Preço
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="alertSettings.minDiscount"
                  label="Desconto Mínimo (%)"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  hint="Percentual mínimo de desconto para receber alertas"
                  persistent-hint
                  suffix="%"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="alertSettings.maxPrice"
                  label="Preço Máximo (R$)"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  hint="Valor máximo para receber alertas de produtos"
                  persistent-hint
                  prefix="R$"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Action Buttons -->
        <div class="d-flex gap-3">
          <v-btn
            color="primary"
            size="large"
            variant="flat"
            @click="saveSettings"
          >
            <v-icon start>mdi-content-save</v-icon>
            Salvar Configurações
          </v-btn>
          <v-btn
            color="secondary"
            size="large"
            variant="outlined"
            @click="resetSettings"
          >
            <v-icon start>mdi-refresh</v-icon>
            Restaurar Padrão
          </v-btn>
        </div>
      </v-col>

      <!-- Sidebar with Tips -->
      <v-col cols="12" md="4">
        <v-card class="sticky-card" elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="info">mdi-lightbulb-outline</v-icon>
            Dicas de Configuração
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item>
                <v-list-item-title class="text-body-2 font-weight-medium">
                  Alertas de Preço
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  Configure um desconto mínimo de 15% para receber apenas
                  ofertas realmente vantajosas.
                </v-list-item-subtitle>
              </v-list-item>
              <v-divider class="my-2" />
              <v-list-item>
                <v-list-item-title class="text-body-2 font-weight-medium">
                  Frequência
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  Recomendamos alertas diários para não perder ofertas
                  limitadas.
                </v-list-item-subtitle>
              </v-list-item>
              <v-divider class="my-2" />
              <v-list-item>
                <v-list-item-title class="text-body-2 font-weight-medium">
                  Email
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  Use um email que você verifica regularmente para não perder
                  notificações importantes.
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { useSnackbarStore } from '~/store/snackbar'

  // Page Meta
  definePageMeta({
    title: 'Configurar Alertas',
    layout: 'default',
  })

  // Composables
  const snackbar = useSnackbarStore()

  // Reactive Data
  const alertSettings = reactive({
    priceDrops: true,
    newPromotions: true,
    stockAlerts: false,
    weeklyDigest: true,
    frequency: 'daily',
    method: 'email',
    email: '',
    minDiscount: 10,
    maxPrice: 1000,
  })

  const frequencyOptions = [
    { title: 'Imediatamente', value: 'immediate' },
    { title: 'Diariamente', value: 'daily' },
    { title: 'Semanalmente', value: 'weekly' },
    { title: 'Mensalmente', value: 'monthly' },
  ]

  const methodOptions = [
    { title: 'Email', value: 'email' },
    { title: 'Push Notification', value: 'push' },
    { title: 'Ambos', value: 'both' },
  ]

  // Methods
  const saveSettings = () => {
    // TODO: Implement API call to save settings
    snackbar.show({
      message: 'Configurações de alertas salvas com sucesso!',
      color: 'success',
      timeout: 3000,
    })
  }

  const resetSettings = () => {
    Object.assign(alertSettings, {
      priceDrops: true,
      newPromotions: true,
      stockAlerts: false,
      weeklyDigest: true,
      frequency: 'daily',
      method: 'email',
      email: '',
      minDiscount: 10,
      maxPrice: 1000,
    })

    snackbar.show({
      message: 'Configurações restauradas para o padrão',
      color: 'info',
      timeout: 3000,
    })
  }
</script>

<style scoped>
  .alerts-configure-page {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: 24px;
  }

  .sticky-card {
    position: sticky;
    top: 24px;
  }

  @media (max-width: 960px) {
    .alerts-configure-page {
      padding: 16px;
    }

    .sticky-card {
      position: static;
    }
  }
</style>
