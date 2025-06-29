<!-- components/GlobalSnackbar.vue -->
<template>
  <v-snackbar
    v-model="snackbarStore.show"
    :color="snackbarStore.color"
    :timeout="snackbarStore.timeout"
    location="top"
    :multi-line="isMultiLine"
    :vertical="isVertical"
  >
    {{ snackbarStore.message }}

    <template #actions>
      <!-- Ações customizadas se fornecidas -->
      <template v-if="snackbarStore.actions">
        <v-btn
          v-for="(action, index) in snackbarStore.actions"
          :key="index"
          :variant="action.variant || 'text'"
          :color="action.color || 'white'"
          @click="handleAction(action)"
        >
          {{ action.text }}
        </v-btn>
      </template>

      <!-- Botão padrão de fechar -->
      <v-btn variant="text" color="white" @click="snackbarStore.hide()">
        Fechar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useSnackbarStore } from '~/store/snackbar'

  interface SnackbarAction {
    text: string
    variant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'
    color?: string
    handler?: () => void
    keepOpen?: boolean
  }

  const snackbarStore = useSnackbarStore()

  // Computed properties para layout responsivo
  const isMultiLine = computed((): boolean => {
    return snackbarStore.message.length > 50
  })

  const isVertical = computed((): boolean => {
    return snackbarStore.actions !== null && snackbarStore.actions.length > 2
  })

  // Função para lidar com ações customizadas
  const handleAction = (action: SnackbarAction): void => {
    if (action.handler && typeof action.handler === 'function') {
      action.handler()
    }

    // Fechar o snackbar após a ação, a menos que especificado o contrário
    if (action.keepOpen !== true) {
      snackbarStore.hide()
    }
  }
</script>
