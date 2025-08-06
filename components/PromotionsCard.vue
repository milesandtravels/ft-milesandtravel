<template>
  <v-card class="promotion-card h-100" elevation="2" hover>
    <v-card-text class="pa-6">
      <PromotionLogosHeader
        :ecommerce="promotion.ecommerce"
        :program="promotion.program"
      />

      <PromotionValue
        :value="promotion.current_value"
        :program-type="promotion.program.type"
      />
    </v-card-text>

    <v-card-actions class="pa-6 pt-0 d-flex flex-column ga-2">
      <v-btn
        variant="outlined"
        color="primary"
        block
        size="large"
        class="text-none"
        @click="handleViewDetails"
      >
        <v-icon start>mdi-external-link</v-icon>
        Ver promoção
      </v-btn>

      <v-btn
        color="primary"
        block
        size="large"
        class="text-none"
        @click="handleViewHistory"
      >
        <v-icon start>mdi-history</v-icon>
        Ver histórico
      </v-btn>
    </v-card-actions>

       <ProgramConfirmationModal
      v-model="showConfirmationModal"
      :program="promotion.program"
      :guidelines="guidelines"
      @confirm="handleModalConfirm"
    />


    <PromotionHistoryModal
      v-model="showHistoryModal"
      :ecommerce="promotion.ecommerce"
    />
  </v-card>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
import type { Promotion } from '~/interfaces/promotions';

  interface Props {
    promotion: Promotion
    customGuidelines?: string[]
  }

  const props = withDefaults(defineProps<Props>(), {
    customGuidelines: () => [
      'Leia atentamente todas as regras e condições do programa',
      'Verifique os prazos de validade das promoções',
      'Confirme os valores e taxas de conversão atuais',
      'Observe os termos específicos de cada e-commerce parceiro',
      'Mantenha-se atualizado sobre mudanças nas regras',
    ],
  })

  const emit = defineEmits<{
    'view-details': [promotion: Promotion]
    'program-accessed': [promotion: Promotion]
    'view-history': [promotion: Promotion]
  }>()

  // State
  const showConfirmationModal = ref(false)
  const showHistoryModal = ref(false)

  // Computed
  const guidelines = computed(() => props.customGuidelines)

  // Methods
  const handleViewDetails = (): void => {
    showConfirmationModal.value = true
    emit('view-details', props.promotion)
  }

  const handleModalConfirm = (): void => {
    window.open(props.promotion.promotion_link, '_blank', 'noopener,noreferrer')
    emit('program-accessed', props.promotion)
  }

  const handleViewHistory = (): void => {
    showHistoryModal.value = true
    emit('view-history', props.promotion)
  }
</script>

<style scoped>
  .promotion-card {
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .promotion-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
  }

  .h-100 {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .h-100 .v-card-text {
    flex-grow: 1;
  }

  /* Dark theme support */
  .v-theme--dark .promotion-card {
    border-color: rgba(255, 255, 255, 0.12);
  }
</style>
