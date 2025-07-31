<template>
  <div>
    <!-- Botão principal -->
    <v-card-actions class="pa-3 pt-0">
      <v-btn
        color="primary"
        variant="flat"
        size="large"
        class="flex-grow-1 text-white font-weight-medium"
        @click="$emit('view:product', offer)"
      >
        <v-icon start size="18">mdi-open-in-new</v-icon>
        Ver produto
      </v-btn>
    </v-card-actions>

    <!-- Botão secundário -->
    <v-card-actions class="px-3 pt-0 pb-3">
      <v-btn
        variant="outlined"
        size="large"
        class="flex-grow-1"
        @click="handleViewProgram"
      >
        <v-icon size="18" class="me-2">
          {{ getProgramTypeIcon(offer.program.type) }}
        </v-icon>
        Ver Promoção
      </v-btn>
    </v-card-actions>

    <ProgramConfirmationModal
      v-model="showConfirmationModal"
      :program="offer.program"
      @confirm="$emit('go:program', offer)"
    />
  </div>
</template>

<script setup lang="ts">
  import type { OfferItem } from '~/interfaces/offers';
import type { ProgramType } from '~/interfaces/program';
  const showConfirmationModal = ref(false)
  interface Props {
    offer: OfferItem
  }

  defineProps<Props>()

  defineEmits<{
    'view:product': [offer: OfferItem]
    'go:program': [offer: OfferItem]
  }>()

  const handleViewProgram = (): void => {
    showConfirmationModal.value = true
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
