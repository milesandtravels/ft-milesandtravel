<template>
  <div class="promotion-comparison">
    <!-- Comparison Header -->
    <div class="comparison-header my-6">
      <h3 class="text-h6 font-weight-bold mb-2">Comparação entre Programas</h3>
      <p class="text-body-2 text-medium-emphasis">
        Compare o desempenho do {{ ecommerce?.name }} em diferentes programas de
        fidelidade
      </p>
    </div>

    <!-- Program Statistics Cards -->
    <div class="program-stats mb-6">
      <v-row>
        <v-col
          v-for="program in programsWithStats"
          :key="program.id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card
            class="program-stat-card h-100"
            elevation="2"
            :style="{ borderTop: `4px solid ${getProgramColor(program.id)}` }"
          >
            <v-card-text class="pa-4">
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="d-flex align-center ga-2">
                  <v-avatar size="32" rounded="lg">
                    <v-img :src="program.logo_url" :alt="program.name" />
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">
                      {{ program.name }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ program.type === 'cashback' ? 'Cashback' : 'Pontos' }}
                    </div>
                  </div>
                </div>
                <v-chip
                  :color="getProgramColor(program.id)"
                  size="small"
                  variant="flat"
                >
                  {{ program.stats.totalChanges }} alterações
                </v-chip>
              </div>

              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-label">Valor Atual</div>
                  <div class="stat-value text-primary">
                    {{ formatValue(program.stats.currentValue, program.type) }}
                  </div>
                </div>

                <div class="stat-item">
                  <div class="stat-label">Valor Máximo</div>
                  <div class="stat-value text-success">
                    {{ formatValue(program.stats.maxValue, program.type) }}
                  </div>
                </div>

                <div class="stat-item">
                  <div class="stat-label">Valor Mínimo</div>
                  <div class="stat-value text-error">
                    {{ formatValue(program.stats.minValue, program.type) }}
                  </div>
                </div>

                <div class="stat-item">
                  <div class="stat-label">Média</div>
                  <div class="stat-value">
                    {{ formatValue(program.stats.avgValue, program.type) }}
                  </div>
                </div>
              </div>

              <div class="trend-indicator mt-3">
                <div class="d-flex align-center justify-space-between">
                  <span class="text-caption">Tendência (30 dias)</span>
                  <div class="d-flex align-center ga-1">
                    <v-icon
                      :icon="program.stats.trend.icon"
                      :color="program.stats.trend.color"
                      size="16"
                    />
                    <span
                      class="text-caption font-weight-bold"
                      :class="`text-${program.stats.trend.color}`"
                    >
                      {{ program.stats.trend.text }}
                    </span>
                  </div>
                </div>
                <v-progress-linear
                  :model-value="program.stats.trend.percentage"
                  :color="program.stats.trend.color"
                  height="4"
                  rounded
                  class="mt-2"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Detailed Comparison Table -->
    <div class="comparison-table">
      <v-card elevation="2">
        <v-card-title> Comparação Detalhada </v-card-title>

        <v-card-text class="pa-0">
          <v-data-table
            :headers="tableHeaders"
            :items="tableData"
            :items-per-page="10"
            class="comparison-data-table"
          >
            <template #item.program="{ item }">
              <div class="d-flex align-center ga-2">
                <v-avatar size="24" rounded="lg">
                  <v-img
                    :src="item.program.logo_url"
                    :alt="item.program.name"
                  />
                </v-avatar>
                <span class="font-weight-medium">{{ item.program.name }}</span>
              </div>
            </template>

            <template #item.currentValue="{ item }">
              <span class="font-weight-bold text-primary">
                {{ formatValue(item.currentValue, item.program.type) }}
              </span>
            </template>

            <template #item.change="{ item }">
              <v-chip :color="item.changeColor" size="small" variant="flat">
                <v-icon :icon="item.changeIcon" start size="12" />
                {{ item.changeText }}
              </v-chip>
            </template>

            <template #item.lastUpdate="{ item }">
              <span class="text-caption">
                {{ formatDateTime(item.lastUpdate) }}
              </span>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
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
    programs: Program[]
    ecommerce: Ecommerce | null
  }

  interface ProgramStats {
    id: number
    name: string
    type: string
    logo_url: string
    stats: {
      totalChanges: number
      currentValue: number
      maxValue: number
      minValue: number
      avgValue: number
      trend: {
        icon: string
        color: string
        text: string
        percentage: number
      }
    }
  }

  interface ComparisonChartPoint {
    x: number
    y: number
    color: string
    value: number
    date: string
    program: string
  }

  interface ComparisonChartLine {
    path: string
    color: string
  }

  const props = defineProps<Props>()

  // State
  const chartTimeRange = ref('30d')

  // Chart dimensions
  const comparisonChartDimensions = {
    width: 700,
    height: 300,
    margin: { top: 20, right: 20, bottom: 40, left: 60 },
  }

  // Computed
  const programsWithStats = computed((): ProgramStats[] => {
    return props.programs
      .map(program => {
        const histories = props.historyData[program.id.toString()] || []

        if (histories.length === 0) {
          return {
            ...program,
            stats: {
              totalChanges: 0,
              currentValue: 0,
              maxValue: 0,
              minValue: 0,
              avgValue: 0,
              trend: {
                icon: 'mdi-minus',
                color: 'info',
                text: 'Sem dados',
                percentage: 0,
              },
            },
          }
        }

        const values = histories.map(h => parseFloat(h.current_value))
        const currentValue = values[0] || 0
        const maxValue = Math.max(...values)
        const minValue = Math.min(...values)
        const avgValue =
          values.reduce((sum, val) => sum + val, 0) / values.length

        // Calculate trend for last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const recentHistories = histories
          .filter(h => new Date(h.created_at) >= thirtyDaysAgo)
          .sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          )

        let trend = {
          icon: 'mdi-minus',
          color: 'info',
          text: 'Estável',
          percentage: 50,
        }

        if (recentHistories.length >= 2) {
          const firstValue = parseFloat(recentHistories[0].current_value)
          const lastValue = parseFloat(
            recentHistories[recentHistories.length - 1].current_value
          )
          const change = ((lastValue - firstValue) / firstValue) * 100

          if (change > 5) {
            trend = {
              icon: 'mdi-trending-up',
              color: 'success',
              text: `+${change.toFixed(1)}%`,
              percentage: Math.min(100, 50 + change * 2),
            }
          } else if (change < -5) {
            trend = {
              icon: 'mdi-trending-down',
              color: 'error',
              text: `${change.toFixed(1)}%`,
              percentage: Math.max(0, 50 + change * 2),
            }
          }
        }

        return {
          ...program,
          stats: {
            totalChanges: histories.length,
            currentValue,
            maxValue,
            minValue,
            avgValue,
            trend,
          },
        }
      })
      .sort((a, b) => b.stats.totalChanges - a.stats.totalChanges)
  })

  const filteredComparisonData = computed(() => {
    const data: PromotionHistory[] = []

    Object.values(props.historyData).forEach(histories => {
      data.push(...histories)
    })

    // Filter by time range
    if (chartTimeRange.value !== 'all') {
      const now = new Date()
      const cutoffDate = new Date()

      switch (chartTimeRange.value) {
        case '7d':
          cutoffDate.setDate(now.getDate() - 7)
          break
        case '30d':
          cutoffDate.setDate(now.getDate() - 30)
          break
        case '90d':
          cutoffDate.setDate(now.getDate() - 90)
          break
      }

      return data.filter(item => new Date(item.created_at) >= cutoffDate)
    }

    return data.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  })

  const comparisonXScale = computed(() => {
    const dates = filteredComparisonData.value.map(d =>
      new Date(d.created_at).getTime()
    )
    if (dates.length === 0) return { min: 0, max: 1, range: 1 }

    const minDate = Math.min(...dates)
    const maxDate = Math.max(...dates)

    return {
      min: minDate,
      max: maxDate,
      range: maxDate - minDate || 1,
    }
  })

  const comparisonYScale = computed(() => {
    const values = filteredComparisonData.value.map(d =>
      parseFloat(d.current_value)
    )
    if (values.length === 0) return { min: 0, max: 10, range: 10 }

    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const padding = (maxValue - minValue) * 0.1 || 1

    return {
      min: Math.max(0, minValue - padding),
      max: maxValue + padding,
      range: maxValue + padding - Math.max(0, minValue - padding),
    }
  })

  const comparisonYTicks = computed(() => {
    const ticks = []
    const step = comparisonYScale.value.range / 4

    for (let i = 0; i <= 4; i++) {
      ticks.push(comparisonYScale.value.min + step * i)
    }

    return ticks
  })

  const comparisonChartLines = computed(() => {
    const lines: Record<string, ComparisonChartLine> = {}

    // Group data by program
    const programData: Record<string, PromotionHistory[]> = {}

    filteredComparisonData.value.forEach(item => {
      const programName = item.program.name
      if (!programData[programName]) {
        programData[programName] = []
      }
      programData[programName].push(item)
    })

    // Create line paths
    Object.entries(programData).forEach(([programName, data]) => {
      const sortedData = data.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )

      const pathData = sortedData
        .map((item, index) => {
          const x = getComparisonXPosition(new Date(item.created_at).getTime())
          const y = getComparisonYPosition(parseFloat(item.current_value))
          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
        })
        .join(' ')

      const program = props.programs.find(p => p.name === programName)
      const color = program ? getProgramColor(program.id) : '#000000'

      lines[programName] = {
        path: pathData,
        color,
      }
    })

    return lines
  })

  const comparisonChartPoints = computed(() => {
    return filteredComparisonData.value.map(item => {
      const color = getProgramColor(item.program_id)

      return {
        x: getComparisonXPosition(new Date(item.created_at).getTime()),
        y: getComparisonYPosition(parseFloat(item.current_value)),
        color,
        value: parseFloat(item.current_value),
        date: item.created_at,
        program: item.program.name,
      }
    })
  })

  const tableHeaders = [
    { title: 'Programa', key: 'program', sortable: false },
    { title: 'Valor Atual', key: 'currentValue', sortable: true },
    { title: 'Variação', key: 'change', sortable: false },
    { title: 'Total de Alterações', key: 'totalChanges', sortable: true },
    { title: 'Última Atualização', key: 'lastUpdate', sortable: true },
  ]

  const tableData = computed(() => {
    return programsWithStats.value.map(program => {
      const histories = props.historyData[program.id.toString()] || []
      const latestHistory = histories[0]

      let changeColor = 'info'
      let changeIcon = 'mdi-minus'
      let changeText = 'Sem dados'

      if (latestHistory && histories.length > 1) {
        const current = parseFloat(latestHistory.current_value)
        const previous = parseFloat(latestHistory.previous_value)
        const diff = current - previous

        if (diff > 0) {
          changeColor = 'success'
          changeIcon = 'mdi-trending-up'
          changeText = `+${diff.toFixed(1)}%`
        } else if (diff < 0) {
          changeColor = 'error'
          changeIcon = 'mdi-trending-down'
          changeText = `${diff.toFixed(1)}%`
        } else {
          changeText = 'Sem alteração'
        }
      }

      return {
        program,
        currentValue: program.stats.currentValue,
        changeColor,
        changeIcon,
        changeText,
        totalChanges: program.stats.totalChanges,
        lastUpdate: latestHistory?.created_at || '',
      }
    })
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
    const index = props.programs.findIndex(p => p.id === programId)
    return colors[index % colors.length]
  }

  const formatValue = (value: number, programType: string): string => {
    if (programType === 'cashback') {
      return `${value.toFixed(1)}%`
    }
    return `${value.toFixed(1)} pts`
  }

  const formatDateTime = (dateString: string): string => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getComparisonXPosition = (timestamp: number): number => {
    const { margin, width } = comparisonChartDimensions
    const chartWidth = width - margin.left - margin.right
    const ratio =
      (timestamp - comparisonXScale.value.min) / comparisonXScale.value.range
    return margin.left + ratio * chartWidth
  }

  const getComparisonYPosition = (value: number): number => {
    const { margin, height } = comparisonChartDimensions
    const chartHeight = height - margin.top - margin.bottom
    const ratio =
      (value - comparisonYScale.value.min) / comparisonYScale.value.range
    return height - margin.bottom - ratio * chartHeight
  }
</script>

<style scoped>
  .promotion-comparison {
    width: 100%;
  }

  .program-stat-card {
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .program-stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 16px 0;
  }

  .stat-item {
    text-align: center;
    padding: 8px;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 6px;
  }

  .v-theme--dark .stat-item {
    background: rgba(255, 255, 255, 0.05);
  }

  .stat-label {
    font-size: 11px;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 4px;
  }

  .v-theme--dark .stat-label {
    color: rgba(255, 255, 255, 0.7);
  }

  .stat-value {
    font-size: 14px;
    font-weight: bold;
  }

  .trend-indicator {
    padding: 12px;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 8px;
  }

  .v-theme--dark .trend-indicator {
    background: rgba(255, 255, 255, 0.05);
  }

  .comparison-chart-container {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 8px;
    padding: 16px;
  }

  .v-theme--dark .comparison-chart-container {
    background: rgba(255, 255, 255, 0.05);
  }

  .comparison-svg-chart {
    background: white;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .v-theme--dark .comparison-svg-chart {
    background: rgba(255, 255, 255, 0.05);
  }

  .comparison-chart-line {
    transition: stroke-width 0.3s ease;
  }

  .comparison-chart-line:hover {
    stroke-width: 3;
  }

  .comparison-chart-point {
    transition: r 0.3s ease;
  }

  .comparison-chart-point:hover {
    r: 5;
  }

  .comparison-axis-label {
    font-size: 11px;
    fill: rgba(0, 0, 0, 0.6);
  }

  .v-theme--dark .comparison-axis-label {
    fill: rgba(255, 255, 255, 0.7);
  }

  .comparison-data-table {
    border-radius: 0;
  }

  .comparison-data-table :deep(.v-data-table__td) {
    padding: 12px 16px;
  }

  .comparison-data-table :deep(.v-data-table__th) {
    background: rgba(0, 0, 0, 0.02);
    font-weight: 600;
  }

  .v-theme--dark .comparison-data-table :deep(.v-data-table__th) {
    background: rgba(255, 255, 255, 0.05);
  }
</style>
