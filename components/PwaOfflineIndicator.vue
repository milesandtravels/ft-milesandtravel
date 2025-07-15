<template>
  <v-snackbar
    v-model="showOfflineMessage"
    :timeout="-1"
    location="bottom"
    color="warning"
    variant="elevated"
  >
    <div class="d-flex align-center">
      <v-icon class="me-2">mdi-wifi-off</v-icon>
      <span>Você está offline. Algumas funcionalidades podem estar limitadas.</span>
    </div>
  </v-snackbar>
  
  <v-snackbar
    v-model="showOnlineMessage"
    :timeout="3000"
    location="bottom"
    color="success"
    variant="elevated"
  >
    <div class="d-flex align-center">
      <v-icon class="me-2">mdi-wifi</v-icon>
      <span>Conexão restaurada!</span>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const { isOnline } = usePwa()

const showOfflineMessage = ref(false)
const showOnlineMessage = ref(false)
const wasOffline = ref(false)

// Observar mudanças no status de conectividade
watch(isOnline, (online, wasOnlineBefore) => {
  if (!online) {
    // Ficou offline
    showOfflineMessage.value = true
    showOnlineMessage.value = false
    wasOffline.value = true
  } else {
    // Ficou online
    showOfflineMessage.value = false
    
    // Mostrar mensagem de reconexão apenas se estava offline antes
    if (wasOffline.value && wasOnlineBefore === false) {
      showOnlineMessage.value = true
      wasOffline.value = false
    }
  }
}, { immediate: true })
</script>

<style scoped>
.v-snackbar {
  z-index: 9998;
}
</style>