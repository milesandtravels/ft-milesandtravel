<template>
  <v-dialog v-model="isOpen" max-width="1200px" scrollable persistent>
    <v-card class="promotion-history-modal">
      <v-card-title class="d-flex align-center justify-space-between pa-6">
        <div class="d-flex align-center ga-3">
          <v-avatar size="40" rounded="lg">
            <v-img
              :src="ecommerce?.logo_url || '/placeholder-logo.png'"
              :alt="ecommerce?.name || 'E-commerce'"
            />
          </v-avatar>
          <div>
            <h2 class="text-h6 font-weight-bold">{{ ecommerce?.name }}</h2>
            <p class="text-caption text-medium-emphasis ma-0">
              Histórico de Promoções
            </p>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" @click="closeModal" />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-0">
        <v-container fluid class="pa-6">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12">
            <v-progress-circular indeterminate color="primary" size="64" />
            <p class="text-body-1 mt-4">Carregando histórico...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-12">
            <v-icon
              icon="mdi-alert-circle"
              size="64"
              color="error"
              class="mb-4"
            />
            <p class="text-body-1 text-error">{{ error }}</p>
            <v-btn
              color="primary"
              variant="outlined"
              @click="fetchHistory"
              class="mt-4"
            >
              Tentar Novamente
            </v-btn>
          </div>

          <!-- Content -->
          <div v-else-if="historyData">
            <!-- Tabs -->
            <v-tabs v-model="activeTab" color="primary" class="mb-6">
              <v-tab value="timeline">
                <v-icon start>mdi-timeline</v-icon>
                Timeline
              </v-tab>
              <v-tab value="chart">
                <v-icon start>mdi-chart-line</v-icon>
                Gráfico
              </v-tab>
              <v-tab value="calendar">
                <v-icon start>mdi-calendar</v-icon>
                Calendário
              </v-tab>
              <v-tab value="comparison">
                <v-icon start>mdi-compare</v-icon>
                Comparação
              </v-tab>
            </v-tabs>

            <v-tabs-window v-model="activeTab">
              <!-- Timeline Tab -->
              <v-tabs-window-item value="timeline">
                <PromotionHistoryTimeline
                  :history-data="historyData"
                  :ecommerce="ecommerce"
                />
              </v-tabs-window-item>

              <!-- Chart Tab -->
              <v-tabs-window-item value="chart">
                <PromotionHistoryChart
                  :chart-data="chartData"
                  :programs="programs"
                />
              </v-tabs-window-item>

              <!-- Calendar Tab -->
              <v-tabs-window-item value="calendar">
                <PromotionHistoryCalendar
                  :history-data="historyData"
                  :selected-program="selectedProgram"
                  @update:selected-program="selectedProgram = $event"
                />
              </v-tabs-window-item>

              <!-- Comparison Tab -->
              <v-tabs-window-item value="comparison">
                <PromotionHistoryComparison
                  :history-data="historyData"
                  :programs="programs"
                  :ecommerce="ecommerce"
                />
              </v-tabs-window-item>
            </v-tabs-window>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <v-icon
              icon="mdi-history"
              size="64"
              color="grey-lighten-1"
              class="mb-4"
            />
            <p class="text-body-1 text-medium-emphasis">
              Nenhum histórico encontrado para este e-commerce
            </p>
          </div>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import type { Ecommerce } from '~/interfaces/ecommerces'
  import type { Program } from '~/interfaces/program'
  import type {
    PromotionHistoryChartData,
    PromotionHistoryResponse,
  } from '~/interfaces/promotions'
  import PromotionHistoryCalendar from './PromotionHistoryCalendar.vue'
  import PromotionHistoryChart from './PromotionHistoryChart.vue'
  import PromotionHistoryComparison from './PromotionHistoryComparison.vue'
  import PromotionHistoryTimeline from './PromotionHistoryTimeline.vue'

  interface Props {
    modelValue: boolean
    ecommerce: Ecommerce | null
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
  }>()

  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  const historyData = ref<PromotionHistoryResponse | null>(null)
  const activeTab = ref('timeline')
  const selectedProgram = ref<string | null>(null)

  // Computed
  const isOpen = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  const programs = computed(() => {
    if (!historyData.value) return []

    const programsMap = new Map<string, Program>()

    Object.values(historyData.value).forEach(histories => {
      histories.forEach(history => {
        if (!programsMap.has(history.program.id.toString())) {
          programsMap.set(history.program.id.toString(), history.program)
        }
      })
    })

    return Array.from(programsMap.values())
  })

  const chartData = computed((): PromotionHistoryChartData[] => {
    if (!historyData.value) return []

    const data: PromotionHistoryChartData[] = []
    const colors = [
      '#1976D2',
      '#388E3C',
      '#F57C00',
      '#7B1FA2',
      '#D32F2F',
      '#00796B',
    ]

    Object.entries(historyData.value).forEach(
      ([programId, histories], index) => {
        const program = histories[0]?.program
        if (!program) return

        histories.forEach(history => {
          data.push({
            date: new Date(history.created_at).toISOString().split('T')[0],
            value: parseFloat(history.current_value),
            program: program.name,
            programColor: colors[index % colors.length],
          })
        })
      }
    )

    return data.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  })

  // Methods
  const fetchHistory = async (): Promise<void> => {
    if (!props.ecommerce?.id) return

    loading.value = true
    error.value = null

    try {
      const { data } = await useSanctumFetch<PromotionHistoryResponse>(
        `/api/promotion-histories/${props.ecommerce.id}`,
        {
          method: 'GET',
        }
      )

      historyData.value = data.value

      // Set first program as selected by default
      if (data.value && Object.keys(data.value).length > 0) {
        selectedProgram.value = Object.keys(data.value)[0]
      }
    } catch (err) {
      console.error('Erro ao carregar histórico:', err)
      error.value = 'Erro ao carregar histórico de promoções'
    } finally {
      loading.value = false
    }
  }

  const closeModal = (): void => {
    isOpen.value = false
    // Reset state when closing
    setTimeout(() => {
      historyData.value = null
      error.value = null
      activeTab.value = 'timeline'
      selectedProgram.value = null
    }, 300)
  }

  // Watchers
  watch(
    () => props.modelValue,
    newValue => {
      if (newValue && props.ecommerce?.id) {
        fetchHistory()
      }
    },
    { immediate: true }
  )
</script>

<style scoped>
  .promotion-history-modal {
    border-radius: 16px;
    overflow: hidden;
  }

  .promotion-history-modal .v-card-title {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }

  .v-theme--dark .promotion-history-modal .v-card-title {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }

  .v-tabs {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }

  .v-theme--dark .v-tabs {
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }
</style>
