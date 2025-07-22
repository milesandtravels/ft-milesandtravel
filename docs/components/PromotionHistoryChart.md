# PromotionHistoryChart.vue

## Descrição

Componente que exibe o histórico de promoções em formato de gráfico de linhas interativo. Utiliza Chart.js para criar visualizações dinâmicas que permitem análise temporal dos valores de promoções por programa de fidelidade.

## Props

```typescript
interface Props {
  chartData: PromotionHistoryChartData[] // Dados formatados para o gráfico
  programs: Program[] // Lista de programas disponíveis
}
```

## Interfaces TypeScript

### `PromotionHistoryChartData`

```typescript
interface PromotionHistoryChartData {
  date: string // Data no formato YYYY-MM-DD
  value: number // Valor da promoção
  program: string // Nome do programa
  programColor: string // Cor associada ao programa
}
```

### `Program`

```typescript
interface Program {
  id: number
  name: string
  description?: string
}
```

### `ChartDataset`

```typescript
interface ChartDataset {
  label: string
  data: number[]
  borderColor: string
  backgroundColor: string
  tension: number
  fill: boolean
  pointRadius: number
  pointHoverRadius: number
}
```

## Dependências

### Chart.js

```typescript
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'vue-chartjs'

// Registro dos componentes necessários
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)
```

## Estado Reativo

```typescript
const selectedPrograms = ref<string[]>([]) // Programas selecionados para exibição
const chartRef = ref<any>(null) // Referência ao componente Chart.js
const showLegend = ref(true) // Controle de exibição da legenda
const chartType = ref<'line' | 'area'>('line') // Tipo de gráfico
```

## Computed Properties

### `chartLabels`

Extrai e ordena as datas únicas dos dados:

```typescript
const chartLabels = computed(() => {
  const dates = [...new Set(props.chartData.map(item => item.date))]
  return dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
})
```

### `chartDatasets`

Transforma os dados em datasets do Chart.js:

```typescript
const chartDatasets = computed(() => {
  const datasets: ChartDataset[] = []

  // Agrupa dados por programa
  const programsData = new Map<string, PromotionHistoryChartData[]>()

  props.chartData.forEach(item => {
    if (!programsData.has(item.program)) {
      programsData.set(item.program, [])
    }
    programsData.get(item.program)!.push(item)
  })

  // Cria dataset para cada programa
  programsData.forEach((data, programName) => {
    if (
      selectedPrograms.value.length === 0 ||
      selectedPrograms.value.includes(programName)
    ) {
      const programColor = data[0]?.programColor || '#1976D2'

      // Mapeia valores para cada data
      const values = chartLabels.value.map(date => {
        const item = data.find(d => d.date === date)
        return item ? item.value : null
      })

      datasets.push({
        label: programName,
        data: values,
        borderColor: programColor,
        backgroundColor:
          chartType.value === 'area' ? `${programColor}20` : programColor,
        tension: 0.4,
        fill: chartType.value === 'area',
        pointRadius: 4,
        pointHoverRadius: 6,
        spanGaps: true, // Conecta pontos mesmo com dados faltantes
      })
    }
  })

  return datasets
})
```

### `chartOptions`

Configurações do gráfico:

```typescript
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    title: {
      display: true,
      text: 'Evolução dos Valores de Promoções',
      font: {
        size: 16,
        weight: 'bold',
      },
    },
    legend: {
      display: showLegend.value,
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#ddd',
      borderWidth: 1,
      callbacks: {
        label: (context: any) => {
          const value = context.parsed.y
          return `${context.dataset.label}: ${formatCurrency(value)}`
        },
        title: (tooltipItems: any[]) => {
          const date = tooltipItems[0]?.label
          return formatDate(date)
        },
      },
    },
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Data',
      },
      ticks: {
        callback: function (value: any, index: number) {
          const date = chartLabels.value[index]
          return formatDateShort(date)
        },
        maxTicksLimit: 10,
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Valor (R$)',
      },
      ticks: {
        callback: function (value: any) {
          return formatCurrency(value)
        },
      },
      beginAtZero: true,
    },
  },
  elements: {
    point: {
      hoverBackgroundColor: '#fff',
      hoverBorderWidth: 2,
    },
  },
}))
```

### `filteredPrograms`

Lista de programas disponíveis para filtro:

```typescript
const filteredPrograms = computed(() => {
  return props.programs.map(program => ({
    ...program,
    color: getProgramColor(program.name),
    isSelected: selectedPrograms.value.includes(program.name),
  }))
})
```

## Métodos

### `formatCurrency(value: number)`

Formata valores monetários:

```typescript
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
}
```

### `formatDate(dateString: string)`

Formata data completa:

```typescript
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
```

### `formatDateShort(dateString: string)`

Formata data abreviada para eixo X:

```typescript
const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })
}
```

### `getProgramColor(programName: string)`

Retorna cor associada ao programa:

```typescript
const getProgramColor = (programName: string): string => {
  const item = props.chartData.find(d => d.program === programName)
  return item?.programColor || '#1976D2'
}
```

### `toggleProgram(programName: string)`

Alterna seleção de programa:

```typescript
const toggleProgram = (programName: string): void => {
  const index = selectedPrograms.value.indexOf(programName)
  if (index > -1) {
    selectedPrograms.value.splice(index, 1)
  } else {
    selectedPrograms.value.push(programName)
  }
}
```

### `selectAllPrograms()`

Seleciona todos os programas:

```typescript
const selectAllPrograms = (): void => {
  selectedPrograms.value = props.programs.map(p => p.name)
}
```

### `clearSelection()`

Limpa seleção de programas:

```typescript
const clearSelection = (): void => {
  selectedPrograms.value = []
}
```

### `exportChart()`

Exporta gráfico como imagem:

```typescript
const exportChart = (): void => {
  if (chartRef.value?.chart) {
    const url = chartRef.value.chart.toBase64Image()
    const link = document.createElement('a')
    link.download = 'historico-promocoes.png'
    link.href = url
    link.click()
  }
}
```

## Layout do Componente

### Controles Superiores

```vue
<v-card class="promotion-chart-container">
  <!-- Header com controles -->
  <v-card-title class="d-flex justify-space-between align-center">
    <span>Gráfico de Evolução</span>
    
    <div class="d-flex gap-2">
      <!-- Toggle tipo de gráfico -->
      <v-btn-toggle v-model="chartType" mandatory>
        <v-btn value="line" size="small">
          <v-icon>mdi-chart-line</v-icon>
        </v-btn>
        <v-btn value="area" size="small">
          <v-icon>mdi-chart-areaspline</v-icon>
        </v-btn>
      </v-btn-toggle>
      
      <!-- Botão de exportar -->
      <v-btn 
        @click="exportChart" 
        size="small" 
        variant="outlined"
      >
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </div>
  </v-card-title>
  
  <!-- Filtros de programas -->
  <v-card-subtitle>
    <div class="d-flex flex-wrap gap-2 mb-4">
      <v-chip
        v-for="program in filteredPrograms"
        :key="program.id"
        :color="program.color"
        :variant="program.isSelected ? 'flat' : 'outlined'"
        @click="toggleProgram(program.name)"
        clickable
      >
        {{ program.name }}
      </v-chip>
    </div>
    
    <div class="d-flex gap-2">
      <v-btn 
        @click="selectAllPrograms" 
        size="small" 
        variant="text"
      >
        Selecionar Todos
      </v-btn>
      <v-btn 
        @click="clearSelection" 
        size="small" 
        variant="text"
      >
        Limpar Seleção
      </v-btn>
    </div>
  </v-card-subtitle>
</v-card>
```

### Área do Gráfico

```vue
<v-card-text>
  <div class="chart-container" style="height: 400px;">
    <Line
      v-if="chartDatasets.length > 0"
      ref="chartRef"
      :data="{ labels: chartLabels, datasets: chartDatasets }"
      :options="chartOptions"
    />
    
    <!-- Estado vazio -->
    <div v-else class="d-flex flex-column align-center justify-center h-100">
      <v-icon size="64" color="grey-lighten-1">mdi-chart-line</v-icon>
      <p class="text-h6 mt-4 text-grey-darken-1">
        Nenhum programa selecionado
      </p>
      <p class="text-body-2 text-grey">
        Selecione pelo menos um programa para visualizar o gráfico
      </p>
    </div>
  </div>
</v-card-text>
```

## Estados de Interface

### Loading

```vue
<div
  v-if="loading"
  class="d-flex justify-center align-center"
  style="height: 400px;"
>
  <v-progress-circular indeterminate size="64" />
</div>
```

### Dados Vazios

```vue
<div v-if="chartData.length === 0" class="text-center py-8">
  <v-icon size="64" color="grey-lighten-1">mdi-chart-line-variant</v-icon>
  <p class="text-h6 mt-4 text-grey-darken-1">
    Nenhum dado disponível
  </p>
  <p class="text-body-2 text-grey">
    Não há dados suficientes para gerar o gráfico
  </p>
</div>
```

## Responsividade

### Adaptações Mobile

```typescript
const mobileOptions = computed(() => ({
  ...chartOptions.value,
  plugins: {
    ...chartOptions.value.plugins,
    legend: {
      ...chartOptions.value.plugins.legend,
      display: !$vuetify.display.mobile || showLegend.value,
      position: $vuetify.display.mobile ? 'bottom' : 'top',
    },
  },
  scales: {
    ...chartOptions.value.scales,
    x: {
      ...chartOptions.value.scales.x,
      ticks: {
        ...chartOptions.value.scales.x.ticks,
        maxTicksLimit: $vuetify.display.mobile ? 5 : 10,
      },
    },
  },
}))
```

## Performance

### Otimizações

- Computed properties para transformação de dados
- Debounce em filtros de programa
- Lazy loading do Chart.js
- Memoização de formatações

### Considerações

- Limite de pontos no gráfico para performance
- Agregação de dados para períodos longos
- Virtual scrolling em listas de filtros

## Acessibilidade

### ARIA Labels

```vue
<div
  role="img"
  aria-label="Gráfico de evolução dos valores de promoções"
  :aria-describedby="chartDescriptionId"
>
  <Line ... />
</div>

<div :id="chartDescriptionId" class="sr-only">
  Gráfico mostrando a evolução dos valores de {{ selectedPrograms.length }} programas
  ao longo de {{ chartLabels.length }} períodos
</div>
```

## Integração com Parent

```vue
<!-- No PromotionHistoryModal -->
<PromotionHistoryChart :chart-data="chartData" :programs="programs" />
```

## Exemplo de Uso

```vue
<template>
  <div class="chart-wrapper">
    <PromotionHistoryChart
      :chart-data="formattedChartData"
      :programs="availablePrograms"
    />
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import type { PromotionHistoryChartData, Program } from '~/types'

  const rawData = ref(/* dados da API */)

  const formattedChartData = computed((): PromotionHistoryChartData[] => {
    // Transformação dos dados para o formato do gráfico
    return rawData.value.map(item => ({
      date: item.date,
      value: parseFloat(item.value),
      program: item.program.name,
      programColor: item.color
    }))
  })

  const availablePrograms = computed((): Program[] => {
    // Extração de programas únicos
    return [...new Set(rawData.value.map(item => item.program))]
  })
</script>
```

## Melhorias Futuras

### Funcionalidades Planejadas

- Zoom e pan no gráfico
- Múltiplos tipos de gráfico (bar, pie, etc.)
- Comparação entre períodos
- Anotações no gráfico
- Exportação em múltiplos formatos
- Temas personalizáveis

### Performance

- WebGL rendering para grandes datasets
- Data streaming para dados em tempo real
- Caching inteligente de renderizações
