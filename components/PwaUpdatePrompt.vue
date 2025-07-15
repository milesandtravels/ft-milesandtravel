<template>
  <v-snackbar
    v-model="showUpdatePrompt"
    :timeout="-1"
    location="top"
    color="info"
    variant="elevated"
  >
    <div class="d-flex align-center justify-space-between w-100">
      <div class="d-flex align-center">
        <v-icon class="me-2">mdi-update</v-icon>
        <div>
          <div class="font-weight-medium">Nova versão disponível</div>
          <div class="text-caption">
            Atualize para obter as últimas funcionalidades
          </div>
        </div>
      </div>
      <div>
        <v-btn
          variant="text"
          size="small"
          @click="updateApp"
          class="me-2"
          :loading="updating"
        >
          Atualizar
        </v-btn>
        <v-btn variant="text" size="small" @click="dismissUpdate">
          Depois
        </v-btn>
      </div>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const showUpdatePrompt = ref(false)
  const updating = ref(false)

  // Usar a API nativa do @vite-pwa/nuxt
  if (process.client) {
    const { $pwa } = useNuxtApp()

    if ($pwa?.needRefresh) {
      showUpdatePrompt.value = true
    }
  }

  const updateApp = async () => {
    updating.value = true
    try {
      if (process.client) {
        const { $pwa } = useNuxtApp()
        await $pwa?.updateServiceWorker()
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error)
    } finally {
      updating.value = false
      showUpdatePrompt.value = false
    }
  }

  const dismissUpdate = () => {
    showUpdatePrompt.value = false
  }
</script>

<style scoped>
  .v-snackbar {
    z-index: 9999;
  }
</style>
