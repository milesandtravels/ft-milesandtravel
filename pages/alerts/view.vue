<script lang="ts" setup>
  import type { ProgramType } from '~/interfaces/program'
  import type { User } from '~/types/user'

  interface Program {
    id: number
    name: string
    logo_url: string
    link_url: string
    type: string
    value_per_mile: string
  }

  interface Ecommerce {
    id: number
    name: string
    logo_url: string
    category: string
  }

  interface Alert {
    id: number
    user_id: number
    program: Program | null
    ecommerce: Ecommerce | null
    ecommerce_category: string | null
    program_type: ProgramType
    active: boolean
    threshold: string
    created_at: string
    updated_at: string
  }

  interface ApiResponse {
    data: Alert[]
  }

  definePageMeta({
    middleware: ['sanctum:auth'],
  })

  // Estados principais
  const alerts = ref<Alert[]>([])
  const isLoading = ref(false)
  const hasMore = ref(true)
  const currentPage = ref(1)
  const showDeleteModal = ref(false)
  const alertToDelete = ref<Alert | null>(null)
  const isDeleting = ref(false)

  // Estados para configuração do WhatsApp
  const { user } = useSanctumAuth<User>()
  const isWhatsAppConfigured = computed(
    () => user.value?.whatsapp_notification_enabled || false
  )
  const showWhatsAppBanner = ref(true)
  const showOnboardingModal = ref(false)
  const isFirstVisit = ref(true)

  // Estados para edição de alertas
  const showEditAlertModal = ref(false)
  const editingAlert = ref<Alert | null>(null)
  const alertThreshold = ref('')
  const alertActive = ref(true)
  const isSavingAlert = ref(false)

  // Buscar alertas com paginação
  const fetchAlerts = async (page = 1, append = false) => {
    if (isLoading.value) return

    isLoading.value = true

    try {
      const { data, error } = await useSanctumFetch<ApiResponse | Alert[]>(
        `/api/promotional-alerts?page=${page}`,
        {
          method: 'GET',
        }
      )

      if (data.value) {
        // Verificar se a resposta tem a propriedade 'data' (formato paginado) ou é um array direto
        const newAlerts = Array.isArray(data.value)
          ? data.value
          : (data.value as ApiResponse).data || []

        if (append) {
          alerts.value = [...alerts.value, ...newAlerts]
        } else {
          alerts.value = newAlerts
        }

        // Verificar se há mais páginas
        hasMore.value = newAlerts.length > 0 && newAlerts.length >= 10
        currentPage.value = page
      }

      if (error.value) {
        console.error('Erro ao carregar alertas:', error.value)
      }
    } catch (err) {
      console.error('Erro ao buscar alertas:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Carregar mais alertas (scroll infinito)
  const loadMore = async () => {
    if (hasMore.value && !isLoading.value) {
      await fetchAlerts(currentPage.value + 1, true)
    }
  }

  // Deletar alerta
  const deleteAlert = async () => {
    if (!alertToDelete.value) return

    isDeleting.value = true

    try {
      const { error } = await useSanctumFetch(
        `/api/promotional-alerts/${alertToDelete.value.id}`,
        {
          method: 'DELETE',
        }
      )

      if (!error.value) {
        // Remover da lista local
        alerts.value = alerts.value.filter(
          alert => alert.id !== alertToDelete.value!.id
        )
        showDeleteModal.value = false
        alertToDelete.value = null
      } else {
        console.error('Erro ao deletar alerta:', error.value)
      }
    } catch (err) {
      console.error('Erro ao deletar alerta:', err)
    } finally {
      isDeleting.value = false
    }
  }

  // Confirmar exclusão
  const confirmDelete = (alert: Alert) => {
    alertToDelete.value = alert
    showDeleteModal.value = true
  }

  // Cancelar exclusão
  const cancelDelete = () => {
    showDeleteModal.value = false
    alertToDelete.value = null
  }

  // Alternar status do alerta
  const toggleAlert = async (alert: Alert) => {
    try {
      const { error } = await useSanctumFetch(
        `/api/promotional-alerts/${alert.id}`,
        {
          method: 'PUT',
          body: {
            threshold: parseFloat(alert.threshold),
            active: !alert.active,
          },
        }
      )

      if (!error.value) {
        // Atualizar o status local
        alert.active = !alert.active
      } else {
        console.error('Erro ao alterar status do alerta:', error.value)
      }
    } catch (err) {
      console.error('Erro ao alterar status do alerta:', err)
    }
  }

  // Abrir modal de edição
  const openEditModal = (alert: Alert) => {
    editingAlert.value = alert
    alertThreshold.value = alert.threshold
    alertActive.value = alert.active
    showEditAlertModal.value = true
  }

  // Fechar modal de edição
  const closeEditModal = () => {
    showEditAlertModal.value = false
    editingAlert.value = null
    alertThreshold.value = ''
    alertActive.value = true
  }

  // Salvar alterações do alerta
  const saveAlert = async () => {
    if (!editingAlert.value) return

    isSavingAlert.value = true

    try {
      const { error } = await useSanctumFetch(
        `/api/promotional-alerts/${editingAlert.value.id}`,
        {
          method: 'PUT',
          body: {
            threshold: parseFloat(alertThreshold.value),
            active: alertActive.value,
          },
        }
      )

      if (!error.value) {
        // Atualizar o alerta local
        editingAlert.value.threshold = alertThreshold.value
        editingAlert.value.active = alertActive.value
        closeEditModal()
      } else {
        console.error('Erro ao salvar alerta:', error.value)
      }
    } catch (err) {
      console.error('Erro ao salvar alerta:', err)
    } finally {
      isSavingAlert.value = false
    }
  }

  // Criar novo alerta
  const createAlert = () => {
    navigateTo('/alerts/create')
  }

  // Formatação de tipos de programa
  const formatProgramType = (type: string) => {
    const types: Record<string, string> = {
      cashback: 'Cashback',
      points: 'Pontos',
      miles: 'Milhas',
    }
    return types[type] || type
  }

  // Obter ícone baseado no tipo de programa
  const getThresholdIcon = (alert: Alert) => {
    const programType = alert.program?.type || alert.program_type

    switch (programType) {
      case 'cashback':
        return 'mdi-percent'
      case 'miles':
        return 'mdi-airplane'
      case 'points':
        return 'mdi-star'
      default:
        return 'mdi-percent'
    }
  }

  // Obter cor do ícone baseado no tipo de programa
  const getThresholdIconColor = (alert: Alert) => {
    const programType = alert.program?.type || alert.program_type

    switch (programType) {
      case 'cashback':
        return 'primary'
      case 'miles':
        return 'primary'
      case 'points':
        return 'secondary'
      default:
        return 'warning'
    }
  }

  // Formatação de data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  // Verificar se é primeira visita
  const checkFirstVisit = () => {
    const hasVisited = localStorage.getItem('alerts_visited')
    if (!hasVisited) {
      isFirstVisit.value = true
      showOnboardingModal.value = true
      localStorage.setItem('alerts_visited', 'true')
    } else {
      isFirstVisit.value = false
    }
  }

  // Fechar modal de onboarding
  const closeOnboardingModal = () => {
    showOnboardingModal.value = false
  }

  // Ir para configuração do WhatsApp
  const goToWhatsAppConfig = () => {
    showOnboardingModal.value = false
    navigateTo('/alerts/configure')
  }

  // Lifecycle
  onMounted(() => {
    checkFirstVisit()
    fetchAlerts()
  })
</script>

<template>
  <v-container class="alerts-view" fluid>
    <!-- Header -->
    <div class="alerts-header mb-6">
      <div class="header-content">
        <div class="header-text">
          <h1 class="text-h5 font-weight-bold mb-2">Meus Alertas</h1>
          <p class="text-body-2 text-medium-emphasis">
            Gerencie seus alertas de ofertas e cashbacks
          </p>
        </div>

        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus"
          @click="createAlert"
          class="create-alert-btn"
          size="default"
        >
          <span class="d-none d-sm-inline">Novo Alerta</span>
          <span class="d-sm-none">Novo</span>
        </v-btn>
      </div>
    </div>

    <!-- Banner de Configuração do WhatsApp -->
    <WhatsAppBanner
      :is-whats-app-configured="isWhatsAppConfigured"
      :show-banner="showWhatsAppBanner"
      @close="showWhatsAppBanner = false"
      @configure="navigateTo('/alerts/configure')"
    />

    <!-- Lista de Alertas -->
    <div v-if="alerts.length > 0" class="alerts-list">
      <v-row>
        <v-col v-for="alert in alerts" :key="alert.id" cols="12" sm="6" lg="4">
          <v-card
            class="alert-card"
            :class="{ 'alert-disabled': !alert.active }"
            elevation="2"
          >
            <v-card-text class="pa-4">
              <!-- Status -->
              <AlertStatusSection
                :alert="alert"
                @toggle="toggleAlert"
                @edit="openEditModal"
                @delete="confirmDelete"
              />

              <!-- Ecommerce ou Categoria -->
              <div class="ecommerce-section mb-3">
                <div v-if="alert.ecommerce" class="d-flex align-center mb-2">
                  <div class="ecommerce-logo me-3">
                    <v-img
                      :src="alert.ecommerce.logo_url"
                      :alt="alert.ecommerce.name"
                      height="32"
                      max-width="48"
                      contain
                    >
                      <template #error>
                        <div class="logo-error">
                          <v-icon icon="mdi-store" size="16" color="grey" />
                        </div>
                      </template>
                    </v-img>
                  </div>
                  <div>
                    <p class="text-subtitle-2 font-weight-medium mb-0">
                      {{ alert.ecommerce.name }}
                    </p>
                    <p class="text-caption text-medium-emphasis">
                      {{ alert.ecommerce.category }}
                    </p>
                  </div>
                </div>

                <div
                  v-else-if="alert.ecommerce_category"
                  class="category-display"
                >
                  <v-icon color="primary" size="20" class="me-2"
                    >mdi-tag</v-icon
                  >
                  <span class="text-subtitle-2 font-weight-medium">
                    {{ alert.ecommerce_category }}
                  </span>
                </div>
              </div>

              <!-- Programa ou Tipo -->
              <div class="program-section mb-3">
                <div v-if="alert.program" class="d-flex align-center">
                  <div class="program-logo me-3">
                    <v-img
                      :src="alert.program.logo_url"
                      :alt="alert.program.name"
                      height="24"
                      max-width="32"
                      contain
                    >
                      <template #error>
                        <div class="logo-error-small">
                          <v-icon icon="mdi-gift" size="12" color="grey" />
                        </div>
                      </template>
                    </v-img>
                  </div>
                  <div>
                    <p class="text-body-2 font-weight-medium mb-0">
                      {{ alert.program.name }}
                    </p>
                    <v-chip size="x-small" variant="tonal" color="secondary">
                      {{ formatProgramType(alert.program.type) }}
                    </v-chip>
                  </div>
                </div>

                <div
                  v-else-if="alert.program_type"
                  class="program-type-display"
                >
                  <v-icon color="primary" size="20" class="me-2"
                    >mdi-gift</v-icon
                  >
                  <span class="text-body-2 font-weight-medium">
                    {{ formatProgramType(alert.program_type) }}
                  </span>
                </div>
              </div>

              <!-- Threshold -->
              <div class="threshold-section mb-3">
                <div class="d-flex align-center">
                  <v-icon
                    :color="getThresholdIconColor(alert)"
                    size="20"
                    class="me-2"
                  >
                    {{ getThresholdIcon(alert) }}
                  </v-icon>
                  <span class="text-body-2">
                    <template
                      v-if="
                        (alert.program?.type || alert.program_type) === 'points'
                      "
                    >
                      Alerta a partir de
                      <strong>{{ alert.threshold }}</strong> pontos
                    </template>
                    <template
                      v-else-if="
                        (alert.program?.type || alert.program_type) === 'miles'
                      "
                    >
                      Alerta a partir de
                      <strong>{{ alert.threshold }}</strong> milhas
                    </template>
                    <template v-else>
                      Alerta a partir de <strong>{{ alert.threshold }}%</strong>
                    </template>
                  </span>
                </div>
              </div>

              <!-- Data de criação -->
              <div class="date-section">
                <p class="text-caption text-medium-emphasis mb-0">
                  Criado em {{ formatDate(alert.created_at) }}
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Loading mais alertas -->
      <div v-if="hasMore" class="text-center mt-6">
        <v-btn variant="outlined" :loading="isLoading" @click="loadMore">
          Carregar mais alertas
        </v-btn>
      </div>
    </div>

    <!-- Estado vazio -->
    <div v-else-if="!isLoading" class="empty-state text-center py-12">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">
        mdi-bell-off
      </v-icon>
      <h3 class="text-h6 font-weight-medium mb-2">Nenhum alerta configurado</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        Crie seu primeiro alerta para receber notificações sobre ofertas
      </p>
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="mdi-plus"
        @click="createAlert"
      >
        Criar Primeiro Alerta
      </v-btn>
    </div>

    <!-- Loading inicial -->
    <div
      v-if="isLoading && alerts.length === 0"
      class="loading-state text-center py-12"
    >
      <v-progress-circular indeterminate color="primary" size="48" />
      <p class="text-body-2 text-medium-emphasis mt-4">Carregando alertas...</p>
    </div>

    <!-- Modal de confirmação de exclusão -->
    <v-dialog v-model="showDeleteModal" max-width="400" persistent>
      <v-card>
        <v-card-title class="d-flex align-center pa-4">
          <v-icon color="error" size="24" class="me-2">mdi-delete</v-icon>
          <span>Excluir Alerta</span>
        </v-card-title>

        <v-card-text class="pa-4">
          <p class="text-body-2 mb-0">
            Tem certeza que deseja excluir este alerta? Esta ação não pode ser
            desfeita.
          </p>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-btn variant="text" :disabled="isDeleting" @click="cancelDelete">
            Cancelar
          </v-btn>

          <v-spacer />

          <v-btn
            color="error"
            variant="flat"
            :loading="isDeleting"
            @click="deleteAlert"
          >
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de edição de alerta -->
    <v-dialog v-model="showEditAlertModal" max-width="500" persistent>
      <v-card>
        <v-card-title class="d-flex align-center pa-4">
          <v-icon color="primary" size="24" class="me-2">mdi-pencil</v-icon>
          <span>Editar Alerta</span>
        </v-card-title>

        <v-card-text class="pa-4">
          <div v-if="editingAlert" class="edit-form">
            <!-- Informações do alerta -->
            <div class="alert-info mb-4">
              <div
                v-if="editingAlert.ecommerce"
                class="d-flex align-center mb-2"
              >
                <v-img
                  :src="editingAlert.ecommerce.logo_url"
                  :alt="editingAlert.ecommerce.name"
                  height="24"
                  max-width="32"
                  contain
                  class="me-2"
                />
                <span class="text-subtitle-2">{{
                  editingAlert.ecommerce.name
                }}</span>
              </div>

              <div v-if="editingAlert.program" class="d-flex align-center">
                <v-img
                  :src="editingAlert.program.logo_url"
                  :alt="editingAlert.program.name"
                  height="20"
                  max-width="28"
                  contain
                  class="me-2"
                />
                <span class="text-body-2">{{ editingAlert.program.name }}</span>
              </div>
            </div>

            <!-- Limite do alerta -->
            <v-text-field
              v-model="alertThreshold"
              label="Limite mínimo"
              :suffix="
                (editingAlert.program?.type || editingAlert.program_type) ===
                'points'
                  ? 'pontos'
                  : (editingAlert.program?.type ||
                        editingAlert.program_type) === 'miles'
                    ? 'milhas'
                    : '%'
              "
              type="number"
              variant="outlined"
              density="comfortable"
              class="mb-4"
            />
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-btn
            variant="text"
            :disabled="isSavingAlert"
            @click="closeEditModal"
          >
            Cancelar
          </v-btn>

          <v-spacer />

          <v-btn
            color="primary"
            variant="flat"
            :loading="isSavingAlert"
            @click="saveAlert"
          >
            Salvar Alterações
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de Onboarding do WhatsApp -->
    <AlertsOnboardingModal
      v-model="showOnboardingModal"
      @configure="goToWhatsAppConfig"
      @close="closeOnboardingModal"
    />
  </v-container>
</template>

<style scoped>
  .alerts-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
  }

  .alerts-header {
    padding: 16px 0;
  }

  .header-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .header-text {
    flex: 1;
  }

  .create-alert-btn {
    align-self: stretch;
    min-height: 48px;
  }

  .alert-card {
    border-radius: 12px;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    height: 100%;
  }

  .alert-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  }

  .alert-disabled {
    opacity: 0.6;
    filter: grayscale(0.3);
  }

  .alert-disabled .v-chip {
    opacity: 0.7;
  }

  .ecommerce-logo,
  .program-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 8px;
    padding: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .ecommerce-logo {
    width: 48px;
    height: 32px;
  }

  .program-logo {
    width: 32px;
    height: 24px;
  }

  .logo-error,
  .logo-error-small {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
  }

  .category-display,
  .program-type-display {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: rgba(var(--v-theme-surface), 0.5);
    border-radius: 8px;
    border: 1px solid rgba(var(--v-theme-outline), 0.2);
  }

  .threshold-section {
    padding: 8px 12px;
    background: rgba(var(--v-theme-warning), 0.1);
    border-radius: 8px;
    border: 1px solid rgba(var(--v-theme-warning), 0.2);
  }

  .empty-state {
    max-width: 400px;
    margin: 0 auto;
  }

  .v-switch {
    transition: all 0.3s ease;
  }

  .edit-form .alert-info {
    padding: 12px;
    background: rgba(var(--v-theme-surface), 0.5);
    border-radius: 8px;
    border: 1px solid rgba(var(--v-theme-outline), 0.2);
  }

  /* Tablet and desktop adjustments */
  @media (min-width: 600px) {
    .header-content {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    .create-alert-btn {
      align-self: auto;
      min-height: auto;
      flex-shrink: 0;
    }

    .banner-content {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    .banner-btn {
      align-self: auto;
      min-height: auto;
      flex-shrink: 0;
    }

    .alert-status-section {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .status-row {
      gap: 12px;
    }
  }

  /* Mobile adjustments */
  @media (max-width: 599px) {
    .alerts-view {
      padding: 12px;
    }

    .alerts-header {
      padding: 12px 0;
    }

    .header-content {
      gap: 12px;
    }

    .alert-actions {
      margin-top: 8px;
      flex-wrap: wrap;
    }
  }

  /* Dark theme adjustments */
  .v-theme--dark .ecommerce-logo,
  .v-theme--dark .program-logo {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
  }

  .v-theme--dark .logo-error,
  .v-theme--dark .logo-error-small {
    background: rgba(255, 255, 255, 0.05);
  }
</style>
