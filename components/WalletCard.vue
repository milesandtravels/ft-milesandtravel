<template>
  <v-card class="wallet-card" :class="typeClass" elevation="2" hover>
    <v-card-text class="pa-4">
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="d-flex align-center">
          <v-avatar class="program-logo mr-3" size="48">
            <img :src="account.program.logo_url" :alt="account.program.name" />
          </v-avatar>
          <div>
            <h4 class="text-h6 font-weight-bold program-name">
              {{
                account.program.name.charAt(0).toUpperCase() +
                account.program.name.slice(1)
              }}
            </h4>
            <v-chip
              :color="typeColor"
              size="small"
              variant="tonal"
              class="text-capitalize"
            >
              {{ typeLabel }}
            </v-chip>
          </div>
        </div>
      </div>

      <div class="balance-section mb-3">
        <div class="text-caption text-medium-emphasis mb-1">Saldo Atual</div>
        <div class="text-h5 font-weight-bold balance-value">
          {{ formattedBalance }}
        </div>
      </div>

      <div class="card-actions d-flex justify-end">
        <v-btn icon size="small" variant="text" @click="$emit('edit', account)">
          <v-icon>mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="top">
            Editar saldo
          </v-tooltip>
        </v-btn>

        <v-btn
          icon
          size="small"
          variant="text"
          color="error"
          @click="$emit('delete', account)"
        >
          <v-icon>mdi-delete</v-icon>
          <v-tooltip activator="parent" location="top">
            Remover da carteira
          </v-tooltip>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { WalletAccount } from '~/interfaces/wallet'
  import type { ProgramType } from '~/interfaces/program'

  interface Props {
    account: WalletAccount
  }

  interface Emits {
    edit: [account: WalletAccount]
    delete: [account: WalletAccount]
  }

  const props = defineProps<Props>()
  defineEmits<Emits>()

  const typeColor = computed(() => {
    const colors: Record<ProgramType, string> = {
      points: 'info',
      miles: 'purple',
    }
    return colors[props.account.program.type] || 'primary'
  })

  const typeLabel = computed(() => {
    const labels: Record<ProgramType, string> = {
      points: 'pontos',
      miles: 'milhas',
    }
    return labels[props.account.program.type] || props.account.program.type
  })

  const typeClass = computed(() => {
    return `wallet-card--${props.account.program.type}`
  })

  const formattedBalance = computed(() => {
    return new Intl.NumberFormat('pt-BR').format(props.account.balance)
  })
</script>

<style scoped>
  .wallet-card {
    border-radius: 16px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .wallet-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }

  .wallet-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: currentColor;
    opacity: 0.8;
  }

  .wallet-card--points::before {
    background: rgb(var(--v-theme-info));
  }

  .wallet-card--miles::before {
    background: rgb(var(--v-theme-purple));
  }

  .program-logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 8px;
  }

  .program-name {
    line-height: 1.2;
    margin-bottom: 4px;
  }

  .balance-section {
    padding: 12px 16px;
    background: rgba(var(--v-theme-surface), 0.5);
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.06);
  }

  .balance-value {
    line-height: 1.2;
    color: rgb(var(--v-theme-primary));
  }

  .card-actions {
    gap: 4px;
  }

  .card-actions .v-btn {
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }

  .wallet-card:hover .card-actions .v-btn {
    opacity: 1;
  }

  @media (max-width: 600px) {
    .wallet-card {
      margin-bottom: 12px;
    }

    .balance-section {
      padding: 8px 12px;
    }
  }

  /* Dark theme support */
  .v-theme--dark .balance-section {
    background: rgba(var(--v-theme-surface-variant), 0.3);
    border-color: rgba(255, 255, 255, 0.12);
  }

  .v-theme--dark .wallet-card {
    background: rgb(var(--v-theme-surface));
  }
</style>
