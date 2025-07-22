<template>
  <div class="promotion-chart">
    <!-- Chart Controls -->
    <div class="chart-controls mb-6">
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="selectedPrograms"
            :items="programOptions"
            item-title="name"
            item-value="id"
            label="Programas"
            multiple
            chips
            closable-chips
            variant="outlined"
            density="comfortable"
          >
            <template #chip="{ props: chipProps, item }">
              <v-chip
                v-bind="chipProps"
                :color="getProgramColor(item.raw.id)"
                size="small"
              >
                <v-avatar start size="16">
                  <v-img :src="item.raw.logo_url" :alt="item.raw.name" />
                </v-avatar>
                {{ item.raw.name }}
              </v-chip>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="dateRange"
            :items="dateRangeOptions"
            label="Período"
            variant="outlined"
            density="comfortable"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Chart Container -->
    <div class="chart-container">
      <div v-if="filteredChartData.length === 0" class="text-center py-12">
        <v-icon
          icon="mdi-chart-line"
          size="64"
          color="grey-lighten-1"
          class="mb-4"
        />
        <p class="text-body-1 text-medium-emphasis">
          Nenhum dado encontrado para o período selecionado
        </p>
      </div>

      <div v-else class="chart-wrapper">
        <!-- Chart Header -->
        <div class="chart-header mb-4">
          <h3 class="text-h6 font-weight-bold">Variação de Valores</h3>
          <p class="text-caption text-medium-emphasis">
            Acompanhe a evolução dos valores ao longo do tempo
          </p>
        </div>

        <!-- SVG Chart -->
        <div class="svg-chart-container">
          <svg
            ref="chartSvg"
            :width="chartDimensions.width"
            :height="chartDimensions.height"
            class="line-chart"
          >
            <!-- Grid Lines -->
            <g class="grid">
              <!-- Horizontal grid lines -->
              <line
                v-for="(tick, index) in yAxisTicks"
                :key="`h-grid-${index}`"
                :x1="chartDimensions.margin.left"
                :y1="getYPosition(tick)"
                :x2="chartDimensions.width - chartDimensions.margin.right"
                :y2="getYPosition(tick)"
                stroke="rgba(0,0,0,0.1)"
                stroke-width="1"
              />

              <!-- Vertical grid lines -->
              <line
                v-for="(tick, index) in xAxisTicks"
                :key="`v-grid-${index}`"
                :x1="getXPosition(tick)"
                :y1="chartDimensions.margin.top"
                :x2="getXPosition(tick)"
                :y2="chartDimensions.height - chartDimensions.margin.bottom"
                stroke="rgba(0,0,0,0.1)"
                stroke-width="1"
              />
            </g>

            <!-- Chart Lines -->
            <g class="lines">
              <path
                v-for="(line, programId) in chartLines"
                :key="`line-${programId}`"
                :d="line.path"
                :stroke="line.color"
                stroke-width="3"
                fill="none"
                class="chart-line"
              />
            </g>

            <!-- Data Points -->
            <g class="points">
              <circle
                v-for="(point, index) in chartPoints"
                :key="`point-${index}`"
                :cx="point.x"
                :cy="point.y"
                :r="4"
                :fill="point.color"
                :stroke="point.color"
                stroke-width="2"
                class="chart-point"
                @mouseover="showTooltip($event, point)"
                @mouseleave="hideTooltip"
              />
            </g>

            <!-- Axes -->
            <g class="axes">
              <!-- X Axis -->
              <line
                :x1="chartDimensions.margin.left"
                :y1="chartDimensions.height - chartDimensions.margin.bottom"
                :x2="chartDimensions.width - chartDimensions.margin.right"
                :y2="chartDimensions.height - chartDimensions.margin.bottom"
                stroke="rgba(0,0,0,0.3)"
                stroke-width="2"
              />

              <!-- Y Axis -->
              <line
                :x1="chartDimensions.margin.left"
                :y1="chartDimensions.margin.top"
                :x2="chartDimensions.margin.left"
                :y2="chartDimensions.height - chartDimensions.margin.bottom"
                stroke="rgba(0,0,0,0.3)"
                stroke-width="2"
              />
            </g>

            <!-- Axis Labels -->
            <g class="axis-labels">
              <!-- Y Axis Labels -->
              <text
                v-for="(tick, index) in yAxisTicks"
                :key="`y-label-${index}`"
                :x="chartDimensions.margin.left - 10"
                :y="getYPosition(tick) + 4"
                text-anchor="end"
                class="axis-label"
              >
                {{ formatAxisValue(tick) }}
              </text>

              <!-- X Axis Labels -->
              <text
                v-for="(tick, index) in xAxisTicks"
                :key="`x-label-${index}`"
                :x="getXPosition(tick)"
                :y="chartDimensions.height - chartDimensions.margin.bottom + 20"
                text-anchor="middle"
                class="axis-label"
              >
                {{ formatDateLabel(tick) }}
              </text>
            </g>
          </svg>

          <!-- Tooltip -->
          <div
            v-if="tooltip.show"
            ref="tooltipEl"
            class="chart-tooltip"
            :style="{
              left: tooltip.x + 'px',
              top: tooltip.y + 'px',
            }"
          >
            <div class="tooltip-header">
              <strong>{{ tooltip.program }}</strong>
            </div>
            <div class="tooltip-content">
              <div>Data: {{ tooltip.date }}</div>
              <div>Valor: {{ tooltip.value }}</div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="chart-legend mt-4">
          <div class="d-flex flex-wrap ga-4 justify-center">
            <div
              v-for="program in selectedProgramsData"
              :key="program.id"
              class="legend-item d-flex align-center ga-2"
            >
              <div
                class="legend-color"
                :style="{ backgroundColor: getProgramColor(program.id) }"
              />
              <v-avatar size="16" rounded="lg">
                <v-img :src="program.logo_url" :alt="program.name" />
              </v-avatar>
              <span class="text-caption">{{ program.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, nextTick } from 'vue'
  import type { PromotionHistoryChartData } from '~/interfaces/promotions'
  import type { Program } from '~/interfaces/program'

  interface Props {
    chartData: PromotionHistoryChartData[]
    programs: Program[]
  }

  interface ChartPoint {
    x: number
    y: number
    color: string
    program: string
    date: string
    value: string
    originalValue: number
  }

  interface ChartLine {
    path: string
    color: string
  }

  interface Tooltip {
    show: boolean
    x: number
    y: number
    program: string
    date: string
    value: string
  }

  const props = defineProps<Props>()

  // State
  const selectedPrograms = ref<number[]>([])
  const dateRange = ref('all')
  const chartSvg = ref<SVGElement>()
  const tooltipEl = ref<HTMLElement>()
  const tooltip = ref<Tooltip>({
    show: false,
    x: 0,
    y: 0,
    program: '',
    date: '',
    value: '',
  })

  // Chart dimensions
  const chartDimensions = {
    width: 800,
    height: 400,
    margin: { top: 20, right: 20, bottom: 60, left: 60 },
  }

  // Computed
  const programOptions = computed(() => {
    return props.programs.sort((a, b) => a.name.localeCompare(b.name))
  })

  const selectedProgramsData = computed(() => {
    return props.programs.filter(p => selectedPrograms.value.includes(p.id))
  })

  const dateRangeOptions = [
    { title: 'Todos os períodos', value: 'all' },
    { title: 'Últimos 7 dias', value: '7d' },
    { title: 'Últimos 30 dias', value: '30d' },
    { title: 'Últimos 90 dias', value: '90d' },
    { title: 'Último ano', value: '1y' },
  ]

  const filteredChartData = computed(() => {
    let data = props.chartData

    // Filter by selected programs
    if (selectedPrograms.value.length > 0) {
      const selectedProgramNames = selectedProgramsData.value.map(p => p.name)
      data = data.filter(item => selectedProgramNames.includes(item.program))
    }

    // Filter by date range
    if (dateRange.value !== 'all') {
      const now = new Date()
      const cutoffDate = new Date()

      switch (dateRange.value) {
        case '7d':
          cutoffDate.setDate(now.getDate() - 7)
          break
        case '30d':
          cutoffDate.setDate(now.getDate() - 30)
          break
        case '90d':
          cutoffDate.setDate(now.getDate() - 90)
          break
        case '1y':
          cutoffDate.setFullYear(now.getFullYear() - 1)
          break
      }

      data = data.filter(item => new Date(item.date) >= cutoffDate)
    }

    return data.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  })

  const xScale = computed(() => {
    const dates = filteredChartData.value.map(d => new Date(d.date).getTime())
    const minDate = Math.min(...dates)
    const maxDate = Math.max(...dates)

    return {
      min: minDate,
      max: maxDate,
      range: maxDate - minDate,
    }
  })

  const yScale = computed(() => {
    const values = filteredChartData.value.map(d => d.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const padding = (maxValue - minValue) * 0.1

    return {
      min: Math.max(0, minValue - padding),
      max: maxValue + padding,
      range: maxValue + padding - Math.max(0, minValue - padding),
    }
  })

  const xAxisTicks = computed(() => {
    const dates = filteredChartData.value.map(d => new Date(d.date).getTime())
    const uniqueDates = [...new Set(dates)].sort((a, b) => a - b)

    // Show max 6 ticks
    const step = Math.ceil(uniqueDates.length / 6)
    return uniqueDates.filter((_, index) => index % step === 0)
  })

  const yAxisTicks = computed(() => {
    const ticks = []
    const step = yScale.value.range / 5

    for (let i = 0; i <= 5; i++) {
      ticks.push(yScale.value.min + step * i)
    }

    return ticks
  })

  const chartLines = computed(() => {
    const lines: Record<string, ChartLine> = {}

    // Group data by program
    const programData: Record<string, PromotionHistoryChartData[]> = {}

    filteredChartData.value.forEach(item => {
      if (!programData[item.program]) {
        programData[item.program] = []
      }
      programData[item.program].push(item)
    })

    // Create line paths
    Object.entries(programData).forEach(([program, data]) => {
      const sortedData = data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )

      const pathData = sortedData
        .map((item, index) => {
          const x = getXPosition(new Date(item.date).getTime())
          const y = getYPosition(item.value)
          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
        })
        .join(' ')

      const programObj = props.programs.find(p => p.name === program)
      const color = programObj ? getProgramColor(programObj.id) : '#000000'

      lines[program] = {
        path: pathData,
        color,
      }
    })

    return lines
  })

  const chartPoints = computed(() => {
    return filteredChartData.value.map(item => {
      const programObj = props.programs.find(p => p.name === item.program)
      const color = programObj ? getProgramColor(programObj.id) : '#000000'

      return {
        x: getXPosition(new Date(item.date).getTime()),
        y: getYPosition(item.value),
        color,
        program: item.program,
        date: formatDateLabel(new Date(item.date).getTime()),
        value: formatAxisValue(item.value),
        originalValue: item.value,
      }
    })
  })

  // Methods
  const getProgramColor = (programId: number): string => {
    const colors = [
      '#1976D2',
      '#388E3C',
      '#F57C00',
      '#7B1FA2',
      '#D32F2F',
      '#00796B',
    ]
    const index = props.programs.findIndex(p => p.id === programId)
    return colors[index % colors.length]
  }

  const getXPosition = (timestamp: number): number => {
    const { margin, width } = chartDimensions
    const chartWidth = width - margin.left - margin.right
    const ratio = (timestamp - xScale.value.min) / xScale.value.range
    return margin.left + ratio * chartWidth
  }

  const getYPosition = (value: number): number => {
    const { margin, height } = chartDimensions
    const chartHeight = height - margin.top - margin.bottom
    const ratio = (value - yScale.value.min) / yScale.value.range
    return height - margin.bottom - ratio * chartHeight
  }

  const formatAxisValue = (value: number): string => {
    return `${value.toFixed(1)}%`
  }

  const formatDateLabel = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    })
  }

  const showTooltip = (event: MouseEvent, point: ChartPoint): void => {
    tooltip.value = {
      show: true,
      x: event.offsetX + 10,
      y: event.offsetY - 10,
      program: point.program,
      date: point.date,
      value: point.value,
    }
  }

  const hideTooltip = (): void => {
    tooltip.value.show = false
  }

  // Initialize with all programs selected
  selectedPrograms.value = props.programs.map(p => p.id)
</script>

<style scoped>
  .promotion-chart {
    width: 100%;
  }

  .chart-container {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 12px;
    padding: 24px;
  }

  .v-theme--dark .chart-container {
    background: rgba(255, 255, 255, 0.05);
  }

  .chart-wrapper {
    position: relative;
  }

  .svg-chart-container {
    position: relative;
    overflow: visible;
  }

  .line-chart {
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .v-theme--dark .line-chart {
    background: rgba(255, 255, 255, 0.05);
  }

  .chart-line {
    transition: stroke-width 0.3s ease;
  }

  .chart-line:hover {
    stroke-width: 4;
  }

  .chart-point {
    cursor: pointer;
    transition: r 0.3s ease;
  }

  .chart-point:hover {
    r: 6;
  }

  .axis-label {
    font-size: 12px;
    fill: rgba(0, 0, 0, 0.6);
  }

  .v-theme--dark .axis-label {
    fill: rgba(255, 255, 255, 0.7);
  }

  .chart-tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    pointer-events: none;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .tooltip-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 4px;
    margin-bottom: 4px;
  }

  .chart-legend {
    padding: 16px;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 8px;
  }

  .v-theme--dark .chart-legend {
    background: rgba(255, 255, 255, 0.05);
  }

  .legend-item {
    padding: 4px 8px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.8);
  }

  .v-theme--dark .legend-item {
    background: rgba(255, 255, 255, 0.1);
  }

  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }
</style>
