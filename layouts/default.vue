<template>
  <v-app>
    <TheHeader
      v-if="value"
      :user="value"
      @account-settings="handleAccountSettings"
      @help="handleHelp"
      @notifications="handleNotifications"
      @toggle-drawer="toggleSidebar"
    />

    <TheSidebar
      v-if="value"
      v-model="sidebarOpen"
      :current-route="currentRoute"
      @navigate="handleNavigation"
    />

    <TermsModal 
      v-if="value && value.email_verified_at" 
      @terms-accepted="onTermsAccepted"
    />

    <v-main class="main-content">
      <v-container class="responsive-main-container pa-6">
        <slot />
      </v-container>
    </v-main>
    
    <OnboardingTour
      v-if="shouldShowOnboarding"
      v-model="showOnboarding"
      :auto-start="true"
      @tour-completed="onTourCompleted"
      @tour-skipped="onTourSkipped"
    />
    
    <UniversalLoading />
  </v-app>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'

const route = useRoute()
const { value }: any = useSanctumUser()

// Estados reativos com VueUse
const termsAccepted = useLocalStorage('miles-travels-terms-accepted', false)
const onboardingCompleted = useLocalStorage('onboarding-completed', false)
const showOnboarding = ref(false)

// Computed para mostrar onboarding
const shouldShowOnboarding = computed(() => {
  return value?.email_verified_at && 
         termsAccepted.value && 
         !onboardingCompleted.value && 
         showOnboarding.value
})

// Quando termos são aceitos
const onTermsAccepted = () => {
  termsAccepted.value = true
  
  if (!onboardingCompleted.value) {
    setTimeout(() => {
      showOnboarding.value = true
    }, 500)
  }
}

// Métodos do onboarding
const onTourCompleted = () => {
  showOnboarding.value = false
  onboardingCompleted.value = true
}

const onTourSkipped = () => {
  showOnboarding.value = false
  onboardingCompleted.value = true
}

// Métodos de navegação
const sidebarOpen = ref(false)
const currentRoute = computed(() => route.path)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const handleNavigation = async (routePath: string) => {
  try {
    await navigateTo(routePath)
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

const handleAccountSettings = () => {
  handleNavigation('/settings')
}

const handleNotifications = () => {
  // Implementar lógica de notificações
}

const handleHelp = () => {
  onboardingCompleted.value = false
  showOnboarding.value = true
}

// Inicializar onboarding se necessário
onMounted(() => {
  if (termsAccepted.value && !onboardingCompleted.value) {
    showOnboarding.value = true
  }
})
</script>