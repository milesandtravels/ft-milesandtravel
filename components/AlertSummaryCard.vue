<template>
  <v-card
    v-if="showSummary"
    class="summary-card mb-6"
    elevation="2"
    outlined
  >
    <v-card-title class="pb-2">
      <v-icon class="me-2" color="primary">mdi-clipboard-text</v-icon>
      Resumo do Alerta
    </v-card-title>
    
    <v-divider></v-divider>
    
    <v-card-text class="pt-4">
      <div class="summary-content">
        <div class="summary-item">
          <span class="item-label">{{ storeLabel }}:</span>
          <span class="item-value">{{ storeValue }}</span>
        </div>
        
        <div class="summary-item">
          <span class="item-label">{{ programLabel }}:</span>
          <span class="item-value">{{ programValue }}</span>
        </div>
        
        <div class="summary-item">
          <span class="item-label">Valor mínimo:</span>
          <span class="item-value text-primary font-weight-bold">{{ threshold }}{{ thresholdSuffix }}</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
interface Props {
  showSummary: boolean
  storeLabel: string
  storeValue: string
  programLabel: string
  programValue: string
  threshold: string | number
  thresholdSuffix: string
}

defineProps<Props>()
</script>

<style scoped>
.summary-card {
  border-radius: 8px;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.summary-item:last-child {
  border-bottom: none;
}

.item-label {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.7);
}

.item-value {
  font-size: 0.875rem;
  font-weight: 500;
}

/* Responsividade */
@media (max-width: 600px) {
  .summary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .item-value {
    align-self: flex-end;
  }
}
</style>