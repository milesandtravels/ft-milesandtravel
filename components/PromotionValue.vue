<template>
  <div class="promotion-value">
    <v-divider class="mb-4"></v-divider>
    <div class="text-center">
      <p class="text-caption text-medium-emphasis mb-2">
        Valor Atual da Promoção
      </p>
      <p class="text-h4 font-weight-bold text-primary mb-0">
        {{ formattedValue }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ProgramType } from '~/interfaces/program'
  interface Props {
    value: number
    programType: ProgramType
  }

  const props = defineProps<Props>()

  const formattedValue = computed(() => {
    return formatValue(props.value, props.programType)
  })

  const formatValue = (value: number, type: ProgramType): string => {
    switch (type) {
      case 'miles':
        return `${value} milhas/R$`
      case 'points':
        return `${value} pontos/R$`
      case 'cashback':
        return `${value}% cashback`
      default:
        return value.toString()
    }
  }
</script>

<style scoped>
  .promotion-value {
    background: rgba(25, 118, 210, 0.02);
    padding: 20px;
    border-radius: 16px;
    margin: 0 -24px -24px -24px;
  }

  /* Responsive */
  @media (max-width: 600px) {
    .promotion-value {
      padding: 16px;
      margin: 0 -24px -24px -24px;
    }
  }

  /* Dark theme */
  .v-theme--dark .promotion-value {
    background: rgba(25, 118, 210, 0.08);
  }
</style>
