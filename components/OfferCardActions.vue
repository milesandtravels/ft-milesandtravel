<template>
  <div>
    <!-- Botão principal - Comprar com bonificação -->
    <v-card-actions class="pa-3 pt-0">
      <v-btn
        color="primary"
        variant="flat"
        size="large"
        class="flex-grow-1 text-white font-weight-medium"
        @click="handleViewProduct"
      >
        <v-icon start size="18">mdi-shopping</v-icon>
        Compre por aqui
      </v-btn>
    </v-card-actions>

    <!-- Botão secundário - Cadastrar no programa -->
    <v-card-actions class="px-3 pt-0 pb-3">
      <v-btn
        variant="outlined"
        size="large"
        class="flex-grow-1"
        @click="handleViewProgram"
      >
        <v-icon size="18" class="me-2">mdi-account-plus</v-icon>
        Cadastre-se
      </v-btn>
    </v-card-actions>

    <!-- Modal "Atenção - Regras do Programa" para "Compre por aqui" -->
    <ProgramConfirmationModal
      v-model="showProgramConfirmationModal"
      :program="offer.program"
      @confirm="handleProgramConfirmation"
    />
  </div>
</template>

<script setup lang="ts">
  import type { OfferItem } from '~/interfaces/offers'
  import type { ProgramType } from '~/interfaces/program'

  const showProgramConfirmationModal = ref(false)
  interface Props {
    offer: OfferItem
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    'view:product': [offer: OfferItem]
    'go:program': [offer: OfferItem]
  }>()

  const handleViewProgram = (): void => {
    // Redirecionar diretamente para o programa sem modal
    window.open(props.offer.program.link_url, '_blank', 'noopener,noreferrer')
  }

  const handleViewProduct = (): void => {
    showProgramConfirmationModal.value = true
  }

  const handleProgramConfirmation = (): void => {
    // Usar promotion_link ao invés de product_url
    window.open(props.offer.promotion_link, '_blank', 'noopener,noreferrer')
  }

  const getProgramTypeColor = (type: ProgramType): string => {
    const colors = {
      cashback: 'green',
      points: 'blue',
      miles: 'purple',
    }
    return colors[type] || 'primary'
  }

  const getProgramTypeIcon = (type: ProgramType): string => {
    const icons = {
      cashback: 'mdi-wallet',
      points: 'mdi-trophy',
      miles: 'mdi-flight',
    }
    return icons[type] || 'mdi-gift-outline'
  }

  const getRewardLabel = (type: ProgramType): string => {
    const labels = {
      cashback: 'Cashback',
      points: 'Pontos',
      miles: 'Milhas',
    }
    return labels[type] || 'Desconto'
  }
</script>

<style scoped>
  .v-btn {
    text-transform: none !important;
  }
</style>
