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
        VISUALIZAR PRODUTO
      </v-btn>
    </v-card-actions>

    <!-- Botão secundário -->
    <v-card-actions class="px-3 pt-0 pb-3">
      <v-btn
        variant="outlined"
        size="large"
        class="flex-grow-1"
        :color="getProgramTypeColor(offer.program.type)"
        @click="$emit('go:program', offer)"
      >
        <v-icon size="18" class="me-2">
          {{ getProgramTypeIcon(offer.program.type) }}
        </v-icon>
        {{ formatters.toTitleCase(offer.program.name) }}
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script setup lang="ts">
  import type { OfferItem } from '~/interfaces/offers'
  import type { ProgramType } from '~/interfaces/program'

  interface Props {
    offer: OfferItem
  }

  defineProps<Props>()

  defineEmits<{
    'view:product': [offer: OfferItem]
    'go:program': [offer: OfferItem]
  }>()

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
      cashback: 'mdi-cash',
      points: 'mdi-star',
      miles: 'mdi-airplane',
    }
    return icons[type] || 'mdi-gift'
  }
</script>
