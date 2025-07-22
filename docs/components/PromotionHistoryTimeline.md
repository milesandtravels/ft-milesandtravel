# PromotionHistoryTimeline.vue

## Descrição

Componente que exibe o histórico de promoções em formato de timeline cronológica. Apresenta os dados de forma visual e organizada, mostrando a evolução das promoções ao longo do tempo com informações detalhadas de cada entrada.

## Props

```typescript
interface Props {
  historyData: PromotionHistoryResponse | null // Dados do histórico de promoções
  ecommerce: Ecommerce | null // Dados do e-commerce
}
```

## Funcionalidades Principais

### 1. Timeline Cronológica

- Exibição em ordem cronológica (mais recente primeiro)
- Agrupamento por programa de fidelidade
- Indicadores visuais para cada entrada
- Formatação de datas em português brasileiro

### 2. Informações Detalhadas

- Nome do programa de fidelidade
- Valor atual da promoção
- Data e hora da atualização
- Status visual com cores diferenciadas

### 3. Design Responsivo

- Layout adaptável para diferentes tamanhos de tela
- Espaçamento otimizado para mobile
- Tipografia escalável

## Computed Properties

### `timelineItems`

Transforma os dados de histórico em itens de timeline ordenados:

```typescript
const timelineItems = computed(() => {
  if (!props.historyData) return []

  const items: TimelineItem[] = []

  Object.entries(props.historyData).forEach(([programId, histories]) => {
    histories.forEach(history => {
      items.push({
        id: history.id,
        program: history.program,
        currentValue: history.current_value,
        createdAt: new Date(history.created_at),
        formattedDate: formatDate(history.created_at),
        formattedTime: formatTime(history.created_at),
      })
    })
  })

  // Ordena por data (mais recente primeiro)
  return items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
})
```

## Interfaces TypeScript

### `TimelineItem`

```typescript
interface TimelineItem {
  id: number
  program: Program
  currentValue: string
  createdAt: Date
  formattedDate: string
  formattedTime: string
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

## Métodos Utilitários

### `formatDate(dateString: string)`

Formata data para exibição em português:

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

### `formatTime(dateString: string)`

Formata horário para exibição:

```typescript
const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
```

### `formatCurrency(value: string)`

Formata valores monetários:

```typescript
const formatCurrency = (value: string): string => {
  const numValue = parseFloat(value)
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numValue)
}
```

## Estados de Interface

### Dados Vazios

```vue
<div v-if="timelineItems.length === 0" class="text-center py-8">
  <v-icon size="64" color="grey-lighten-1">mdi-timeline-outline</v-icon>
  <p class="text-h6 mt-4 text-grey-darken-1">
    Nenhum histórico encontrado
  </p>
  <p class="text-body-2 text-grey">
    Não há registros de promoções para este e-commerce
  </p>
</div>
```

### Timeline com Dados

```vue
<v-timeline v-else align="start" side="end">
  <v-timeline-item
    v-for="item in timelineItems"
    :key="item.id"
    :dot-color="getProgramColor(item.program.id)"
    size="small"
  >
    <!-- Conteúdo do item -->
  </v-timeline-item>
</v-timeline>
```

## Sistema de Cores

### `getProgramColor(programId: number)`

Atribui cores únicas para cada programa:

```typescript
const getProgramColor = (programId: number): string => {
  const colors = [
    'primary',
    'success',
    'warning',
    'error',
    'info',
    'purple',
    'teal',
    'orange',
  ]
  return colors[programId % colors.length]
}
```

## Layout da Timeline

### Estrutura do Item

```vue
<v-timeline-item>
  <template #opposite>
    <div class="text-caption text-grey">
      {{ item.formattedTime }}
    </div>
  </template>
  
  <v-card class="elevation-2">
    <v-card-title class="text-h6">
      {{ item.program.name }}
    </v-card-title>
    
    <v-card-subtitle>
      {{ item.formattedDate }}
    </v-card-subtitle>
    
    <v-card-text>
      <div class="d-flex align-center">
        <v-icon color="success" class="me-2">mdi-currency-usd</v-icon>
        <span class="text-h6 text-success">
          {{ formatCurrency(item.currentValue) }}
        </span>
      </div>
    </v-card-text>
  </v-card>
</v-timeline-item>
```

## Estilização

### Classes CSS Customizadas

```css
.promotion-timeline {
  max-height: 600px;
  overflow-y: auto;
}

.timeline-item-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.timeline-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.timeline-date {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
}

.timeline-value {
  font-weight: 600;
  font-size: 1.1rem;
}
```

## Responsividade

### Breakpoints

- **Mobile (< 600px)**: Timeline compacta, cards menores
- **Tablet (600px - 960px)**: Layout intermediário
- **Desktop (> 960px)**: Layout completo com espaçamento amplo

### Adaptações Mobile

```vue
<v-timeline
  :density="$vuetify.display.mobile ? 'compact' : 'default'"
  :line-thickness="$vuetify.display.mobile ? 2 : 3"
></v-timeline>
```

## Performance

### Otimizações

- Computed property para transformação de dados
- Virtual scrolling para listas grandes
- Lazy loading de imagens (se aplicável)
- Memoização de formatações de data/hora

### Considerações

- Limite de itens exibidos (paginação futura)
- Debounce em filtros (se implementados)
- Cache de cores de programas

## Acessibilidade

### ARIA Labels

```vue
<v-timeline
  role="list"
  aria-label="Histórico de promoções em timeline"
></v-timeline>
```

### Navegação por Teclado

- Suporte a Tab navigation
- Focus indicators visíveis
- Shortcuts para navegação rápida

## Estados de Loading

### Skeleton Loading

```vue
<div v-if="loading" class="pa-4">
  <v-skeleton-loader
    v-for="n in 5"
    :key="n"
    type="card"
    class="mb-4"
  />
</div>
```

## Integração com Parent

### Recebimento de Props

```vue
<!-- No PromotionHistoryModal -->
<PromotionHistoryTimeline :history-data="historyData" :ecommerce="ecommerce" />
```

### Eventos (Futuros)

```typescript
// Possíveis eventos para implementação futura
const emit = defineEmits<{
  'item-click': [item: TimelineItem]
  'program-filter': [programId: number]
  'date-range-change': [startDate: Date, endDate: Date]
}>()
```

## Exemplo de Uso

```vue
<template>
  <div class="promotion-timeline-container">
    <PromotionHistoryTimeline
      :history-data="historyData"
      :ecommerce="ecommerce"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import type { PromotionHistoryResponse, Ecommerce } from '~/types'

  const historyData = ref<PromotionHistoryResponse | null>(null)
  const ecommerce = ref<Ecommerce | null>(null)

  // Dados seriam carregados via API
</script>
```

## Melhorias Futuras

### Funcionalidades Planejadas

- Filtros por programa
- Filtros por período
- Busca textual
- Exportação de dados
- Comparação entre períodos
- Notificações de mudanças

### Performance

- Virtual scrolling para grandes datasets
- Lazy loading de dados antigos
- Cache inteligente
- Otimização de re-renders
