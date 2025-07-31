<template>
  <v-container class="pa-4">
    <v-row>
      <v-col cols="12">
        <!-- Header -->
        <NotificationHeader
          :has-unread-notifications="hasUnreadNotifications"
          :marking-all-as-read="markingAllAsRead"
          @mark-all-as-read="markAllAsRead"
        />

        <!-- Loading inicial -->
        <NotificationLoadingState
          v-if="loading && notifications.length === 0"
        />

        <!-- Lista de notificações -->
        <div v-else-if="notifications.length > 0">
          <NotificationCard
            v-for="notification in notifications"
            :key="notification.id"
            :notification="notification"
            :marking-as-read="markingAsRead"
            @open-modal="openNotificationModal"
            @mark-as-read="markAsRead"
          />

          <!-- Loading para mais notificações -->
          <NotificationLoadMore
            ref="loadMoreComponent"
            :has-more-pages="hasMorePages"
            :loading-more="loadingMore"
          />
        </div>

        <!-- Estado vazio -->
        <NotificationEmptyState v-else />
      </v-col>
    </v-row>

    <!-- Modal de detalhes da notificação -->
    <NotificationModal
      :is-open="showNotificationModal"
      :notification="selectedNotification"
      :marking-as-read="markingAsRead === selectedNotification?.id"
      @close="closeNotificationModal"
      @go-to-offers="goToOffers"
      @go-to-promotions="goToPromotions"
      @mark-as-read="markAsReadFromModal"
    />
  </v-container>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: ['sanctum:auth'],
  })

  import type {
  Notification,
  NotificationsResponse,
} from '~/types/notification'

  // Estado reativo
  const notifications = ref<Notification[]>([])
  const loading = ref(true)
  const loadingMore = ref(false)
  const markingAsRead = ref<string | null>(null)
  const markingAllAsRead = ref(false)
  const currentPage = ref(1)
  const hasMorePages = ref(false)
  const loadMoreComponent = ref<{ loadMoreTrigger: HTMLElement | null } | null>(null)

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

  // Funções auxiliares mantidas no componente principal
  const formatFullDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
    if (!loadMoreComponent.value?.loadMoreTrigger) return

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

    observer.observe(loadMoreComponent.value.loadMoreTrigger)
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
