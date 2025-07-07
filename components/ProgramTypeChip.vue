<template>
  <v-chip
    :color="getProgramTypeColor(type)"
    size="small"
    :variant="variant"
    :class="chipClass"
  >
    <v-icon
      v-if="showIcon"
      :icon="getProgramTypeIcon(type)"
      size="16"
      class="me-1"
    />
    {{ getProgramTypeLabel(type) }}
  </v-chip>
</template>

<script setup lang="ts">
  import type { ProgramType } from '~/types/offer'

  interface Props {
    type: ProgramType
    variant?: string
    showIcon?: boolean
    class?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'flat',
    showIcon: false,
    class: '',
  })

  const chipClass = computed(() => props.class)

  const getProgramTypeColor = (type: ProgramType): string => {
    const colors = {
      cashback: 'green',
      points: 'blue',
      miles: 'purple',
    }
    return colors[type] || 'primary'
  }

  const getProgramTypeLabel = (type: ProgramType): string => {
    const labels = {
      cashback: 'Cashback',
      points: 'Pontos',
      miles: 'Milhas',
    }
    return labels[type] || type
  }

  const getProgramTypeIcon = (type: ProgramType): string => {
    const icons = {
      cashback: 'mdi-cash',
      points: 'mdi-star',
      miles: 'mdi-airplane',
    }
    return icons[type] || 'mdi-gift'
  }
</script>
