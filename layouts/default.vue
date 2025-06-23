<template>
  <v-app>
    <!-- App Header -->
    <TheHeader
      :user="currentUser"
      @account-settings="handleAccountSettings"
      @help="handleHelp"
      @logout="handleLogout"
      @notifications="handleNotifications"
      @toggle-drawer="toggleSidebar"
    />

    <!-- App Sidebar -->
    <TheSidebar
      v-model="sidebarOpen"
      :current-route="currentRoute"
      @navigate="handleNavigation"
    />

    <v-main class="main-content">
      <v-container class="responsive-main-container pa-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  const route = useRoute()

  const sidebarOpen = ref(false)

  // Computed properties
  const currentRoute = computed(() => route.path)

  // Methods
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

  const handleLogout = async () => {
    console.log('👋 Logout realizado')
  }

  const handleAccountSettings = () => {
    handleNavigation('/settings')
  }

  const handleNotifications = () => {
    console.log('🔔 Abrindo notificações')
  }

  const handleHelp = () => {
    handleNavigation('/help')
  }
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
