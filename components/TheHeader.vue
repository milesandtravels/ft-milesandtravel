<template>
  <v-app-bar app class="app-header" color="primary" dark elevation="4">
    <v-app-bar-nav-icon class="hamburger-menu" @click="toggleDrawer">
      <v-icon>mdi-menu</v-icon>
    </v-app-bar-nav-icon>

    <v-toolbar-title class="app-title font-weight-bold">
      Miles&Travels
    </v-toolbar-title>

    <v-spacer />

    <v-menu
      v-model="showUserMenu"
      :close-on-content-click="false"
      location="bottom end"
      offset="8"
    >
      <template #activator="{ props }">
        <v-btn v-bind="props" class="user-avatar-btn" icon size="large">
          <v-avatar class="user-avatar" color="primary" size="40">
            <!-- Avatar image if available -->
            <v-img 
              v-if="user.avatar_url" 
              :src="user.avatar_url" 
              :alt="user.name"
              cover
            />
            <!-- Fallback to initials -->
            <span 
              v-else 
              class="text-h6 font-weight-bold text-white"
            >
              {{ userInitials }}
            </span>
          </v-avatar>
        </v-btn>
      </template>

      <v-card class="user-menu-card" elevation="8" min-width="280">
        <v-card-text class="pa-4 pb-2">
          <div class="d-flex align-center">
            <v-avatar class="mr-4" color="primary" size="56">
              <!-- Avatar image if available -->
              <v-img 
                v-if="user.avatar_url" 
                :src="user.avatar_url" 
                :alt="user.name"
                cover
              />
              <!-- Fallback to initials -->
              <span 
                v-else 
                class="text-h5 font-weight-bold text-white"
              >
                {{ userInitials }}
              </span>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="text-h6 font-weight-bold">{{ user.name }}</div>
              <div class="text-body-2 text-medium-emphasis">
                {{ user.email }}
              </div>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <!-- Menu Options -->
        <v-list class="pa-0" density="comfortable">
          <v-list-item
            class="menu-item"
            prepend-icon="mdi-account-cog"
            subtitle="Gerenciar perfil e preferências"
            title="Configurações da Conta"
            @click="handleAccountSettings"
          />

          <v-list-item
            class="menu-item"
            prepend-icon="mdi-bell-outline"
            subtitle="Configurar alertas e avisos"
            title="Notificações"
            @click="handleNotifications"
          />

          <v-list-item
            class="menu-item"
            prepend-icon="mdi-help-circle-outline"
            subtitle="Central de ajuda e FAQ"
            title="Ajuda e Suporte"
            @click="handleHelp"
          />

          <v-divider class="my-2" />

          <v-list-item
            class="menu-item logout-item"
            prepend-icon="mdi-logout"
            subtitle="Fazer logout da conta"
            title="Sair"
            @click="handleLogout"
          />
        </v-list>
      </v-card>
    </v-menu>

    <!-- Logout Confirmation Dialog -->
    <v-dialog v-model="showLogoutDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6 pa-6 pb-4">
          <v-icon class="mr-2" color="warning" left>mdi-logout</v-icon>
          Confirmar Saída
        </v-card-title>

        <v-card-text class="pa-6 pt-2">
          <p class="text-body-1 mb-2">
            Tem certeza que deseja sair da sua conta?
          </p>
          <p class="text-body-2 text-medium-emphasis">
            Você precisará fazer login novamente para acessar o sistema.
          </p>
        </v-card-text>

        <v-card-actions class="pa-6 pt-2">
          <v-spacer />
          <v-btn variant="text" @click="showLogoutDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="error" variant="flat" @click="confirmLogout">
            Sair
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Action Snackbar -->
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      location="top"
      timeout="3000"
    >
      {{ snackbarMessage }}
      <template #actions>
        <v-btn variant="text" @click="showSnackbar = false"> Fechar </v-btn>
      </template>
    </v-snackbar>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Types
interface User {
  id: string | number
  name: string
  email: string
  avatar_url?: string
  email_verified_at?: string
  created_at?: string
  updated_at?: string
  two_factor_secret?: any
  two_factor_recovery_codes?: any
  two_factor_confirmed_at?: any
  terms_accepted_at?: any
}

// Props
interface Props {
  user?: User
}

// Emits
interface Emits {
  'toggle-drawer': []
  logout: []
  'account-settings': []
  notifications: []
  help: []
}

const props = withDefaults(defineProps<Props>(), {
  user: () => ({
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
  }),
})

const emit = defineEmits<Emits>()

// State
const showUserMenu = ref(false)
const showLogoutDialog = ref(false)
const showSnackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Computed
const userInitials = computed(() => {
  const names = props.user.name.split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names.at(-1)[0]).toUpperCase()
  }
  return names[0].slice(0, 2).toUpperCase()
})

// Methods
const toggleDrawer = () => {
  emit('toggle-drawer')
}

const handleAccountSettings = () => {
  showUserMenu.value = false
  showNotification('Abrindo configurações da conta...', 'info')
  emit('account-settings')
}

const handleNotifications = () => {
  showUserMenu.value = false
  showNotification('Abrindo configurações de notificações...', 'info')
  emit('notifications')
}

const handleHelp = () => {
  showUserMenu.value = false
  showNotification('Abrindo central de ajuda...', 'info')
  navigateTo('/faq')
}

const handleLogout = () => {
  showUserMenu.value = false
  showLogoutDialog.value = true
}

const confirmLogout = async () => {
  const { status } = await useSanctumFetch<any>('/api/logout', {
    method: 'POST',
  })

  if (status.value === 'success') {
    window.location.reload()
  }
}

const showNotification = (message: string, color = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  showSnackbar.value = true
}
</script>

<style scoped>
.app-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.hamburger-menu {
  transition: transform 0.2s ease;
}

.hamburger-menu:hover {
  transform: scale(1.1);
}

.app-title {
  font-size: 1.25rem;
  letter-spacing: 0.5px;
}

.user-avatar-btn {
  transition: all 0.2s ease;
}

.user-avatar-btn:hover {
  transform: scale(1.05);
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

.user-avatar-btn:hover .user-avatar {
  border-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.05);
}

.user-menu-card {
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.menu-item {
  transition: background-color 0.2s ease;
  border-radius: 8px;
  margin: 0 8px;
}

.menu-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.logout-item:hover {
  background-color: rgba(244, 67, 54, 0.08);
}

.logout-item .v-list-item__prepend {
  color: rgb(244, 67, 54);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .app-title {
    font-size: 1.1rem;
  }

  .app-title .v-icon {
    display: none;
  }

  .user-avatar {
    width: 36px !important;
    height: 36px !important;
  }

  .user-menu-card {
    min-width: 260px;
  }
}

/* Dark theme support */
.v-theme--dark .menu-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.v-theme--dark .logout-item:hover {
  background-color: rgba(244, 67, 54, 0.12);
}

.v-theme--dark .user-menu-card {
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
.user-avatar-btn:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

.menu-item:focus {
  background-color: rgba(0, 0, 0, 0.08);
}

.v-theme--dark .menu-item:focus {
  background-color: rgba(255, 255, 255, 0.12);
}
</style>