<template>
  <v-card class="wallet-summary mb-6" elevation="0" variant="tonal">
    <v-card-text class="pa-4">
      <v-row>
        <v-col cols="12" class="pb-2">
          <h3 class="text-h6 font-weight-bold mb-3">Resumo da Carteira</h3>
        </v-col>

        <v-col cols="12" sm="6">
          <div class="summary-item points">
            <div class="d-flex align-center">
              <v-avatar class="summary-icon mr-3" color="info" size="40">
                <v-icon color="white">mdi-star</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Pontos</div>
                <div class="text-h6 font-weight-bold">
                  {{ formatNumber(summary.totalPoints) }}
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" sm="6">
          <div class="summary-item miles">
            <div class="d-flex align-center">
              <v-avatar class="summary-icon mr-3" color="purple" size="40">
                <v-icon color="white">mdi-airplane</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Milhas</div>
                <div class="text-h6 font-weight-bold">
                  {{ formatNumber(summary.totalMiles) }}
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { WalletSummary } from '~/interfaces/wallet'

  interface Props {
    summary: WalletSummary
  }

  defineProps<Props>()

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value)
  }
</script>

<style scoped>
  .wallet-summary {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 12px;
  }

  .summary-item {
    padding: 12px;
    border-radius: 8px;
    transition: all 0.2s ease;
    background: rgba(var(--v-theme-surface), 0.5);
  }

  .summary-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .summary-icon {
    flex-shrink: 0;
  }

  @media (max-width: 600px) {
    .summary-item {
      margin-bottom: 8px;
    }
  }
</style>
