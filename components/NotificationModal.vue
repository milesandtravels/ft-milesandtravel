<template>
  <v-dialog
    :model-value="isOpen"
    @update:model-value="$emit('close')"
    max-width="600px"
    scrollable
  >
    <v-card v-if="notification">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ getNotificationTitle(notification) }}</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="$emit('close')"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <NotificationModalContent :notification="notification" />
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>

        <v-btn color="primary" @click="$emit('close')"> Fechar </v-btn>

        <!-- Botão para ir para ofertas (alert-offer-price-change) -->
        <v-btn
          v-if="
            notification.type === 'alert-offer-price-change' &&
            notification.data.search_id
          "
          color="primary"
          variant="elevated"
          @click="$emit('goToOffers')"
        >
          Ver Ofertas
        </v-btn>

        <!-- Botão para ir para promoções (promotional-alert) -->
        <v-btn
          v-if="notification.type === 'promotional-alert'"
          color="primary"
          variant="elevated"
          @click="$emit('goToPromotions')"
        >
          Ver Promoções
        </v-btn>

        <v-btn
          v-if="!notification.read_at"
          color="primary"
          variant="outlined"
          @click="$emit('markAsRead')"
          :loading="markingAsRead"
        >
          Marcar como lida
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { Notification } from '~/types/notification'

  interface Props {
    isOpen: boolean
    notification: Notification | null
    markingAsRead: boolean
  }

  defineProps<Props>()

  defineEmits<{
    close: []
    goToOffers: []
    goToPromotions: []
    markAsRead: []
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
</script>
