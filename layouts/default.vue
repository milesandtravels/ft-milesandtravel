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
      :theme="appTheme"
      @navigate="handleNavigation"
    />

    <!-- Main Content -->
    <v-main class="main-content">
      <v-container class="pa-6" fluid>
        <!-- Breadcrumb -->
        <v-breadcrumbs
          v-if="breadcrumbs.length > 1"
          class="pa-0 mb-4"
          :items="breadcrumbs"
        >
          <template #prepend>
            <v-icon size="small">mdi-home</v-icon>
          </template>
          <template #divider>
            <v-icon size="small">mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>

        <!-- Page Content -->
        <slot />
      </v-container>
    </v-main>

    <!-- Theme Toggle FAB -->
    <v-fab
      class="theme-toggle"
      color="primary"
      icon="mdi-theme-light-dark"
      location="bottom end"
      size="small"
      @click="toggleTheme"
    />
  </v-app>
</template>

<script setup lang="ts">
  // Nuxt 3 composables
  const route = useRoute()
  const router = useRouter()
  const { $vuetify } = useNuxtApp()

  // Reactive state
  const sidebarOpen = ref(true)
  const appTheme = ref<'light' | 'dark'>('light')

  // User data - could be replaced with useUser() composable or Pinia store
  const currentUser = ref({
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
  })

  // Sample data - could be moved to a Pinia store
  const sampleTravels = ref([
    {
      id: 1,
      destination: 'Paris, França',
      dates: '15-20 Jul 2024',
      status: 'active',
      color: 'blue',
      icon: 'mdi-airplane',
    },
    {
      id: 2,
      destination: 'Tokyo, Japão',
      dates: '05-12 Ago 2024',
      status: 'planned',
      color: 'green',
      icon: 'mdi-airplane-takeoff',
    },
    {
      id: 3,
      destination: 'New York, EUA',
      dates: '20-25 Set 2024',
      status: 'planned',
      color: 'orange',
      icon: 'mdi-city',
    },
  ])

  // Computed properties
  const currentRoute = computed(() => route.path)

  const pageTitle = computed(() => {
    const routeTitles: Record<string, string> = {
      '/': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/travels': 'Minhas Viagens',
      '/travels/new': 'Nova Viagem',
      '/travels/history': 'Histórico de Viagens',
      '/bookings': 'Reservas',
      '/bookings/hotels': 'Reservas de Hotéis',
      '/bookings/flights': 'Reservas de Voos',
      '/expenses': 'Controle de Despesas',
      '/documents': 'Documentos',
      '/miles': 'Programa de Milhas',
      '/settings': 'Configurações',
      '/profile': 'Meu Perfil',
      '/help': 'Ajuda e Suporte',
    }
    return routeTitles[currentRoute.value] || 'Página não encontrada'
  })

  const pageDescription = computed(() => {
    const routeDescriptions: Record<string, string> = {
      '/': 'Visão geral das suas viagens e atividades recentes',
      '/dashboard': 'Visão geral das suas viagens e atividades recentes',
      '/travels': 'Gerencie suas viagens passadas, atuais e futuras',
      '/travels/new': 'Planeje uma nova viagem com facilidade',
      '/travels/history': 'Histórico completo de todas as suas viagens',
      '/bookings': 'Todas as suas reservas em um só lugar',
      '/expenses': 'Controle seus gastos e orçamento de viagem',
      '/documents': 'Gerencie passaportes, vistos e outros documentos',
      '/miles': 'Acompanhe suas milhas e benefícios',
      '/settings': 'Personalize sua experiência no sistema',
      '/profile': 'Gerencie seus dados pessoais e preferências',
      '/help': 'Encontre ajuda e suporte quando precisar',
    }
    return routeDescriptions[currentRoute.value] || 'Página não encontrada'
  })

  const breadcrumbs = computed(() => {
    const parts = currentRoute.value.split('/').filter(Boolean)
    const breadcrumbs = [{ title: 'Início', to: '/' }]

    let path = ''
    for (const part of parts) {
      path += `/${part}`
      const titles: Record<string, string> = {
        '/dashboard': 'Dashboard',
        '/travels': 'Viagens',
        '/travels/new': 'Nova Viagem',
        '/travels/history': 'Histórico',
        '/bookings': 'Reservas',
        '/bookings/hotels': 'Hotéis',
        '/bookings/flights': 'Voos',
        '/expenses': 'Despesas',
        '/documents': 'Documentos',
        '/miles': 'Milhas',
        '/settings': 'Configurações',
        '/profile': 'Perfil',
        '/help': 'Ajuda',
      }

      if (titles[path]) {
        breadcrumbs.push({ title: titles[path], to: path })
      }
    }

    return breadcrumbs
  })

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

  const goToDashboard = () => {
    handleNavigation('/')
  }

  const handleLogout = async () => {
    console.log('👋 Logout realizado')
    // Implement logout logic
    // Could clear user session, redirect to login, etc.
    // await $fetch('/api/auth/logout', { method: 'POST' })
    // await navigateTo('/login')
  }

  const handleAccountSettings = () => {
    handleNavigation('/settings')
  }

  const handleNotifications = () => {
    console.log('🔔 Abrindo notificações')
    // Implement notifications logic
    // Could open a modal, navigate to notifications page, etc.
  }

  const handleHelp = () => {
    handleNavigation('/help')
  }

  const toggleTheme = () => {
    appTheme.value = appTheme.value === 'light' ? 'dark' : 'light'

    // Update Vuetify theme
  }

  // Watchers
  watch(
    () => route.path,
    newRoute => {
      console.log('📍 Rota alterada para:', newRoute)
    }
  )

  watch(appTheme, newTheme => {
    console.log('🎨 Tema alterado para:', newTheme)
  })

  useHead({
    title: pageTitle,
    meta: [
      {
        name: 'description',
        content: pageDescription,
      },
    ],
  })
</script>

<style scoped>
  .main-content {
    background-color: rgb(248, 250, 252);
  }

  .v-theme--dark .main-content {
    background-color: rgb(18, 18, 18);
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
