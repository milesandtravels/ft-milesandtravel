<template>
  <v-app>
    <TheHeader
      v-if="user"
      :user="user"
      @account-settings="handleAccountSettings"
      @help="handleHelp"
      @notifications="handleNotifications"
      @toggle-drawer="toggleSidebar"
    />

    <TheSidebar
      v-if="user"
      v-model="sidebarOpen"
      :current-route="currentRoute"
      @navigate="handleNavigation"
    />

    <TermsModal
      v-if="user && user.email_verified_at"
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
  import { useOneSignal } from '@onesignal/onesignal-vue3'
  import type { User } from '~/types/user'

  const { user } = useSanctumAuth<User>()

  const config = useRuntimeConfig()
  const {
    public: { onesignalAppId, onesignalSafariWebId },
  } = config
  const oneSignal = useOneSignal()
  oneSignal.init({
    appId: onesignalAppId,
    safari_web_id: onesignalSafariWebId,
    allowLocalhostAsSecureOrigin: true,
    welcomeNotification: {
      disable: false,
      message: 'Bem-vindo(a) ao Miles&Travels!',
    },
    promptOptions: {
      slidedown: {
        prompts: [
          {
            autoPrompt: true,
            categories: [],
            delay: {
              pageViews: 3,
              timeDelay: 20,
            },
            text: {
              actionMessage:
                'Permita notificações para receber alertas de promoções, passagens e produtos',
              acceptButton: 'Permitir',
              cancelMessage: 'Cancelar',
            },
            type: 'push',
          },
        ],
      },
    },
  })

  const enablePushNotifications = async () => {
    await useSanctumFetch('/api/user/notification-settings', {
      method: 'PUT',
      body: {
        push_notification_enabled: true,
      },
    })
  }

  //Example combining with push subscription change event
  function pushSubscriptionChangeListener(event: any) {
    if (event.current.token) {
      //this is a good place to call OneSignal.login and pass in your user ID
      oneSignal.login(user.value?.id?.toString() || '')
      oneSignal.User.addEmail(user.value?.email || '')
      oneSignal.User.setLanguage('pt')
      enablePushNotifications()
    }
  }
  oneSignal.User.PushSubscription.addEventListener(
    'change',
    pushSubscriptionChangeListener
  )

  oneSignal.Slidedown.promptPush()

  const route = useRoute()

  // Estados reativos
  const termsAccepted = ref(false)
  const onboardingCompleted = ref(false)
  const showOnboarding = ref(false)

  // Computed para mostrar onboarding
  const shouldShowOnboarding = computed(() => {
    return (
      user.value?.email_verified_at &&
      termsAccepted.value &&
      !onboardingCompleted.value &&
      showOnboarding.value
    )
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

  const handleHelp = () => {
    onboardingCompleted.value = false
    showOnboarding.value = true
  }

  onMounted(() => {
    if (user.value && termsAccepted.value && !onboardingCompleted.value) {
      showOnboarding.value = true
    }
  })
</script>

<style scoped>
  .v-theme--dark .main-content {
    background-color: rgb(18, 18, 18);
  }

  /* Previne scroll horizontal */
  * {
    box-sizing: border-box;
  }

  .v-application {
    overflow-x: hidden;
  }

  .main-content {
    overflow-x: hidden;
  }

  /* Container responsivo principal */
  .responsive-main-container {
    margin: 0 auto;
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
  }

  /* Extra Small devices (phones, 600px and down) */
  @media (max-width: 599px) {
    .responsive-main-container {
      width: 100%;
      max-width: 100vw;
      padding-left: 16px !important;
      padding-right: 16px !important;
      padding-top: 16px !important;
      padding-bottom: 16px !important;
    }
  }

  /* Small devices (portrait tablets and large phones, 600px to 959px) */
  @media (min-width: 600px) and (max-width: 959px) {
    .responsive-main-container {
      width: 100%;
      max-width: 100vw;
      padding-left: 24px !important;
      padding-right: 24px !important;
      padding-top: 20px !important;
      padding-bottom: 20px !important;
    }
  }

  /* Medium devices (landscape tablets, 960px to 1263px) */
  @media (min-width: 960px) and (max-width: 1263px) {
    .responsive-main-container {
      max-width: 900px;
      padding-left: 24px !important;
      padding-right: 24px !important;
      padding-top: 24px !important;
      padding-bottom: 24px !important;
    }
  }

  /* Large devices (laptops/desktops, 1264px to 1903px) */
  @media (min-width: 1264px) and (max-width: 1903px) {
    .responsive-main-container {
      max-width: 1140px;
      padding-left: 24px !important;
      padding-right: 24px !important;
      padding-top: 24px !important;
      padding-bottom: 24px !important;
    }
  }

  /* Extra large devices (large laptops and desktops, 1904px and up) */
  @media (min-width: 1904px) {
    .responsive-main-container {
      max-width: 1200px;
      padding-left: 24px !important;
      padding-right: 24px !important;
      padding-top: 24px !important;
      padding-bottom: 24px !important;
    }
  }

  .page-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    padding-bottom: 1rem;
  }

  .v-theme--dark .page-header {
    border-bottom-color: rgba(255, 255, 255, 0.12);
  }

  .content-card {
    border-radius: 12px;
    overflow: hidden;
  }

  .travel-item {
    border-radius: 8px;
    margin-bottom: 8px;
    transition: all 0.2s ease;
  }

  .travel-item:hover {
    background-color: rgba(0, 0, 0, 0.04);
    transform: translateX(4px);
  }

  .v-theme--dark .travel-item:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  .theme-toggle {
    margin: 16px;
  }

  .default-content {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Responsive adjustments */
  @media (max-width: 960px) {
    .main-content {
      margin-left: 0 !important;
    }

    .page-header h1 {
      font-size: 1.5rem;
    }

    /* Garante que elementos não extrapolem em mobile */
    .v-card,
    .v-sheet,
    .v-btn,
    .v-text-field,
    .v-select {
      max-width: 100%;
    }

    /* Ajusta tabelas em mobile */
    .v-table {
      font-size: 0.875rem;
    }

    /* Breadcrumbs responsivo */
    .v-breadcrumbs {
      flex-wrap: wrap;
    }

    .v-breadcrumbs .v-breadcrumbs-item {
      font-size: 0.875rem;
    }
  }

  /* Ajustes específicos para telas muito pequenas */
  @media (max-width: 480px) {
    .responsive-main-container {
      padding-left: 12px !important;
      padding-right: 12px !important;
    }

    .v-breadcrumbs .v-breadcrumbs-item {
      font-size: 0.8rem;
    }
  }

  /* Animation for content */
  .content-card {
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
