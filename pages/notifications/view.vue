<template>
  <v-container class="pa-4">
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h1 class="text-h5">Notificações</h1>

          <!-- Botão marcar todas como lidas -->
          <v-btn
            v-if="hasUnreadNotifications"
            variant="outlined"
            color="primary"
            size="small"
            prepend-icon="mdi-check-all"
            @click="markAllAsRead"
            :loading="markingAllAsRead"
          >
            Marcar todas como lidas
          </v-btn>
        </div>

        <!-- Loading inicial -->
        <div
          v-if="loading && notifications.length === 0"
          class="text-center py-8"
        >
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <p class="mt-4 text-body-2">Carregando notificações...</p>
        </div>

        <!-- Lista de notificações -->
        <div v-else-if="notifications.length > 0">
          <v-card
            v-for="notification in notifications"
            :key="notification.id"
            class="mb-3 cursor-pointer"
            :class="{ 'notification-unread': !notification.read_at }"
            elevation="2"
            @click="openNotificationModal(notification)"
          >
            <v-card-text class="pa-4">
              <div class="d-flex justify-space-between align-start">
                <div class="flex-grow-1">
                  <!-- Título da notificação -->
                  <h3 class="text-subtitle-1 font-weight-medium mb-2">
                    {{ getNotificationTitle(notification) }}
                  </h3>

                  <!-- Conteúdo da notificação -->
                  <p class="text-body-2 mb-3">
                    {{ getNotificationMessage(notification) }}
                  </p>

                  <!-- Informações adicionais -->
                  <div class="d-flex flex-wrap gap-2 mb-3">
                    <v-chip
                      v-if="notification.data.program_name"
                      size="small"
                      color="primary"
                      variant="outlined"
                    >
                      {{ notification.data.program_name }}
                    </v-chip>

                    <v-chip
                      v-if="notification.data.ecommerce_category"
                      size="small"
                      color="secondary"
                      variant="outlined"
                    >
                      {{ notification.data.ecommerce_category }}
                    </v-chip>

                    <v-chip
                      v-if="notification.data.program_type"
                      size="small"
                      :color="
                        notification.data.program_type === 'points'
                          ? 'success'
                          : 'info'
                      "
                      variant="outlined"
                    >
                      {{
                        notification.data.program_type === 'points'
                          ? 'Pontos'
                          : 'Milhas'
                      }}
                    </v-chip>
                  </div>

                  <!-- Data -->
                  <p class="text-caption text-medium-emphasis">
                    {{ formatDate(notification.created_at) }}
                  </p>
                </div>

                <!-- Botão marcar como lido -->
                <div class="ml-3">
                  <v-btn
                    v-if="!notification.read_at"
                    icon="mdi-check"
                    size="small"
                    color="primary"
                    variant="outlined"
                    @click.stop="markAsRead(notification.id)"
                    :loading="markingAsRead === notification.id"
                  ></v-btn>

                  <v-icon
                    v-else
                    icon="mdi-check-circle"
                    color="success"
                    size="small"
                  ></v-icon>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Loading para mais notificações -->
          <div
            v-if="hasMorePages"
            ref="loadMoreTrigger"
            class="text-center py-4"
          >
            <v-progress-circular
              v-if="loadingMore"
              indeterminate
              color="primary"
              size="32"
            ></v-progress-circular>
            <p v-else class="text-body-2 text-medium-emphasis">
              Carregando mais notificações...
            </p>
          </div>
        </div>

        <!-- Estado vazio -->
        <div v-else class="text-center py-8">
          <v-icon
            icon="mdi-bell-outline"
            size="64"
            color="grey-lighten-1"
            class="mb-4"
          ></v-icon>
          <h3 class="text-h6 mb-2">Nenhuma notificação</h3>
          <p class="text-body-2 text-medium-emphasis">
            Você não possui notificações no momento.
          </p>
        </div>
      </v-col>
    </v-row>

    <!-- Modal de detalhes da notificação -->
    <v-dialog v-model="showNotificationModal" max-width="600px" scrollable>
      <v-card v-if="selectedNotification">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ getNotificationTitle(selectedNotification) }}</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="closeNotificationModal"
          ></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <!-- Conteúdo específico por tipo de notificação -->
          <div v-if="selectedNotification.type === 'alert-offer-price-change'">
            <!-- Alerta de mudança de preço -->
            <div class="d-flex flex-column gap-4">
              <!-- Imagem do produto -->
              <div
                v-if="selectedNotification.data.product_image"
                class="text-center"
              >
                <v-img
                  :src="selectedNotification.data.product_image"
                  :alt="selectedNotification.data.product_name"
                  max-height="200"
                  contain
                  class="mx-auto"
                ></v-img>
              </div>

              <!-- Nome do produto -->
              <div>
                <h3 class="text-h6 mb-2">Produto</h3>
                <p class="text-body-1">
                  {{ selectedNotification.data.product_name }}
                </p>
              </div>

              <!-- Informações de preço -->
              <div>
                <h3 class="text-h6 mb-2">Alteração de Preço</h3>
                <div class="d-flex gap-4">
                  <div>
                    <p class="text-caption text-medium-emphasis">
                      Preço Anterior
                    </p>
                    <p class="text-h6 text-decoration-line-through text-error">
                      R$
                      {{
                        formatPrice(selectedNotification.data.old_price || 0)
                      }}
                    </p>
                  </div>
                  <div>
                    <p class="text-caption text-medium-emphasis">Preço Atual</p>
                    <p class="text-h6 text-success">
                      R$
                      {{
                        formatPrice(selectedNotification.data.new_price || 0)
                      }}
                    </p>
                  </div>
                </div>

                <!-- Diferença de preço -->
                <div
                  class="mt-2"
                  v-if="
                    selectedNotification.data.old_price &&
                    selectedNotification.data.new_price
                  "
                >
                  <v-chip
                    :color="
                      getPriceChangeColor(
                        selectedNotification.data.old_price || 0,
                        selectedNotification.data.new_price || 0
                      )
                    "
                    size="small"
                  >
                    {{
                      getPriceChangeText(
                        selectedNotification.data.old_price || 0,
                        selectedNotification.data.new_price || 0
                      )
                    }}
                  </v-chip>
                </div>
              </div>

              <!-- ID da busca -->
              <div v-if="selectedNotification.data.search_id">
                <h3 class="text-h6 mb-2">Busca Relacionada</h3>
                <p class="text-body-2">
                  ID: {{ selectedNotification.data.search_id }}
                </p>
              </div>
            </div>
          </div>

          <div v-else-if="selectedNotification.type === 'promotional-alert'">
            <!-- Alerta promocional -->
            <div class="d-flex flex-column gap-4">
              <!-- Informações do programa -->
              <div>
                <h3 class="text-h6 mb-2">Programa de Fidelidade</h3>
                <div class="d-flex flex-wrap gap-2 mb-2">
                  <v-chip color="primary" size="large">
                    {{ selectedNotification.data.program_name }}
                  </v-chip>
                  <v-chip
                    :color="
                      selectedNotification.data.program_type === 'points'
                        ? 'success'
                        : 'info'
                    "
                    variant="outlined"
                  >
                    {{
                      selectedNotification.data.program_type === 'points'
                        ? 'Pontos'
                        : 'Milhas'
                    }}
                  </v-chip>
                </div>
              </div>

              <!-- Informações do e-commerce -->
              <div>
                <h3 class="text-h6 mb-2">Loja</h3>
                <p class="text-body-1 mb-2">
                  {{ selectedNotification.data.ecommerce_name }}
                </p>
                <v-chip color="secondary" variant="outlined" size="small">
                  {{ selectedNotification.data.ecommerce_category }}
                </v-chip>
              </div>

              <!-- Valor atual -->
              <div>
                <h3 class="text-h6 mb-2">Valor da Promoção</h3>
                <p class="text-h5 text-primary font-weight-bold">
                  {{ selectedNotification.data.current_value }}
                  {{
                    selectedNotification.data.program_type === 'points'
                      ? 'pontos'
                      : 'milhas'
                  }}
                </p>
              </div>

              <!-- Descrição completa -->
              <div>
                <h3 class="text-h6 mb-2">Detalhes</h3>
                <p class="text-body-1">
                  Nova promoção disponível no programa
                  <strong>{{ selectedNotification.data.program_name }}</strong>
                  da loja
                  <strong>{{ selectedNotification.data.ecommerce_name }}</strong
                  >. Você pode ganhar
                  <strong
                    >{{ selectedNotification.data.current_value }}
                    {{
                      selectedNotification.data.program_type === 'points'
                        ? 'pontos'
                        : 'milhas'
                    }}</strong
                  >
                  fazendo compras nesta loja.
                </p>
              </div>
            </div>
          </div>

          <!-- Tipo de notificação genérica -->
          <div v-else>
            <div class="d-flex flex-column gap-4">
              <div>
                <h3 class="text-h6 mb-2">Detalhes da Notificação</h3>
                <p class="text-body-1">
                  {{ getNotificationMessage(selectedNotification) }}
                </p>
              </div>

              <!-- Dados brutos para tipos desconhecidos -->
              <div v-if="Object.keys(selectedNotification.data).length > 0">
                <h3 class="text-h6 mb-2">Informações Adicionais</h3>
                <div class="d-flex flex-wrap gap-2">
                  <v-chip
                    v-for="(value, key) in selectedNotification.data"
                    :key="key"
                    size="small"
                    variant="outlined"
                  >
                    {{ key }}: {{ value }}
                  </v-chip>
                </div>
              </div>
            </div>
          </div>

          <!-- Informações de data e status -->
          <v-divider class="my-4"></v-divider>

          <div class="d-flex justify-space-between align-center">
            <div>
              <p class="text-caption text-medium-emphasis mb-1">
                Data de criação
              </p>
              <p class="text-body-2">
                {{ formatFullDate(selectedNotification.created_at) }}
              </p>
            </div>

            <div class="text-right">
              <v-chip
                :color="selectedNotification.read_at ? 'success' : 'warning'"
                size="small"
              >
                {{ selectedNotification.read_at ? 'Lida' : 'Não lida' }}
              </v-chip>
            </div>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>

          <v-btn color="primary" @click="closeNotificationModal">
            Fechar
          </v-btn>

          <!-- Botão para ir para ofertas (alert-offer-price-change) -->
          <v-btn
            v-if="
              selectedNotification.type === 'alert-offer-price-change' &&
              selectedNotification.data.search_id
            "
            color="primary"
            variant="elevated"
            @click="goToOffers"
          >
            Ver Ofertas
          </v-btn>

          <!-- Botão para ir para promoções (promotional-alert) -->
          <v-btn
            v-if="selectedNotification.type === 'promotional-alert'"
            color="primary"
            variant="elevated"
            @click="goToPromotions"
          >
            Ver Promoções
          </v-btn>

          <v-btn
            v-if="!selectedNotification.read_at"
            color="primary"
            variant="outlined"
            @click="markAsReadFromModal"
            :loading="markingAsRead === selectedNotification.id"
          >
            Marcar como lida
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
  import type { User } from '~/types/user'

  interface NotificationData {
    program_name?: string
    ecommerce_name?: string
    current_value?: string
    program_id?: number
    ecommerce_id?: number
    program_type?: 'points' | 'miles'
    ecommerce_category?: string
    // Para alertas de mudança de preço
    product_name?: string
    product_image?: string
    old_price?: number
    new_price?: number
    search_id?: number
  }

  interface Notification {
    id: string
    type: string
    notifiable_type: string
    notifiable_id: number
    data: NotificationData
    read_at: string | null
    created_at: string
    updated_at: string
  }

  interface NotificationsResponse {
    current_page: number
    data: Notification[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
  }

  // Composables
  const { user } = useSanctumAuth<User>()

  // Estado reativo
  const notifications = ref<Notification[]>([])
  const loading = ref(true)
  const loadingMore = ref(false)
  const markingAsRead = ref<string | null>(null)
  const markingAllAsRead = ref(false)
  const currentPage = ref(1)
  const hasMorePages = ref(false)
  const loadMoreTrigger = ref<HTMLElement | null>(null)

  // Estado do modal
  const showNotificationModal = ref(false)
  const selectedNotification = ref<Notification | null>(null)

  // Intersection Observer
  let observer: IntersectionObserver | null = null

  // Métodos
  const loadNotifications = async (
    page: number = 1,
    append: boolean = false
  ) => {
    try {
      if (page === 1) {
        loading.value = true
      } else {
        loadingMore.value = true
      }

      const { data: response } = await useSanctumFetch<NotificationsResponse>(
        `/api/user/notifications?page=${page}`
      )

      if (!response.value) return

      if (append) {
        notifications.value.push(...response.value.data)
      } else {
        notifications.value = response.value.data
      }

      currentPage.value = response.value.current_page
      hasMorePages.value =
        response.value.current_page < response.value.last_page
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    } finally {
      loading.value = false
      loadingMore.value = false
    }
  }

  const loadMoreNotifications = async () => {
    if (!hasMorePages.value || loadingMore.value) return

    await loadNotifications(currentPage.value + 1, true)
  }

  const markAsRead = async (notificationId: string) => {
    try {
      markingAsRead.value = notificationId

      await useSanctumFetch(
        `/api/user/notifications/mark-as-read/${notificationId}`,
        {
          method: 'POST',
        }
      )

      // Atualizar localmente
      const notification = notifications.value.find(
        n => n.id === notificationId
      )
      if (notification) {
        notification.read_at = new Date().toISOString()
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error)
    } finally {
      markingAsRead.value = null
    }
  }

  const markAllAsRead = async () => {
    try {
      markingAllAsRead.value = true

      await useSanctumFetch('/api/user/notifications/mark-as-read', {
        method: 'POST',
      })

      // Atualizar todas as notificações localmente
      const now = new Date().toISOString()
      notifications.value.forEach(notification => {
        if (!notification.read_at) {
          notification.read_at = now
        }
      })
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error)
    } finally {
      markingAllAsRead.value = false
    }
  }

  const getNotificationTitle = (notification: Notification): string => {
    switch (notification.type) {
      case 'promotional-alert':
        return 'Alerta Promocional'
      case 'alert-offer-price-change':
        return 'Alerta de Preço'
      default:
        return 'Notificação'
    }
  }

  const getNotificationMessage = (notification: Notification): string => {
    switch (notification.type) {
      case 'promotional-alert':
        const { program_name, ecommerce_name, current_value } =
          notification.data
        return `Nova promoção disponível no programa ${program_name} da ${ecommerce_name}. Valor atual: ${current_value}.`
      case 'alert-offer-price-change':
        const { product_name, old_price, new_price } = notification.data
        const priceChange =
          new_price && old_price
            ? new_price < old_price
              ? 'diminuiu'
              : 'aumentou'
            : 'foi alterado'
        return `O preço do produto "${product_name}" ${priceChange}. Confira os detalhes.`
      default:
        return 'Você tem uma nova notificação.'
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    )

    if (diffInHours < 1) {
      return 'Agora há pouco'
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays === 1) {
        return 'Ontem'
      } else if (diffInDays < 7) {
        return `${diffInDays} dias atrás`
      } else {
        return date.toLocaleDateString('pt-BR')
      }
    }
  }

  const formatFullDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (price: number): string => {
    return price.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const getPriceChangeColor = (oldPrice: number, newPrice: number): string => {
    if (newPrice < oldPrice) {
      return 'success'
    } else if (newPrice > oldPrice) {
      return 'error'
    }
    return 'info'
  }

  const getPriceChangeText = (oldPrice: number, newPrice: number): string => {
    if (oldPrice === 0) return 'Preço inicial'

    const difference = newPrice - oldPrice
    const percentage = ((difference / oldPrice) * 100).toFixed(1)

    if (difference < 0) {
      return `Desconto de R$ ${Math.abs(difference).toFixed(2)} (${Math.abs(parseFloat(percentage))}%)`
    } else if (difference > 0) {
      return `Aumento de R$ ${difference.toFixed(2)} (${percentage}%)`
    }
    return 'Sem alteração'
  }

  // Funções do modal
  const openNotificationModal = (notification: Notification) => {
    selectedNotification.value = notification
    showNotificationModal.value = true

    // Marcar como lida automaticamente ao abrir
    if (!notification.read_at) {
      markAsRead(notification.id)
    }
  }

  const closeNotificationModal = () => {
    showNotificationModal.value = false
    selectedNotification.value = null
  }

  const markAsReadFromModal = async () => {
    if (selectedNotification.value && !selectedNotification.value.read_at) {
      await markAsRead(selectedNotification.value.id)
    }
  }

  // Funções de navegação
  const goToOffers = () => {
    if (selectedNotification.value?.data.search_id) {
      navigateTo(
        `/offers?searchId=${selectedNotification.value.data.search_id}`
      )
      closeNotificationModal()
    }
  }

  const goToPromotions = () => {
    if (selectedNotification.value?.type === 'promotional-alert') {
      const params = new URLSearchParams({
        page: '1',
        per_page: '15',
      })

      if (selectedNotification.value.data.ecommerce_id) {
        params.append(
          'ecommerces[0]',
          selectedNotification.value.data.ecommerce_id.toString()
        )
      }

      if (selectedNotification.value.data.program_id) {
        params.append(
          'points_programs[0]',
          selectedNotification.value.data.program_id.toString()
        )
      }

      navigateTo(`/promotions?${params.toString()}`)
      closeNotificationModal()
    }
  }

  // Setup do Intersection Observer
  const setupIntersectionObserver = () => {
    if (!loadMoreTrigger.value) return

    observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        if (entry.isIntersecting && hasMorePages.value && !loadingMore.value) {
          loadMoreNotifications()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    )

    observer.observe(loadMoreTrigger.value)
  }

  // Lifecycle
  onMounted(async () => {
    await loadNotifications()

    nextTick(() => {
      setupIntersectionObserver()
    })
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  // Computed
  const hasUnreadNotifications = computed(() => {
    return notifications.value.some(notification => !notification.read_at)
  })

  // Meta
  useHead({
    title: 'Notificações',
  })
</script>

<style scoped>
  .notification-unread {
    border-left: 4px solid rgb(var(--v-theme-primary));
  }

  .gap-2 {
    gap: 8px;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .gap-4 {
    gap: 16px;
  }
</style>
