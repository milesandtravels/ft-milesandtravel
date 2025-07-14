<template>
  <div class="alerts-view-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center">
          <v-icon class="mr-3" color="primary" size="32">
            mdi-bell-outline
          </v-icon>
          <div>
            <h1 class="text-h4 font-weight-bold mb-1">Visualizar Alertas</h1>
            <p class="text-body-1 text-medium-emphasis mb-0">
              Histórico de notificações e alertas recebidos
            </p>
          </div>
        </div>
        <v-btn color="primary" variant="outlined" @click="markAllAsRead">
          <v-icon start>mdi-check-all</v-icon>
          Marcar Todas como Lidas
        </v-btn>
      </div>
    </div>

    <!-- Filters and Stats -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-text>
            <v-row align="center">
              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="filters.type"
                  :items="alertTypes"
                  label="Tipo de Alerta"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="filters.status"
                  :items="statusOptions"
                  label="Status"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="filters.dateFrom"
                  label="Data Inicial"
                  type="date"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="filters.dateTo"
                  label="Data Final"
                  type="date"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card elevation="2" color="primary" variant="tonal">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon class="mr-3" size="32">mdi-bell-badge</v-icon>
              <div>
                <div class="text-h5 font-weight-bold">{{ unreadCount }}</div>
                <div class="text-body-2">Alertas não lidos</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Alerts List -->
    <v-card elevation="2">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="primary">mdi-format-list-bulleted</v-icon>
        Lista de Alertas
      </v-card-title>

      <v-divider />

      <div v-if="filteredAlerts.length === 0" class="text-center pa-8">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">
          mdi-bell-off-outline
        </v-icon>
        <h3 class="text-h6 mb-2">Nenhum alerta encontrado</h3>
        <p class="text-body-2 text-medium-emphasis">
          Não há alertas que correspondam aos filtros selecionados.
        </p>
      </div>

      <v-list v-else class="pa-0">
        <template v-for="(alert, index) in filteredAlerts" :key="alert.id">
          <v-list-item
            class="alert-item"
            :class="{ 'alert-unread': !alert.read }"
            @click="markAsRead(alert.id)"
          >
            <template #prepend>
              <v-avatar
                :color="getAlertColor(alert.type)"
                class="mr-3"
                size="40"
              >
                <v-icon :icon="getAlertIcon(alert.type)" color="white" />
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-medium">
              {{ alert.title }}
            </v-list-item-title>

            <v-list-item-subtitle class="mt-1">
              {{ alert.message }}
            </v-list-item-subtitle>

            <template #append>
              <div class="text-right">
                <v-chip
                  :color="getAlertColor(alert.type)"
                  size="small"
                  variant="tonal"
                  class="mb-1"
                >
                  {{ getAlertTypeLabel(alert.type) }}
                </v-chip>
                <div class="text-caption text-medium-emphasis">
                  {{ formatDate(alert.createdAt) }}
                </div>
                <div v-if="!alert.read" class="unread-indicator mt-1">
                  <v-chip color="primary" size="x-small" variant="flat">
                    Novo
                  </v-chip>
                </div>
              </div>
            </template>
          </v-list-item>

          <v-divider v-if="index < filteredAlerts.length - 1" />
        </template>
      </v-list>

      <!-- Pagination -->
      <v-card-actions v-if="filteredAlerts.length > 0" class="justify-center">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="5"
          color="primary"
        />
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue'
  import { useSnackbarStore } from '~/store/snackbar'

  // Page Meta
  definePageMeta({
    title: 'Visualizar Alertas',
    layout: 'default',
  })

  // Types
  interface Alert {
    id: number
    type: 'price_drop' | 'new_promotion' | 'stock_alert' | 'weekly_digest'
    title: string
    message: string
    read: boolean
    createdAt: string
  }

  // Composables
  const snackbar = useSnackbarStore()

  // Reactive Data
  const currentPage = ref(1)
  const itemsPerPage = 10

  const filters = reactive({
    type: null as string | null,
    status: null as string | null,
    dateFrom: '',
    dateTo: '',
  })

  // Mock Data
  const alerts = ref<Alert[]>([
    {
      id: 1,
      type: 'price_drop',
      title: 'Queda de Preço - iPhone 15',
      message:
        'O iPhone 15 128GB baixou de R$ 4.999,00 para R$ 4.299,00 (14% de desconto)',
      read: false,
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      type: 'new_promotion',
      title: 'Nova Promoção - Amazon',
      message:
        'Amazon está com 20% de desconto em eletrônicos. Válido até 20/01/2024.',
      read: false,
      createdAt: '2024-01-14T15:45:00Z',
    },
    {
      id: 3,
      type: 'stock_alert',
      title: 'Produto em Estoque - MacBook Air M2',
      message: 'O MacBook Air M2 256GB voltou ao estoque na Apple Store.',
      read: true,
      createdAt: '2024-01-13T09:15:00Z',
    },
    {
      id: 4,
      type: 'weekly_digest',
      title: 'Resumo Semanal de Ofertas',
      message:
        'Confira as 10 melhores ofertas da semana selecionadas para você.',
      read: true,
      createdAt: '2024-01-12T08:00:00Z',
    },
    {
      id: 5,
      type: 'price_drop',
      title: 'Queda de Preço - Samsung Galaxy S24',
      message:
        'Samsung Galaxy S24 256GB com 18% de desconto na Magazine Luiza.',
      read: false,
      createdAt: '2024-01-11T14:20:00Z',
    },
  ])

  const alertTypes = [
    { title: 'Queda de Preço', value: 'price_drop' },
    { title: 'Nova Promoção', value: 'new_promotion' },
    { title: 'Alerta de Estoque', value: 'stock_alert' },
    { title: 'Resumo Semanal', value: 'weekly_digest' },
  ]

  const statusOptions = [
    { title: 'Lido', value: 'read' },
    { title: 'Não Lido', value: 'unread' },
  ]

  // Computed Properties
  const filteredAlerts = computed(() => {
    let filtered = alerts.value

    if (filters.type) {
      filtered = filtered.filter(alert => alert.type === filters.type)
    }

    if (filters.status) {
      const isRead = filters.status === 'read'
      filtered = filtered.filter(alert => alert.read === isRead)
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(
        alert => new Date(alert.createdAt) >= new Date(filters.dateFrom)
      )
    }

    if (filters.dateTo) {
      filtered = filtered.filter(
        alert => new Date(alert.createdAt) <= new Date(filters.dateTo)
      )
    }

    // Pagination
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filtered.slice(start, end)
  })

  const unreadCount = computed(() => {
    return alerts.value.filter(alert => !alert.read).length
  })

  const totalPages = computed(() => {
    return Math.ceil(alerts.value.length / itemsPerPage)
  })

  // Methods
  const getAlertColor = (type: string) => {
    const colors = {
      price_drop: 'success',
      new_promotion: 'primary',
      stock_alert: 'warning',
      weekly_digest: 'info',
    }
    return colors[type as keyof typeof colors] || 'grey'
  }

  const getAlertIcon = (type: string) => {
    const icons = {
      price_drop: 'mdi-trending-down',
      new_promotion: 'mdi-tag',
      stock_alert: 'mdi-package-variant',
      weekly_digest: 'mdi-email-newsletter',
    }
    return icons[type as keyof typeof icons] || 'mdi-bell'
  }

  const getAlertTypeLabel = (type: string) => {
    const labels = {
      price_drop: 'Preço',
      new_promotion: 'Promoção',
      stock_alert: 'Estoque',
      weekly_digest: 'Resumo',
    }
    return labels[type as keyof typeof labels] || 'Alerta'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const markAsRead = (alertId: number) => {
    const alert = alerts.value.find(a => a.id === alertId)
    if (alert && !alert.read) {
      alert.read = true
      snackbar.show({
        message: 'Alerta marcado como lido',
        color: 'success',
        timeout: 2000,
      })
    }
  }

  const markAllAsRead = () => {
    const unreadAlerts = alerts.value.filter(alert => !alert.read)
    unreadAlerts.forEach(alert => {
      alert.read = true
    })

    if (unreadAlerts.length > 0) {
      snackbar.show({
        message: `${unreadAlerts.length} alertas marcados como lidos`,
        color: 'success',
        timeout: 3000,
      })
    }
  }
</script>

<style scoped>
  .alerts-view-page {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: 24px;
  }

  .alert-item {
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .alert-item:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .alert-unread {
    background-color: rgba(25, 118, 210, 0.04);
    border-left: 4px solid rgb(25, 118, 210);
  }

  .unread-indicator {
    display: flex;
    justify-content: flex-end;
  }

  @media (max-width: 960px) {
    .alerts-view-page {
      padding: 16px;
    }

    .page-header .d-flex {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
  }

  /* Dark theme support */
  .v-theme--dark .alert-item:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  .v-theme--dark .alert-unread {
    background-color: rgba(144, 202, 249, 0.08);
    border-left-color: rgb(144, 202, 249);
  }
</style>
