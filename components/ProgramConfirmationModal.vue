<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :max-width="dialogMaxWidth"
    :fullscreen="$vuetify.display.xs"
    persistent
    transition="dialog-bottom-transition"
    class="confirmation-dialog"
  >
    <v-card class="confirmation-modal" :class="cardClasses">
      <ProgramConfirmationModalHeader />
      <v-card-text class="modal-content" :class="contentClasses">
        <ProgramConfirmationModalInfoSection :program="program" />
        <ProgramConfirmationModalAlert :program-name="program.name" />
        <ProgramConfirmationModalGuidelines :guidelines="guidelines" />
      </v-card-text>
      <ProgramConfirmationModalFooter
        @cancel="handleCancel"
        @confirm="handleConfirm"
      />
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { Program } from '~/interfaces/program'
  import { useDisplay } from 'vuetify'

  interface Props {
    modelValue: boolean
    program: Program
    guidelines?: string[]
  }

  const props = withDefaults(defineProps<Props>(), {
    guidelines: () => [
      'Certifique-se de estar logado em sua conta do programa',
      'Complete o cadastro ou compra seguindo as regras do programa',
      'Aguarde o prazo de processamento conforme estabelecido pelo programa',
      'Em caso de dúvidas, entre em contato diretamente com o programa',
    ],
  })

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    cancel: []
    confirm: [program: Program]
  }>()

  const { xs, sm, md } = useDisplay()

  // Responsividade da modal
  const dialogMaxWidth = computed(() => {
    if (xs.value) return '100%'
    if (sm.value) return '480px'
    if (md.value) return '520px'
    return '560px'
  })

  const cardClasses = computed(() => ({
    'mobile-modal': xs.value,
    'tablet-modal': sm.value,
    'desktop-modal': md.value || (!xs.value && !sm.value),
  }))

  const contentClasses = computed(() => ({
    'pa-4': xs.value,
    'pa-5': sm.value,
    'pa-6': !xs.value && !sm.value,
  }))

  const handleCancel = (): void => {
    emit('update:modelValue', false)
  }

  const handleConfirm = (): void => {
    emit('confirm', props.program)
    emit('update:modelValue', false)
  }
</script>

<style scoped>
  .confirmation-dialog {
    z-index: 2000;
  }

  .confirmation-modal {
    border-radius: 16px !important;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }

  .mobile-modal {
    border-radius: 0 !important;
    height: 100vh;
    max-height: 100vh;
  }

  .tablet-modal {
    border-radius: 12px !important;
    max-height: 85vh;
  }

  .desktop-modal {
    border-radius: 16px !important;
    max-height: 80vh;
  }

  .modal-content {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(var(--v-theme-primary), 0.3) transparent;
  }

  .modal-content::-webkit-scrollbar {
    width: 6px;
  }

  .modal-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .modal-content::-webkit-scrollbar-thumb {
    background-color: rgba(var(--v-theme-primary), 0.3);
    border-radius: 3px;
  }

  .modal-content::-webkit-scrollbar-thumb:hover {
    background-color: rgba(var(--v-theme-primary), 0.5);
  }

  /* Animações suaves */
  .confirmation-modal {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Melhorias de acessibilidade */
  @media (prefers-reduced-motion: reduce) {
    .confirmation-modal {
      transition: none;
    }
  }

  /* Ajustes para telas muito pequenas */
  @media (max-height: 600px) {
    .mobile-modal {
      max-height: 100vh;
    }
  }
</style>
