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
  import { onMounted, ref } from 'vue'

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
        console.log('Prompt foi dispensado recentemente')
        return
      }
    }

    // Verificar se já está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isInWebAppiOS = (window.navigator as any).standalone === true
    const isInstalled = isStandalone || isInWebAppiOS

    if (isInstalled) {
      console.log('PWA já está instalado')
      return
    }

    // Verificar se é HTTPS ou localhost
    const isSecure =
      location.protocol === 'https:' || location.hostname === 'localhost'
    if (!isSecure) {
      console.log('PWA requer HTTPS ou localhost')
      return
    }

    // Mostrar prompt se disponível
    if (deferredPrompt) {
      showInstallPrompt.value = true
    }
  }

  onMounted(() => {
    console.log('PwaInstallPrompt montado')

    // Escutar evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', e => {
      console.log('Evento beforeinstallprompt disparado')
      e.preventDefault()
      deferredPrompt = e
      checkInstallPrompt()
    })

    // Verificar condições iniciais
    checkInstallPrompt()

    // Verificar novamente após um tempo para dar chance ao evento ser disparado
    setTimeout(() => {
      checkInstallPrompt()
    }, 3000)
  })
</script>

<style scoped>
  .v-snackbar {
    z-index: 9999;
  }
</style>
