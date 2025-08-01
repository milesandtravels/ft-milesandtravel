<template>
  <v-navigation-drawer
    v-model="isOpen"
    app
    class="app-sidebar"
    :color="sidebarColor"
    :permanent="!isMobile"
    :temporary="isMobile"
    width="280"
  >
    <!-- Sidebar Header -->
    <div class="sidebar-header">
      <div class="d-flex align-center pa-4">
        <v-avatar class="mr-3" size="40">
          <img
            src="/assets/logo.svg"
            alt="Miles&Travels Logo"
            style="width: 100%; height: 100%; object-fit: contain"
          />
        </v-avatar>
        <div class="flex-grow-1">
          <div class="text-h6 font-weight-bold sidebar-title">
            Miles&Travels
          </div>
          <div class="text-caption text-medium-emphasis">
            Sistema de Benefícios
          </div>
        </div>
      </div>
      <v-divider />
    </div>

    <!-- Navigation Menu -->
    <v-list class="pa-2" nav>
      <!-- Main Navigation -->
      <v-list-subheader class="text-uppercase font-weight-bold">
        Navegação Principal
      </v-list-subheader>

      <v-list-item
        v-for="item in mainMenuItems"
        :key="item.title"
        :active="isActiveRoute(item.route)"
        class="menu-item"
        :prepend-icon="item.icon"
        :subtitle="item.subtitle"
        :title="item.title"
        @click="handleNavigation(item.route)"
      />

      <v-divider class="my-4" />

      <!-- Alertas -->
      <v-list-subheader class="text-uppercase font-weight-bold">
        Sistema de Alertas
      </v-list-subheader>

      <v-list-item
        v-for="item in alertsMenuItems"
        :key="item.title"
        :active="isActiveRoute(item.route)"
        class="menu-item"
        :prepend-icon="item.icon"
        :subtitle="item.subtitle"
        :title="item.title"
        @click="handleNavigation(item.route)"
      />

      <v-divider class="my-4" />

      <!-- Settings & Tools -->
      <v-list-subheader class="text-uppercase font-weight-bold">
        Configurações & Ferramentas
      </v-list-subheader>

      <v-list-item
        v-for="item in settingsMenuItems"
        :key="item.title"
        :active="isActiveRoute(item.route)"
        class="menu-item"
        :prepend-icon="item.icon"
        :subtitle="item.subtitle"
        :title="item.title"
        @click="handleNavigation(item.route)"
      />
    </v-list>

    <!-- Sidebar Footer -->
    <template #append>
      <div class="sidebar-footer">
        <v-divider />
        <div class="pa-4">
          <v-card class="footer-card" color="primary" variant="tonal">
            <v-card-text class="pa-3">
              <div class="d-flex align-center">
                <v-icon class="mr-2" color="primary" size="20">
                  mdi-information-outline
                </v-icon>
                <div class="flex-grow-1">
                  <div class="text-body-2 font-weight-medium">Versão 1.0.0</div>
                  <div class="text-caption text-medium-emphasis">
                    Última atualização
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useDisplay } from 'vuetify'

  // Types
  interface MenuItem {
    title: string
    subtitle?: string
    icon: string
    route: string
  }

  // Props
  interface Props {
    modelValue?: boolean
    currentRoute?: string
    theme?: 'light' | 'dark'
  }

  // Emits
  interface Emits {
    'update:modelValue': [value: boolean]
    navigate: [route: string]
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: true,
    currentRoute: '/',
    theme: 'light',
  })

  const emit = defineEmits<Emits>()

  // Composables
  const { mobile } = useDisplay()

  // State
  const isMobile = computed(() => mobile.value)

  const isOpen = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  const sidebarColor = computed(() => {
    return props.theme === 'dark' ? 'surface' : 'background'
  })

  const mainMenuItems = ref<MenuItem[]>([
    {
      title: 'Tela Inicial',
      subtitle: 'Página principal do sistema',
      icon: 'mdi-view-dashboard',
      route: '/',
    },
    {
      title: 'Compras Bonificadas',
      subtitle: 'Encontrar produtos e ofertas',
      icon: 'mdi-cart',
      route: '/search-products',
    },
    {
      title: 'Promoções',
      subtitle: 'Vantagens em lojas online',
      icon: 'mdi-tag-multiple',
      route: '/promotions',
    },
    {
      title: 'Minhas Buscas',
      subtitle: 'Histórico de buscas realizadas',
      icon: 'mdi-history',
      route: '/searches-did',
    },
  ])

  const alertsMenuItems = ref<MenuItem[]>([
    {
      title: 'Configurar Alertas',
      subtitle: 'Definir preferências de notificação',
      icon: 'mdi-cog-outline', // Ícone de engrenagem para configurações
      route: '/alerts/configure',
    },
    {
      title: 'Visualizar Alertas',
      subtitle: 'Ver alertas configurados',
      icon: 'mdi-format-list-bulleted', // Lista para visualização de histórico
      route: '/alerts/view',
    },
    {
      title: 'Notificações',
      subtitle: 'Ver notificações recebidas',
      icon: 'mdi-bell-outline', // Sino para notificações
      route: '/notifications/view',
    },
  ])

  const settingsMenuItems = ref<MenuItem[]>([
    {
      title: 'Perfil',
      subtitle: 'Dados pessoais',
      icon: 'mdi-account-circle-outline',
      route: '/profile',
    },
    {
      title: 'Termos de Uso',
      subtitle: 'Condições de utilização',
      icon: 'mdi-file-document-check-outline',
      route: '/terms-of-use',
    },
    {
      title: 'Ajuda',
      subtitle: 'Suporte e FAQ',
      icon: 'mdi-help-circle-outline',
      route: '/faq',
    },
  ])
  const router = useRouter()
  const handleNavigation = (route: string) => {
    console.log('route', route)
    emit('navigate', route)
    router.push(route)
    isOpen.value = false
  }

  const isActiveRoute = (route: string) => {
    return (
      props.currentRoute === route || props.currentRoute.startsWith(route + '/')
    )
  }
</script>

<style scoped>
  .app-sidebar {
    border-right: 1px solid rgba(0, 0, 0, 0.12);
  }

  .sidebar-header {
    position: sticky;
    top: 0;
    z-index: 1;
    background: #fff;
  }

  .sidebar-title {
    font-size: 1.1rem;
    line-height: 1.2;
  }

  .menu-item {
    border-radius: 8px;
    margin: 2px 0;
    transition: all 0.2s ease;
  }

  .menu-item:hover {
    background-color: rgba(0, 0, 0, 0.04);
    transform: translateX(2px);
  }

  .menu-item.v-list-item--active {
    background-color: rgba(15, 43, 70, 0.12);
    color: rgb(15, 43, 70);
  }

  .sidebar-footer {
    position: sticky;
    bottom: 0;
    background: inherit;
  }

  .footer-card {
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .footer-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  /* Dark theme support */
  .v-theme--dark .app-sidebar {
    border-right-color: rgba(255, 255, 255, 0.12);
  }

  .v-theme--dark .menu-item:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  .v-theme--dark .menu-item.v-list-item--active {
    background-color: rgba(144, 202, 249, 0.16);
    color: rgb(144, 202, 249);
  }

  /* Responsive adjustments */
  @media (max-width: 960px) {
    .app-sidebar {
      width: 260px !important;
    }

    .sidebar-title {
      font-size: 1rem;
    }
  }

  /* Animation for menu items */
  .menu-item {
    animation: fadeInLeft 0.3s ease-out backwards;
  }

  .menu-item:nth-child(1) {
    animation-delay: 0.05s;
  }
  .menu-item:nth-child(2) {
    animation-delay: 0.1s;
  }
  .menu-item:nth-child(3) {
    animation-delay: 0.15s;
  }
  .menu-item:nth-child(4) {
    animation-delay: 0.2s;
  }
  .menu-item:nth-child(5) {
    animation-delay: 0.25s;
  }
  .menu-item:nth-child(6) {
    animation-delay: 0.3s;
  }
  .menu-item:nth-child(7) {
    animation-delay: 0.35s;
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-8px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Accessibility improvements */
  .menu-item:focus {
    outline: 2px solid rgba(15, 43, 70, 0.5);
    outline-offset: 2px;
  }

  .v-theme--dark .menu-item:focus {
    outline-color: rgba(144, 202, 249, 0.5);
  }

  /* Scrollbar styling */
  .app-sidebar ::-webkit-scrollbar {
    width: 6px;
  }

  .app-sidebar ::-webkit-scrollbar-track {
    background: transparent;
  }

  .app-sidebar ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  .app-sidebar ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  .v-theme--dark .app-sidebar ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }

  .v-theme--dark .app-sidebar ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
</style>
