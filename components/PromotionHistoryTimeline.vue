<template>
  <div class="promotion-timeline">
    <!-- Program Filter -->
    <div class="my-6">
      <v-select
        v-model="selectedPrograms"
        :items="programOptions"
        item-title="name"
        item-value="id"
        label="Filtrar por programa"
        multiple
        chips
        closable-chips
        variant="outlined"
        density="comfortable"
        class="mb-4"
      >
        <template #chip="{ props: chipProps, item }">
          <v-chip
            v-bind="chipProps"
            :color="getProgramColor(item.raw.id)"
            size="small"
          >
            <v-avatar start>
              <v-img :src="item.raw.logo_url" :alt="item.raw.name" />
            </v-avatar>
            {{ item.raw.name }}
          </v-chip>
        </template>
      </v-select>
    </div>

    <!-- Timeline -->
    <div class="timeline-container">
      <div v-if="filteredTimelineData.length === 0" class="text-center py-8">
        <v-icon
          icon="mdi-timeline-outline"
          size="48"
          color="grey-lighten-1"
          class="mb-3"
        />
        <p class="text-body-1 text-medium-emphasis">
          Nenhum histórico encontrado para os filtros selecionados
        </p>
      </div>

      <v-timeline
        v-else
        side="end"
        align="start"
        truncate-line="both"
        density="comfortable"
      >
        <v-timeline-item
          v-for="(item, index) in filteredTimelineData"
          :key="`${item.id}-${index}`"
          :dot-color="getProgramColor(item.program_id)"
          size="small"
        >
          <template #icon>
            <v-avatar size="24">
              <v-img :src="item.program.logo_url" :alt="item.program.name" />
            </v-avatar>
          </template>

          <template #opposite>
            <div class="text-caption text-medium-emphasis">
              {{ formatDate(item.created_at) }}
            </div>
          </template>

          <v-card
            class="timeline-card"
            elevation="2"
            :border="`2px solid ${getProgramColor(item.program_id)}`"
          >
            <v-card-text class="pa-4">
              <div class="d-flex align-center justify-space-between mb-2">
                <div class="d-flex align-center ga-2">
                  <v-avatar size="20" rounded="lg">
                    <v-img
                      :src="item.program.logo_url"
                      :alt="item.program.name"
                    />
                  </v-avatar>
                  <span class="text-subtitle-2 font-weight-bold">
                    {{ item.program.name }}
                  </span>
                </div>
                <v-chip
                  :color="getValueChangeColor(item)"
                  size="small"
                  variant="flat"
                >
                  <v-icon :icon="getValueChangeIcon(item)" start size="16" />
                  {{ getValueChangeText(item) }}
                </v-chip>
              </div>

              <div class="value-change-container">
                <div class="d-flex align-center ga-4">
                  <div class="value-box previous">
                    <span class="text-caption text-medium-emphasis"
                      >Anterior</span
                    >
                    <div class="text-h6 font-weight-bold">
                      {{ formatValue(item.previous_value, item.program.type) }}
                    </div>
                  </div>

                  <v-icon icon="mdi-arrow-right" color="primary" size="20" />

                  <div class="value-box current">
                    <span class="text-caption text-medium-emphasis">Atual</span>
                    <div class="text-h6 font-weight-bold text-primary">
                      {{ formatValue(item.current_value, item.program.type) }}
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="mt-3 pt-3"
                style="border-top: 1px solid rgba(0, 0, 0, 0.08)"
              >
                <div class="d-flex align-center justify-space-between">
                  <div class="text-caption text-medium-emphasis">
                    ID: #{{ item.id }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ formatDateTime(item.created_at) }}
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
import type { Ecommerce } from '~/interfaces/ecommerces'
import type { Program } from '~/interfaces/program'
import type {
  PromotionHistory,
  PromotionHistoryResponse,
} from '~/interfaces/promotions'

  interface Props {
    historyData: PromotionHistoryResponse
    ecommerce: Ecommerce | null
  }

  const props = defineProps<Props>()

  // State
  const selectedPrograms = ref<number[]>([])

  // Computed
  const programOptions = computed(() => {
    const programs: Program[] = []
    const programsMap = new Map<number, Program>()

    Object.values(props.historyData).forEach(histories => {
      histories.forEach(history => {
        if (!programsMap.has(history.program.id)) {
          programsMap.set(history.program.id, history.program)
        }
      })
    })

    return Array.from(programsMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  })

  const allTimelineData = computed(() => {
    const data: PromotionHistory[] = []

    Object.values(props.historyData).forEach(histories => {
      data.push(...histories)
    })

    return data.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  })

  const filteredTimelineData = computed(() => {
    if (selectedPrograms.value.length === 0) {
      return allTimelineData.value
    }

    return allTimelineData.value.filter(item =>
      selectedPrograms.value.includes(item.program_id)
    )
  })

  // Methods
  const getProgramColor = (programId: number): string => {
    const colors = [
      '#0f2b46',
      '#388E3C',
      '#F57C00',
      '#7B1FA2',
      '#D32F2F',
      '#00796B',
    ]
    const index = programOptions.value.findIndex(p => p.id === programId)
    return colors[index % colors.length]
  }

  const getValueChangeColor = (item: PromotionHistory): string => {
    const current = parseFloat(item.current_value)
    const previous = parseFloat(item.previous_value)

    if (current > previous) return 'success'
    if (current < previous) return 'error'
    return 'info'
  }

  const getValueChangeIcon = (item: PromotionHistory): string => {
    const current = parseFloat(item.current_value)
    const previous = parseFloat(item.previous_value)

    if (current > previous) return 'mdi-trending-up'
    if (current < previous) return 'mdi-trending-down'
    return 'mdi-minus'
  }

  const getValueChangeText = (item: PromotionHistory): string => {
    const current = parseFloat(item.current_value)
    const previous = parseFloat(item.previous_value)
    const diff = current - previous

    if (diff > 0) return `+${diff.toFixed(1)}%`
    if (diff < 0) return `${diff.toFixed(1)}%`
    return 'Sem alteração'
  }

  const formatValue = (value: string, programType: string): string => {
    const numValue = parseFloat(value)

    if (programType === 'cashback') {
      return `${numValue.toFixed(1)}%`
    }

    return `${numValue.toFixed(1)} pts`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Initialize with all programs selected
  selectedPrograms.value = programOptions.value.map(p => p.id)
</script>

<style scoped>
  .promotion-timeline {
    max-height: 600px;
    overflow-y: auto;
  }

  .timeline-container {
    position: relative;
  }

  .timeline-card {
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .timeline-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  }

  .value-change-container {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 8px;
    padding: 12px;
    margin: 8px 0;
  }

  .v-theme--dark .value-change-container {
    background: rgba(255, 255, 255, 0.05);
  }

  .value-box {
    text-align: center;
    padding: 8px 12px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.8);
    min-width: 80px;
  }

  .v-theme--dark .value-box {
    background: rgba(255, 255, 255, 0.1);
  }

  .value-box.previous {
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  .value-box.current {
    border: 2px solid rgb(var(--v-theme-primary));
  }

  .v-theme--dark .value-box.previous {
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  /* Custom scrollbar */
  .promotion-timeline::-webkit-scrollbar {
    width: 6px;
  }

  .promotion-timeline::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }

  .promotion-timeline::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  .promotion-timeline::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  .v-theme--dark .promotion-timeline::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  .v-theme--dark .promotion-timeline::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }

  .v-theme--dark .promotion-timeline::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
</style>
