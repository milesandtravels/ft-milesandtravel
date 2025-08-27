<script lang="ts" setup>
  import type { ProgramType } from '~/interfaces/program'
  import type { User } from '~/types/user'
  import { useDisplay } from 'vuetify'

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

  // Estados do sistema de abas
  const activeTab = ref('alerts')

  // Configuração das abas
  const tabs = computed(() => [
    {
      value: 'alerts',
      label: 'Meus Alertas',
      icon: 'mdi-bell-outline',
    },
    {
      value: 'channels',
      label: 'Canais',
      icon: 'mdi-tune',
    },
  ])

  // Estados para configuração do WhatsApp
  const { user } = useSanctumAuth<User>()
  const { xs, sm } = useDisplay()
  const isWhatsAppConfigured = computed(
    () => user.value?.whatsapp_notification_enabled || false
  )
  const showOnboardingModal = ref(false)
  const isFirstVisit = ref(true)

  // Estados para canais de notificação
  const whatsappEnabled = ref(false)
  const pushEnabled = ref(false)
  const isLoadingWhatsApp = ref(false)
  const isLoadingPush = ref(false)

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
    activeTab.value = 'channels'
  }

  // Estados para configuração completa do WhatsApp (integração com configure.vue)
  const showWhatsAppModal = ref(false)
  const showDisableConfirmModal = ref(false)
  const currentStep = ref<'contact' | 'phone' | 'verification'>('contact')
  const phoneNumber = ref('')
  const verificationCode = ref('')
  const phoneError = ref('')
  const codeError = ref('')
  const showContactRequiredDialog = ref(false)
  const resendCooldown = ref(0)
  let resendTimer: NodeJS.Timeout | null = null

  // Configurações do WhatsApp Business
  const whatsappBusinessNumber = '+55 (41) 3790-0172'
  const whatsappBusinessLink =
    'https://wa.me/554137900172?text=Olá,%20gostaria%20de%20receber%20alertas%20de%20ofertas%20e%20cashbacks'

  // Handlers para canais de notificação
  const handleWhatsAppToggle = async (enabled: boolean | null) => {
    if (enabled === null) return

    if (enabled && !user.value?.whatsapp_notification_enabled) {
      // Verificar se o usuário já tem telefone cadastrado
      if (user.value?.phone) {
        // Usuário já tem telefone, apenas habilitar diretamente
        try {
          isLoadingWhatsApp.value = true
          await enableWhatsAppNotifications(true)
          whatsappEnabled.value = true
        } catch (error) {
          console.error('Erro ao habilitar WhatsApp:', error)
          whatsappEnabled.value = false
        } finally {
          isLoadingWhatsApp.value = false
        }
      } else {
        // Usuário não tem telefone, mostrar modal de configuração
        showWhatsAppModal.value = true
        resetWhatsAppModal()
      }
    } else if (!enabled && user.value?.whatsapp_notification_enabled) {
      // Mostrar modal de confirmação antes de desabilitar
      showDisableConfirmModal.value = true
      // Reverter o toggle temporariamente
      whatsappEnabled.value = true
    }
  }

  const handlePushToggle = async (enabled: boolean | null) => {
    if (enabled === null) return
    isLoadingPush.value = true

    try {
      await useSanctumFetch('/api/user/notification-settings', {
        method: 'PUT',
        body: {
          push_notification_enabled: enabled,
        },
      })

      pushEnabled.value = enabled
      if (user.value) {
        user.value.push_notification_enabled = enabled
      }

      console.log('Avisos no celular:', enabled ? 'ativados' : 'desativados')
    } catch (error) {
      console.error('Erro ao configurar avisos no celular:', error)

      // Reverter estado em caso de erro
      pushEnabled.value = !enabled
    } finally {
      isLoadingPush.value = false
    }
  }

  // Formatação do telefone
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length <= 10) {
      return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
    } else {
      return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
    }
  }

  // Funções do WhatsApp (integração com configure.vue)
  const openWhatsAppContact = () => {
    window.open(whatsappBusinessLink, '_blank')
  }

  const proceedToPhoneStep = () => {
    currentStep.value = 'phone'
  }

  const sendVerificationCode = async () => {
    if (!isPhoneValid.value) return

    isLoadingWhatsApp.value = true
    phoneError.value = ''

    try {
      const cleanPhone = phoneNumber.value.replace(/\D/g, '')
      const { data, error } = await useSanctumFetch(`/api/otp/send`, {
        method: 'POST',
        body: {
          phone: `55${cleanPhone}`,
        },
      })

      if (error.value?.statusCode === 404) {
        showContactRequiredDialog.value = true
      } else if (data && data.value) {
        currentStep.value = 'verification'
        startResendCooldown()
      } else {
        phoneError.value = 'Erro inesperado. Tente novamente.'
      }
    } catch (error: any) {
      phoneError.value =
        error.data?.message || 'Erro de conexão. Tente novamente.'
    } finally {
      isLoadingWhatsApp.value = false
    }
  }

  const verifyCode = async () => {
    if (verificationCode.value.length !== 5) return

    isLoadingWhatsApp.value = true
    codeError.value = ''

    try {
      const cleanPhone = phoneNumber.value.replace(/\D/g, '')
      await useSanctumFetch(`/api/otp/validate`, {
        method: 'POST',
        body: {
          phone: `55${cleanPhone}`,
          token: verificationCode.value,
        },
      })

      await enableWhatsAppNotifications(true)
      whatsappEnabled.value = true
      showWhatsAppModal.value = false
    } catch (error) {
      codeError.value = 'Código inválido. Tente novamente.'
    } finally {
      isLoadingWhatsApp.value = false
    }
  }

  const enableWhatsAppNotifications = async (enable: boolean) => {
    const { data, error } = await useSanctumFetch(
      '/api/user/notification-settings',
      {
        method: 'PUT',
        body: {
          whatsapp_notification_enabled: enable,
        },
      }
    )

    if (error.value) {
      throw new Error('Erro ao atualizar configurações do WhatsApp')
    }

    if (user.value) {
      user.value.whatsapp_notification_enabled = enable
    }

    return data.value
  }

  const confirmDisableWhatsApp = async () => {
    isLoadingWhatsApp.value = true

    try {
      await useSanctumFetch('/api/user/notification-settings', {
        method: 'PUT',
        body: {
          whatsapp_notification_enabled: false,
        },
      })

      whatsappEnabled.value = false
      if (user.value) {
        user.value.whatsapp_notification_enabled = false
      }

      showDisableConfirmModal.value = false
    } catch (error) {
      console.error('Erro ao desabilitar WhatsApp:', error)
      whatsappEnabled.value = true
    } finally {
      isLoadingWhatsApp.value = false
    }
  }

  const cancelWhatsAppSetup = () => {
    whatsappEnabled.value = user.value?.whatsapp_notification_enabled || false
    showWhatsAppModal.value = false
    resetWhatsAppModal()
  }

  const cancelDisableWhatsApp = () => {
    showDisableConfirmModal.value = false
    whatsappEnabled.value = true
  }

  const resetWhatsAppModal = () => {
    currentStep.value = 'contact'
    phoneNumber.value = ''
    verificationCode.value = ''
    phoneError.value = ''
    codeError.value = ''
    showContactRequiredDialog.value = false
    clearResendTimer()
  }

  const startResendCooldown = () => {
    resendCooldown.value = 60
    resendTimer = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0) {
        clearResendTimer()
      }
    }, 1000)
  }

  const clearResendTimer = () => {
    if (resendTimer) {
      clearInterval(resendTimer)
      resendTimer = null
    }
    resendCooldown.value = 0
  }

  // Validações
  const isPhoneValid = computed(() => {
    const cleanPhone = phoneNumber.value.replace(/\D/g, '')
    return (
      cleanPhone.length >= 10 && cleanPhone.length <= 11 && !phoneError.value
    )
  })

  // Formatação do telefone para input
  const formatPhoneInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    let value = target.value.replace(/\D/g, '')

    if (value.length > 11) {
      value = value.slice(0, 11)
    }

    if (value.length <= 2) {
      phoneNumber.value = value
    } else if (value.length <= 6) {
      phoneNumber.value = `(${value.slice(0, 2)}) ${value.slice(2)}`
    } else if (value.length <= 10) {
      phoneNumber.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`
    } else {
      phoneNumber.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`
    }

    phoneError.value = ''
  }

  // Inicializar estados dos canais
  const initializeChannelStates = () => {
    whatsappEnabled.value = user.value?.whatsapp_notification_enabled || false
    pushEnabled.value = false // Implementar quando push estiver disponível
  }

  // Cleanup
  onUnmounted(() => {
    clearResendTimer()
  })

  // Verificar query params para aba inicial
  const route = useRoute()
  const initializeTab = () => {
    const tabParam = route.query.tab as string
    if (tabParam && ['alerts', 'channels'].includes(tabParam)) {
      activeTab.value = tabParam
    }
  }

  // Lifecycle
  onMounted(() => {
    checkFirstVisit()
    fetchAlerts()
    initializeChannelStates()
    initializeTab()
  })
</script>

<template>
  <v-container class="alerts-container" fluid>
    <!-- Header -->
    <div class="alerts-header mb-6">
      <div class="header-content">
        <div class="header-text">
          <h1 class="text-h5 font-weight-bold mb-2">Centro de Alertas</h1>
          <p class="text-body-2 text-medium-emphasis">
            Gerencie seus alertas e configure os canais de notificação
          </p>
        </div>
      </div>
    </div>

    <!-- Sistema de Abas - Design Limpo -->
    <div class="tabs-navigation mb-6">
      <div class="tabs-wrapper">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          :class="['tab-button', { 'tab-active': activeTab === tab.value }]"
        >
          <v-icon :size="20" class="tab-icon">{{ tab.icon }}</v-icon>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- Conteúdo das Abas -->
    <v-window v-model="activeTab" class="tabs-content">
      <!-- Aba 1: Meus Alertas -->
      <v-window-item value="alerts" class="tab-content">
        <div class="alerts-tab">
          <!-- Botão Criar Alerta -->
          <div class="d-flex justify-end mb-4">
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

          <!-- Lista de Alertas -->
          <div v-if="alerts.length > 0" class="alerts-list">
            <v-row>
              <v-col
                v-for="alert in alerts"
                :key="alert.id"
                cols="12"
                sm="6"
                lg="4"
              >
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
                      <div
                        v-if="alert.ecommerce"
                        class="d-flex align-center mb-2"
                      >
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
                                <v-icon
                                  icon="mdi-store"
                                  size="16"
                                  color="grey"
                                />
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
                                <v-icon
                                  icon="mdi-gift"
                                  size="12"
                                  color="grey"
                                />
                              </div>
                            </template>
                          </v-img>
                        </div>
                        <div>
                          <p class="text-body-2 font-weight-medium mb-0">
                            {{ alert.program.name }}
                          </p>
                          <v-chip
                            size="x-small"
                            variant="tonal"
                            color="secondary"
                          >
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
                              (alert.program?.type || alert.program_type) ===
                              'points'
                            "
                          >
                            Alerta a partir de
                            <strong>{{ alert.threshold }}</strong> pontos
                          </template>
                          <template
                            v-else-if="
                              (alert.program?.type || alert.program_type) ===
                              'miles'
                            "
                          >
                            Alerta a partir de
                            <strong>{{ alert.threshold }}</strong> milhas
                          </template>
                          <template v-else>
                            Alerta a partir de
                            <strong>{{ alert.threshold }}%</strong>
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
            <h3 class="text-h6 font-weight-medium mb-2">
              Nenhum alerta configurado
            </h3>
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
            <p class="text-body-2 text-medium-emphasis mt-4">
              Carregando alertas...
            </p>
          </div>
        </div>
      </v-window-item>

      <!-- Aba 2: Canais de Notificação -->
      <v-window-item value="channels" class="tab-content">
        <div class="channels-tab">
          <!-- Banner informativo -->
          <v-alert
            type="info"
            variant="tonal"
            class="mb-4"
            icon="mdi-information"
          >
            <div class="text-body-2">
              Configure os canais pelos quais deseja receber suas notificações
              de alertas.
            </div>
          </v-alert>

          <!-- WhatsApp Settings Card -->
          <v-card class="channel-card whatsapp-card mb-4" elevation="1">
            <v-card-text class="pa-4">
              <div class="channel-content">
                <div class="channel-info">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="success" size="28" class="me-3"
                      >mdi-whatsapp</v-icon
                    >
                    <div>
                      <h3 class="text-h6 font-weight-medium">
                        {{ xs || sm ? 'Receba no WhatsApp' : 'WhatsApp' }}
                      </h3>
                      <p class="text-caption text-medium-emphasis mb-0">
                        Disponível
                      </p>
                    </div>
                  </div>
                  <p class="text-body-2 text-medium-emphasis mb-2">
                    {{
                      xs || sm
                        ? 'Receba mensagens sobre ofertas e cashbacks diretamente no seu WhatsApp'
                        : 'Receba notificações instantâneas sobre as melhores ofertas e cashbacks diretamente no seu WhatsApp'
                    }}
                  </p>
                  <div
                    v-if="isWhatsAppConfigured && user?.phone"
                    class="phone-display"
                  >
                    <v-chip size="small" color="success" variant="tonal">
                      <v-icon start size="16">mdi-check-circle</v-icon>
                      {{ formatPhone(user.phone) }}
                    </v-chip>
                  </div>
                </div>

                <div class="channel-switch">
                  <v-switch
                    v-model="whatsappEnabled"
                    color="success"
                    density="compact"
                    hide-details
                    :disabled="isLoadingWhatsApp"
                    @update:model-value="handleWhatsAppToggle"
                  />
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Avisos no Celular Card -->
          <v-card class="channel-card push-card mb-4" elevation="1">
            <v-card-text class="pa-4">
              <div class="channel-content">
                <div class="channel-info">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="primary" size="28" class="me-3"
                      >mdi-bell</v-icon
                    >
                    <div>
                      <h3 class="text-h6 font-weight-medium">
                        {{
                          xs || sm ? 'Receba no celular' : 'Receba no navegador'
                        }}
                      </h3>
                      <p class="text-caption text-medium-emphasis mb-0">
                        Disponível
                      </p>
                    </div>
                  </div>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    {{
                      xs || sm
                        ? 'Receba avisos instantâneos no seu celular, mesmo quando não estiver usando o app'
                        : 'Receba avisos instantâneos no seu navegador, mesmo quando não estiver usando o site'
                    }}
                  </p>
                </div>

                <div class="channel-switch">
                  <v-switch
                    v-model="pushEnabled"
                    color="primary"
                    density="compact"
                    hide-details
                    :disabled="isLoadingPush"
                    @update:model-value="handlePushToggle"
                  />
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Telegram Card (Em breve) -->
          <v-card class="channel-card telegram-card" elevation="1" disabled>
            <v-card-text class="pa-4">
              <div class="channel-content">
                <div class="channel-info">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="info" size="28" class="me-3"
                      >mdi-telegram</v-icon
                    >
                    <div>
                      <h3
                        class="text-h6 font-weight-medium text-medium-emphasis"
                      >
                        {{ xs || sm ? 'Receba no Telegram' : 'Telegram' }}
                      </h3>
                      <v-chip size="x-small" color="info" variant="tonal">
                        Em breve
                      </v-chip>
                    </div>
                  </div>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    {{
                      xs || sm
                        ? 'Receba mensagens no Telegram (em breve)'
                        : 'Receba notificações através do Telegram (funcionalidade em desenvolvimento)'
                    }}
                  </p>
                </div>

                <div class="channel-switch">
                  <v-switch
                    model-value="false"
                    color="info"
                    density="compact"
                    hide-details
                    disabled
                  />
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-window-item>
    </v-window>

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

    <!-- Modal de Configuração do WhatsApp (da página configure.vue) -->
    <v-dialog
      v-model="showWhatsAppModal"
      max-width="500"
      persistent
      :fullscreen="$vuetify.display.mobile"
    >
      <v-card class="whatsapp-modal">
        <v-card-title class="d-flex align-center pa-4 pb-2">
          <v-icon color="success" size="28" class="me-2">mdi-whatsapp</v-icon>
          <span class="text-h6">Configurar WhatsApp</span>
        </v-card-title>

        <v-card-text class="pa-4">
          <!-- Contact Step -->
          <div v-if="currentStep === 'contact'" class="contact-step">
            <div class="text-center mb-4">
              <v-icon color="success" size="64" class="mb-3"
                >mdi-whatsapp</v-icon
              >
              <h3 class="text-h6 mb-2">Entre em contato conosco</h3>
              <p class="text-body-2 text-medium-emphasis mb-4">
                Para começar a receber alertas, você precisa primeiro entrar em
                contato conosco pelo WhatsApp.
              </p>
            </div>

            <div class="contact-info mb-4">
              <v-alert type="info" variant="tonal" class="mb-3">
                <div class="d-flex align-start">
                  <div>
                    <strong>Importante:</strong> Após entrar em contato, retorne
                    aqui para configurar seus alertas.
                  </div>
                </div>
              </v-alert>

              <div class="whatsapp-number-display">
                <v-card variant="outlined" class="pa-3">
                  <div class="d-flex align-center justify-center">
                    <v-icon color="success" size="20" class="me-2"
                      >mdi-whatsapp</v-icon
                    >
                    <span class="text-h6">{{ whatsappBusinessNumber }}</span>
                  </div>
                </v-card>
              </div>
            </div>
          </div>

          <!-- Phone Input Step -->
          <div v-if="currentStep === 'phone'" class="phone-step">
            <div class="step-indicator mb-4">
              <v-chip size="small" color="success" variant="tonal">
                <v-icon start size="14">mdi-check</v-icon>
                Contato realizado
              </v-chip>
            </div>

            <p class="text-body-2 text-medium-emphasis mb-4">
              Agora digite seu número de WhatsApp para receber um código de
              confirmação
            </p>

            <v-text-field
              v-model="phoneNumber"
              label="Número do WhatsApp"
              placeholder="(11) 99999-9999"
              prepend-inner-icon="mdi-phone"
              variant="outlined"
              density="comfortable"
              :error-messages="phoneError"
              :disabled="isLoadingWhatsApp"
              @input="formatPhoneInput"
              @keyup.enter="sendVerificationCode"
            />
          </div>

          <!-- Verification Code Step -->
          <div v-if="currentStep === 'verification'" class="verification-step">
            <div class="step-indicator mb-3">
              <v-chip size="small" color="success" variant="tonal" class="me-2">
                <v-icon start size="14">mdi-check</v-icon>
                Contato realizado
              </v-chip>
              <v-chip size="small" color="success" variant="tonal">
                <v-icon start size="14">mdi-check</v-icon>
                Telefone adicionado
              </v-chip>
            </div>

            <div class="text-center mb-4">
              <v-icon color="success" size="48" class="mb-2"
                >mdi-message-text</v-icon
              >
              <p class="text-body-2 text-medium-emphasis">
                Enviamos um código de verificação para<br />
                <strong>{{ formatPhone(phoneNumber) }}</strong>
              </p>
            </div>

            <v-otp-input
              v-model="verificationCode"
              :length="5"
              variant="outlined"
              :disabled="isLoadingWhatsApp"
              :error="!!codeError"
              @finish="verifyCode"
            />

            <v-alert v-if="codeError" type="error" variant="tonal" class="mt-3">
              {{ codeError }}
            </v-alert>

            <div class="resend-section mt-4 text-center">
              <p class="text-caption text-medium-emphasis mb-2">
                Não recebeu o código?
              </p>
              <v-btn
                color="primary"
                variant="text"
                size="small"
                :disabled="isLoadingWhatsApp || resendCooldown > 0"
                @click="sendVerificationCode"
              >
                <v-icon start size="16">mdi-refresh</v-icon>
                {{
                  resendCooldown > 0
                    ? `Reenviar em ${resendCooldown}s`
                    : 'Reenviar código'
                }}
              </v-btn>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0 flex-column">
          <!-- Contact Step Actions -->
          <template v-if="currentStep === 'contact'">
            <v-btn
              color="success"
              variant="flat"
              :disabled="isLoadingWhatsApp"
              :loading="isLoadingWhatsApp"
              block
              class="mb-2"
              @click="openWhatsAppContact"
            >
              <v-icon start>mdi-whatsapp</v-icon>
              Entrar em contato
            </v-btn>

            <v-btn
              color="primary"
              variant="outlined"
              block
              class="mb-2"
              @click="proceedToPhoneStep"
            >
              Já entrei em contato
            </v-btn>
          </template>

          <!-- Phone Step Actions -->
          <v-btn
            v-if="currentStep === 'phone'"
            color="success"
            variant="flat"
            :disabled="!isPhoneValid || isLoadingWhatsApp"
            :loading="isLoadingWhatsApp"
            block
            class="mb-2"
            @click="sendVerificationCode"
          >
            Enviar código
          </v-btn>

          <!-- Verification Step Actions -->
          <v-btn
            v-if="currentStep === 'verification'"
            color="success"
            variant="flat"
            :disabled="verificationCode.length !== 5 || isLoadingWhatsApp"
            :loading="isLoadingWhatsApp"
            block
            class="mb-2"
            @click="verifyCode"
          >
            Confirmar
          </v-btn>

          <!-- Cancel Button -->
          <v-btn
            variant="text"
            :disabled="isLoadingWhatsApp"
            size="small"
            @click="cancelWhatsAppSetup"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de confirmação para desabilitar WhatsApp -->
    <v-dialog
      v-model="showDisableConfirmModal"
      max-width="440"
      persistent
      :fullscreen="$vuetify.display.mobile"
    >
      <v-card class="disable-confirm-modal" elevation="8">
        <div class="disable-modal-header pa-6 pb-4">
          <div class="text-center">
            <div class="warning-icon-container mb-3">
              <v-icon color="warning" size="40"
                >mdi-alert-circle-outline</v-icon
              >
            </div>
            <h2 class="text-h5 font-weight-bold mb-2">Desabilitar alertas</h2>
            <p class="text-body-1 text-medium-emphasis">
              Você está prestes a desativar as notificações do WhatsApp
            </p>
          </div>
        </div>

        <v-card-text class="pa-6 pt-2">
          <div class="consequences-section">
            <h3 class="text-subtitle-1 font-weight-medium mb-3 text-center">
              O que acontecerá:
            </h3>

            <div class="consequences-grid">
              <v-card
                variant="outlined"
                class="consequence-card pa-3 mb-3"
                color="primary"
              >
                <div class="d-flex align-start">
                  <v-avatar size="32" color="primary" class="me-3 mt-1">
                    <v-icon color="white" size="18">mdi-bell-off</v-icon>
                  </v-avatar>
                  <div class="flex-grow-1">
                    <h4 class="text-subtitle-2 font-weight-medium mb-1">
                      Alertas interrompidos
                    </h4>
                    <p class="text-body-2 text-medium-emphasis mb-0">
                      Todos os alertas configurados deixarão de enviar
                      notificações via WhatsApp.
                    </p>
                  </div>
                </div>
              </v-card>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-2">
          <div class="actions-container w-100">
            <v-btn
              color="primary"
              variant="flat"
              :loading="isLoadingWhatsApp"
              :disabled="isLoadingWhatsApp"
              block
              class="mb-3"
              @click="confirmDisableWhatsApp"
            >
              <v-icon start size="20">mdi-whatsapp-off</v-icon>
              Sim, desabilitar alertas
            </v-btn>

            <v-btn
              color="primary"
              variant="outlined"
              :disabled="isLoadingWhatsApp"
              block
              @click="cancelDisableWhatsApp"
            >
              <v-icon start size="18">mdi-arrow-left</v-icon>
              Manter ativo
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Contact Required Dialog -->
    <v-dialog v-model="showContactRequiredDialog" max-width="400" persistent>
      <v-card class="contact-required-modal">
        <v-card-title class="d-flex align-center pa-4 pb-2">
          <v-icon color="warning" size="28" class="me-2"
            >mdi-alert-circle</v-icon
          >
          <span class="text-h6">Contato necessário</span>
        </v-card-title>

        <v-card-text class="pa-4">
          <div class="text-center">
            <v-icon color="warning" size="64" class="mb-3">mdi-whatsapp</v-icon>
            <h3 class="text-h6 mb-3">Número não encontrado</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              O número {{ formatPhone(phoneNumber) }} ainda não entrou em
              contato conosco pelo WhatsApp.
            </p>
            <p class="text-body-2 mb-4">
              <strong
                >Para receber o código de verificação, você precisa primeiro
                iniciar uma conversa conosco.</strong
              >
            </p>

            <div class="whatsapp-contact-info">
              <v-card variant="outlined" class="pa-3 mb-3">
                <div class="d-flex align-center justify-center">
                  <v-icon color="success" size="20" class="me-2"
                    >mdi-whatsapp</v-icon
                  >
                  <span class="text-subtitle-1 font-weight-medium">{{
                    whatsappBusinessNumber
                  }}</span>
                </div>
              </v-card>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0 flex-column">
          <v-btn
            color="success"
            variant="flat"
            block
            class="mb-2"
            @click="openWhatsAppContact"
          >
            <v-icon start>mdi-whatsapp</v-icon>
            Entrar em contato agora
          </v-btn>

          <v-btn
            variant="text"
            size="small"
            @click="showContactRequiredDialog = false"
          >
            Voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
  .alerts-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
  }

  .alerts-header {
    padding: 16px 0;
    text-align: center;
  }

  .header-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .header-text {
    flex: 1;
  }

  /* Sistema de Abas - Design Limpo */
  .tabs-navigation {
    display: flex;
    justify-content: center;
    padding: 0;
  }

  .tabs-wrapper {
    display: inline-flex;
    background: rgba(var(--v-theme-surface-variant), 0.3);
    border-radius: 12px;
    padding: 4px;
    gap: 2px;
  }

  .tab-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: rgba(var(--v-theme-on-surface), 0.7);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: none;
    min-height: 44px;
    position: relative;
    overflow: hidden;
  }

  .tab-button:hover {
    background: rgba(var(--v-theme-primary), 0.08);
    color: rgba(var(--v-theme-on-surface), 0.9);
  }

  .tab-button.tab-active {
    background: rgba(var(--v-theme-primary), 1);
    color: rgb(var(--v-theme-on-primary));
    box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.3);
  }

  .tab-button.tab-active .tab-icon,
  .tab-button.tab-active .tab-label {
    color: rgb(var(--v-theme-on-primary));
  }

  .tab-icon {
    transition: color 0.2s ease;
    flex-shrink: 0;
  }

  .tab-label {
    font-weight: 500;
    white-space: nowrap;
  }

  .tabs-content {
    background: transparent;
  }

  .tab-content {
    padding: 0;
  }

  .alerts-tab,
  .channels-tab {
    width: 100%;
  }

  /* Estilos dos Canais de Notificação */
  .channel-card {
    border-radius: 12px;
    transition: all 0.2s ease;
  }

  .channel-card:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  }

  .whatsapp-card {
    border: 1px solid rgba(var(--v-theme-success), 0.1);
  }

  .whatsapp-card:hover {
    border-color: rgba(var(--v-theme-success), 0.2);
  }

  .push-card {
    border: 1px solid rgba(var(--v-theme-primary), 0.1);
  }

  .push-card:hover {
    border-color: rgba(var(--v-theme-primary), 0.2);
  }

  .telegram-card {
    border: 1px solid rgba(var(--v-theme-surface), 0.3);
    opacity: 0.7;
  }

  .channel-content {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }

  .channel-info {
    flex: 1;
  }

  .channel-switch {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
  }

  .phone-display {
    margin-top: 8px;
  }

  .create-alert-btn {
    min-height: 48px;
  }

  /* Estilos dos Modais do WhatsApp */
  .whatsapp-modal {
    border-radius: 16px;
    overflow: hidden;
  }

  .contact-step,
  .phone-step,
  .verification-step {
    min-height: 120px;
  }

  .step-indicator {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-bottom: 16px;
  }

  .contact-required-modal {
    border-radius: 16px;
    overflow: hidden;
  }

  .disable-confirm-modal {
    border-radius: 16px;
    overflow: hidden;
  }

  .disable-modal-header {
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-warning), 0.05) 0%,
      rgba(var(--v-theme-warning), 0.02) 100%
    );
  }

  .warning-icon-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(var(--v-theme-warning), 0.1);
    border: 2px solid rgba(var(--v-theme-warning), 0.2);
  }

  .resend-section {
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
    padding-top: 16px;
  }

  /* Responsividade das Abas */
  @media (max-width: 600px) {
    .tabs-wrapper {
      width: 100%;
      justify-content: center;
    }

    .tab-button {
      flex: 1;
      justify-content: center;
      padding: 12px 16px;
      gap: 6px;
    }

    .tab-label {
      font-size: 0.8rem;
    }
  }

  /* Desktop layout ajustes */
  @media (min-width: 600px) {
    .channel-content {
      flex-direction: row;
      align-items: flex-start;
      gap: 24px;
    }

    .step-indicator {
      justify-content: flex-start;
    }

    .tabs-wrapper {
      min-width: 320px;
    }
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
