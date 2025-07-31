<template>
  <div class="d-flex justify-space-between align-center mb-4">
    <h1 class="text-h5">Notificações</h1>

    <!-- Botão marcar todas como lidas -->
    <v-btn
      v-if="hasUnreadNotifications"
      variant="outlined"
      color="primary"
      size="small"
      prepend-icon="mdi-check-all"
      @click="$emit('markAllAsRead')"
      :loading="markingAllAsRead"
    >
      Marcar todas como lidas
    </v-btn>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    hasUnreadNotifications: boolean
    markingAllAsRead: boolean
  }

  defineProps<Props>()

  defineEmits<{
    markAllAsRead: []
  }>()
</script>
