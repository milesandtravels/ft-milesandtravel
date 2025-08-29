<template>
  <div class="wallet-page">
    <v-container fluid class="pa-4 pa-sm-6">
      <!-- Page Header -->
      <div class="page-header mb-6">
        <div class="d-flex align-center justify-space-between flex-wrap">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">Carteira</h1>
            <p class="text-body-1 text-medium-emphasis">
              Gerencie seus pontos e milhas acumulados
            </p>
          </div>
          <v-btn
            color="primary"
            size="large"
            variant="flat"
            prepend-icon="mdi-plus"
            @click="openAddDialog"
            :disabled="availablePrograms.length === 0"
          >
            <span class="d-none d-sm-inline">Adicionar Programa</span>
            <span class="d-sm-none">Adicionar</span>
          </v-btn>
        </div>
      </div>

      <!-- Summary Cards -->
      <WalletSummary :summary="summary" v-if="accounts.length > 0" />

      <!-- Loading State -->
      <div v-if="loading" class="d-flex justify-center py-12">
        <v-progress-circular indeterminate color="primary" size="64" />
      </div>

      <!-- Empty State -->
      <v-card
        v-else-if="accounts.length === 0 && !loading"
        class="empty-state pa-8 text-center"
        variant="tonal"
      >
        <v-card-text>
          <v-avatar color="primary" size="80" class="mb-4">
            <v-icon size="40">mdi-wallet-plus</v-icon>
          </v-avatar>
          <h3 class="text-h5 font-weight-bold mb-3">Sua carteira está vazia</h3>
          <p class="text-body-1 text-medium-emphasis mb-6">
            Adicione seus programas de pontos e milhas para começar a acompanhar
            seus saldos.
          </p>
          <v-btn
            color="primary"
            size="large"
            variant="flat"
            prepend-icon="mdi-plus"
            @click="openAddDialog"
            :disabled="availablePrograms.length === 0"
          >
            Adicionar Primeiro Programa
          </v-btn>
          <div
            v-if="availablePrograms.length === 0"
            class="text-caption text-medium-emphasis mt-2"
          >
            Carregando programas disponíveis...
          </div>
        </v-card-text>
      </v-card>

      <!-- Wallet Cards -->
      <div v-else class="wallet-grid">
        <TransitionGroup
          name="wallet-cards"
          tag="div"
          class="wallet-cards-container"
        >
          <WalletCard
            v-for="account in accounts"
            :key="`wallet-${account.id}`"
            :account="account"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </TransitionGroup>
      </div>

      <!-- Add/Edit Dialog -->
      <WalletForm
        v-model="showDialog"
        :programs="availablePrograms"
        :loading-programs="loadingPrograms"
        :loading="loading"
        :editing-account="editingAccount"
        @submit="handleSubmit"
      />

      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="showDeleteDialog" max-width="400px">
        <v-card>
          <v-card-title class="text-h6 font-weight-bold">
            Confirmar Exclusão
          </v-card-title>
          <v-card-text>
            <p>
              Tem certeza que deseja remover
              <strong>{{ deletingAccount?.program.name }}</strong>
              da sua carteira?
            </p>
            <p class="text-caption text-medium-emphasis mt-2">
              Esta ação não pode ser desfeita.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="showDeleteDialog = false">
              Cancelar
            </v-btn>
            <v-btn
              color="error"
              variant="flat"
              :loading="loading"
              @click="confirmDelete"
            >
              Remover
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { WalletAccount } from '~/interfaces/wallet'

  useSeoMeta({
    title: 'Carteira - Miles & Travel',
    ogTitle: 'Carteira de Pontos e Milhas - Miles & Travel',
    description:
      'Gerencie seus pontos e milhas acumulados em diferentes programas de fidelidade',
    ogDescription:
      'Gerencie seus pontos e milhas acumulados em diferentes programas de fidelidade',
  })

  definePageMeta({
    middleware: 'sanctum:auth',
  })

  const {
    accounts,
    summary,
    loading,
    loadingPrograms,
    availablePrograms,
    fetchAccounts,
    fetchPrograms,
    createAccount,
    updateAccount,
    deleteAccount,
  } = useWallet()

  const showDialog = ref(false)
  const showDeleteDialog = ref(false)
  const editingAccount = ref<WalletAccount | null>(null)
  const deletingAccount = ref<WalletAccount | null>(null)

  const openAddDialog = () => {
    editingAccount.value = null
    showDialog.value = true
  }

  const handleEdit = (account: WalletAccount) => {
    editingAccount.value = account
    showDialog.value = true
  }

  const handleDelete = (account: WalletAccount) => {
    deletingAccount.value = account
    showDeleteDialog.value = true
  }

  const handleSubmit = async (data: any) => {
    let success = false

    if (editingAccount.value) {
      success = await updateAccount(editingAccount.value.id, data)
    } else {
      success = await createAccount(data)
    }

    if (success) {
      showDialog.value = false
      editingAccount.value = null
    }
  }

  const confirmDelete = async () => {
    if (!deletingAccount.value) return

    const success = await deleteAccount(deletingAccount.value.id)
    if (success) {
      showDeleteDialog.value = false
      deletingAccount.value = null
    }
  }

  onMounted(async () => {
    await Promise.all([fetchAccounts(), fetchPrograms()])
  })
</script>

<style scoped>
  .wallet-page {
    min-height: calc(100vh - 64px);
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-primary), 0.02) 0%,
      rgba(var(--v-theme-surface), 1) 100%
    );
  }

  .page-header {
    position: relative;
  }

  .wallet-grid {
    margin-top: 24px;
  }

  .wallet-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }

  .empty-state {
    border-radius: 16px;
    max-width: 500px;
    margin: 0 auto;
  }

  /* Animations */
  .wallet-cards-enter-active,
  .wallet-cards-leave-active {
    transition: all 0.3s ease;
  }

  .wallet-cards-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }

  .wallet-cards-leave-to {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }

  .wallet-cards-move {
    transition: transform 0.3s ease;
  }

  /* Mobile responsiveness */
  @media (max-width: 960px) {
    .wallet-cards-container {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  @media (max-width: 600px) {
    .page-header .d-flex {
      align-items: flex-start;
      gap: 16px;
    }

    .page-header h1 {
      font-size: 1.75rem;
    }

    .wallet-cards-container {
      gap: 12px;
    }
  }

  /* Dark theme support */
  .v-theme--dark .wallet-page {
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-primary), 0.05) 0%,
      rgba(var(--v-theme-surface), 1) 100%
    );
  }

  .v-theme--dark .empty-state {
    background: rgba(var(--v-theme-surface-variant), 0.5);
  }

  /* Loading animation */
  .v-progress-circular {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  /* Focus states for accessibility */
  .v-btn:focus {
    outline: 2px solid rgba(var(--v-theme-primary), 0.5);
    outline-offset: 2px;
  }

  /* Smooth scroll for mobile */
  @media (max-width: 600px) {
    .wallet-page {
      scroll-behavior: smooth;
    }
  }
</style>
