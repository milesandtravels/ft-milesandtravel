<template>
  <v-snackbar
    v-model="showInstallPrompt"
    :timeout="-1"
    location="bottom"
    color="primary"
    variant="elevated"
  >
    <div class="d-flex align-center justify-space-between w-100">
      <div>
        <v-icon class="me-2">mdi-download</v-icon>
        <span>Instalar Miles and Travel</span>
      </div>
      <div>
        <v-btn variant="text" size="small" @click="installPwa" class="me-2">
          Instalar
        </v-btn>
        <v-btn variant="text" size="small" @click="dismissPrompt">
          Agora não
        </v-btn>
      </div>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  const showInstallPrompt = ref(false)
  let deferredPrompt: any = null

  const installPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)
      deferredPrompt = null
      showInstallPrompt.value = false
    }
  }

  const dismissPrompt = () => {
    showInstallPrompt.value = false
    // Salvar no localStorage para não mostrar novamente por um tempo
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  const checkInstallPrompt = () => {
    // Verificar se já foi dispensado recentemente (7 dias)
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
      if (Date.now() - dismissedTime < sevenDaysInMs) {
        return
      }
    }

    // Verificar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    // Mostrar prompt se disponível
    if (deferredPrompt) {
      showInstallPrompt.value = true
    }
  }

  onMounted(() => {
    // Escutar evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault()
      deferredPrompt = e
      checkInstallPrompt()
    })

    // Verificar se já pode mostrar o prompt
    setTimeout(checkInstallPrompt, 2000)
  })
</script>

<style scoped>
  .v-snackbar {
    z-index: 9999;
  }
</style>
