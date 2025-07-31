<template>
  <v-card
    class="mb-3 cursor-pointer"
    :class="{ 'notification-unread': !notification.read_at }"
    elevation="2"
    @click="$emit('openModal', notification)"
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
                notification.data.program_type === 'points' ? 'success' : 'info'
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
            @click.stop="$emit('markAsRead', notification.id)"
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
</template>

<script setup lang="ts">
  import type { Notification } from '~/types/notification'

  interface Props {
    notification: Notification
    markingAsRead: string | null
  }

  defineProps<Props>()

  defineEmits<{
    openModal: [notification: Notification]
    markAsRead: [notificationId: string]
  }>()

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
</style>
