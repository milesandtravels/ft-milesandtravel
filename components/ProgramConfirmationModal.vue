<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="520"
    persistent
  >
    <v-card class="confirmation-modal">
      <ProgramConfirmationModalHeader />
      <v-card-text class="pa-6">
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
  import type { Program } from '~/interfaces/program';

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

  const handleCancel = (): void => {
    emit('update:modelValue', false)
  }

  const handleConfirm = (): void => {
    emit('update:modelValue', false)
    emit('confirm', props.program)
  }
</script>

<style scoped>
  .confirmation-modal {
    border-radius: 12px !important;
    overflow: hidden;
  }
</style>
