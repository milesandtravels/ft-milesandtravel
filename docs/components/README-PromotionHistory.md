# Design Doc: Sistema de Histórico de Promoções

## Metadata

- **Autor**: Equipe de Desenvolvimento
- **Data**: 2024
- **Status**: Implementado
- **Versão**: 1.0
- **Revisores**: Tech Lead, Product Owner

## Overview

Este documento descreve o design e implementação do sistema de histórico de promoções para a plataforma Miles & Travel. O sistema permite visualização e análise temporal de dados de promoções de e-commerces através de múltiplas interfaces especializadas.

## Goals

### Primary Goals

- Fornecer visualização clara e intuitiva do histórico de promoções
- Permitir análise temporal de dados através de múltiplas perspectivas
- Garantir experiência responsiva em dispositivos móveis e desktop
- Integrar seamlessly com a API existente usando Sanctum authentication

### Secondary Goals

- Otimizar performance para grandes volumes de dados
- Implementar padrões de acessibilidade (WCAG 2.1)
- Facilitar manutenção e extensibilidade do código

## Non-Goals

- Edição ou criação de novos registros de histórico
- Integração com sistemas externos de analytics
- Funcionalidades de relatórios avançados (fora do escopo atual)
- Sincronização em tempo real de dados

## Background

A necessidade surgiu da demanda dos usuários por uma forma visual de acompanhar a evolução das promoções ao longo do tempo. Anteriormente, os dados eram apresentados apenas em formato tabular, limitando a capacidade de análise temporal.

## Architecture Overview

### Component Hierarchy

```
PromotionHistoryModal (Root)
├── PromotionHistoryTimeline
├── PromotionHistoryChart
├── PromotionHistoryCalendar
└── PromotionHistoryComparison
```

### Data Flow

```
API (Sanctum) → PromotionHistoryModal → Child Components
```

## Detailed Design

### Core Components

#### 1. PromotionHistoryModal.vue

**Responsabilidade**: Orquestração central e gerenciamento de estado

- Controla abertura/fechamento do modal
- Gerencia chamadas à API
- Coordena navegação entre abas
- Implementa responsividade mobile-first

#### 2. PromotionHistoryTimeline.vue

**Responsabilidade**: Visualização cronológica

- Exibe eventos em ordem temporal
- Formatação de datas em português brasileiro
- Sistema de cores por programa
- Suporte a scroll virtual para performance

#### 3. PromotionHistoryChart.vue

**Responsabilidade**: Análise gráfica interativa

- Integração com Chart.js
- Múltiplos tipos de gráfico (linha, área)
- Filtros dinâmicos por programa
- Exportação de dados

#### 4. PromotionHistoryCalendar.vue

**Responsabilidade**: Interface de calendário

- Integração com FullCalendar
- Navegação temporal intuitiva
- Eventos clicáveis com detalhes
- Estatísticas mensais

#### 5. PromotionHistoryComparison.vue

**Responsabilidade**: Análise comparativa

- Comparação multi-programa
- Métricas calculadas (média, tendência)
- Filtros temporais
- Indicadores visuais de performance

### API Design

#### Endpoint

```typescript
GET / api / promotion - histories / { ecommerce_id }
```

#### Response Format

```typescript
interface PromotionHistoryResponse {
  [programId: string]: PromotionHistory[]
}

interface PromotionHistory {
  id: number
  current_value: string
  created_at: string
  program: Program
}

interface Program {
  id: number
  name: string
  description?: string
}
```

### Data Models

#### Core Interfaces

```typescript
// Dados transformados para gráfico
interface PromotionHistoryChartData {
  date: string
  value: number
  program: string
  programColor: string
}

// Evento de calendário
interface CalendarEvent {
  id: string
  title: string
  start: string
  color: string
  value: number
  program: Program
  extendedProps: {
    promotionId: number
    formattedValue: string
    description?: string
  }
}

// Item de timeline
interface TimelineItem {
  id: number
  program: Program
  currentValue: string
  createdAt: Date
  formattedDate: string
  formattedTime: string
}
```

## Implementation Details

### State Management

#### Modal State

```typescript
const loading = ref(false)
const error = ref<string | null>(null)
const historyData = ref<PromotionHistoryResponse | null>(null)
const activeTab = ref('calendar')
const selectedProgram = ref<string | null>(null)
```

#### Computed Properties

- `programs`: Extrai programas únicos dos dados
- `chartData`: Transforma dados para Chart.js
- `defaultTab`: Define aba inicial baseada no dispositivo

### Mobile-First Approach

#### Responsive Breakpoints

- **Mobile (< 600px)**: Fullscreen modal, 2 abas (Calendar, Comparison)
- **Tablet (600px - 960px)**: Modal redimensionado, 3 abas
- **Desktop (> 960px)**: Modal completo, 4 abas (Timeline, Chart, Calendar, Comparison)

#### Mobile Optimizations

```typescript
// Detecção de dispositivo
const isMobile = computed(() => $vuetify.display.mobile)

// Configurações condicionais
const modalProps = computed(() => ({
  fullscreen: isMobile.value,
  maxWidth: isMobile.value ? '100%' : '1200px',
}))
```

## Componentes

### 1. PromotionHistoryModal.vue

**Propósito**: Componente principal que orquestra todo o sistema de histórico.

**Funcionalidades**:

- Modal responsivo com suporte a fullscreen em mobile
- Sistema de abas para navegação entre diferentes visualizações
- Integração com API `/api/promotion-histories/{ecommerce_id}`
- Estados de loading, erro e dados vazios
- Otimização mobile-first (remove abas timeline e gráfico em mobile)

**Props**:

```typescript
interface Props {
  modelValue: boolean // Controla abertura/fechamento do modal
  ecommerce: Ecommerce | null // Dados do e-commerce
}
```

**Eventos**:

- `update:modelValue`: Emitido quando modal é fechado

**Estados Internos**:

- `loading`: Estado de carregamento
- `error`: Mensagens de erro
- `historyData`: Dados do histórico da API
- `activeTab`: Aba ativa atual
- `selectedProgram`: Programa selecionado

**Responsividade**:

- Desktop: Todas as 4 abas disponíveis
- Mobile: Apenas abas "Calendário" e "Comparação"
- Fullscreen automático em dispositivos móveis

---

### 2. PromotionHistoryTimeline.vue

**Propósito**: Visualização cronológica dos eventos de histórico.

**Funcionalidades**:

- Timeline vertical com eventos ordenados por data
- Filtros por programa de fidelidade
- Indicadores visuais de tipo de evento
- Formatação de datas e valores
- Design responsivo com cards compactos

**Props**:

```typescript
interface Props {
  historyData: PromotionHistoryResponse // Dados do histórico
  ecommerce: Ecommerce // Dados do e-commerce
}
```

**Características**:

- Agrupa eventos por programa
- Exibe mudanças de valor com indicadores visuais
- Suporte a múltiplos programas simultaneamente
- Interface otimizada para scroll vertical

---

### 3. PromotionHistoryChart.vue

**Propósito**: Visualização gráfica de tendências de valores ao longo do tempo.

**Funcionalidades**:

- Gráfico de linhas SVG customizado
- Seleção de período (7, 30, 90 dias, todos)
- Múltiplas séries para diferentes programas
- Tooltips interativos
- Cores distintas por programa

**Props**:

```typescript
interface Props {
  chartData: PromotionHistoryChartData[] // Dados formatados para gráfico
  programs: Program[] // Lista de programas
}
```

**Estrutura de Dados**:

```typescript
interface PromotionHistoryChartData {
  date: string // Data no formato YYYY-MM-DD
  value: number // Valor da promoção
  program: string // Nome do programa
  programColor: string // Cor do programa no gráfico
}
```

**Características**:

- Renderização SVG para performance
- Escala automática de eixos
- Interpolação suave entre pontos
- Responsivo com ajuste de dimensões

---

### 4. PromotionHistoryCalendar.vue

**Propósito**: Visualização mensal com eventos destacados por data.

**Funcionalidades**:

- Calendário mensal navegável
- Indicadores visuais de eventos por data
- Seleção de programa para filtrar eventos
- Navegação entre meses
- Detalhes de eventos ao clicar nas datas

**Props**:

```typescript
interface Props {
  historyData: PromotionHistoryResponse // Dados do histórico
  selectedProgram: string | null // Programa selecionado
}
```

**Eventos**:

- `update:selected-program`: Emitido quando programa é alterado

**Características**:

- Grid de calendário responsivo
- Indicadores de densidade de eventos
- Suporte a múltiplos eventos por data
- Interface intuitiva de navegação temporal

---

### 5. PromotionHistoryComparison.vue

**Propósito**: Análise comparativa entre diferentes programas de fidelidade.

**Funcionalidades**:

- Estatísticas agregadas por programa
- Gráfico de comparação de valores
- Tabela detalhada de comparação
- Seleção de período para análise
- Métricas de performance

**Props**:

```typescript
interface Props {
  historyData: PromotionHistoryResponse // Dados do histórico
  programs: Program[] // Lista de programas
  ecommerce: Ecommerce // Dados do e-commerce
}
```

**Métricas Calculadas**:

- Valor médio por programa
- Número total de eventos
- Variação percentual
- Tendência de crescimento
- Comparação de performance

**Características**:

- Visualização side-by-side
- Gráficos comparativos
- Tabelas ordenáveis
- Exportação de dados

## Integração com API

### Endpoint

```
GET /api/promotion-histories/{ecommerce_id}
```

### Resposta Esperada

```typescript
interface PromotionHistoryResponse {
  [programId: string]: PromotionHistory[]
}

interface PromotionHistory {
  id: number
  ecommerce_id: number
  program_id: number
  current_value: string
  previous_value: string | null
  created_at: string
  updated_at: string
  program: Program
}
```

## Padrões de Design

### Mobile-First

- Componentes otimizados para telas pequenas
- Navegação simplificada em mobile
- Fullscreen modal em dispositivos móveis
- Remoção de funcionalidades complexas em mobile

### Performance

- Lazy loading de componentes
- Renderização condicional baseada em dados
- SVG para gráficos (menor overhead)
- Computed properties para cálculos pesados

### Acessibilidade

- Navegação por teclado
- Indicadores visuais claros
- Contraste adequado
- Labels descritivos

## Uso

### Integração Básica

```vue
<template>
  <PromotionsCard :promotion="promotion" @view-history="openHistoryModal" />

  <PromotionHistoryModal
    v-model="showHistoryModal"
    :ecommerce="selectedEcommerce"
  />
</template>

<script setup>
  const showHistoryModal = ref(false)
  const selectedEcommerce = ref(null)

  const openHistoryModal = ecommerce => {
    selectedEcommerce.value = ecommerce
    showHistoryModal.value = true
  }
</script>
```

### Customização

Os componentes podem ser customizados através de:

- Props para dados específicos
- Slots para conteúdo personalizado
- CSS classes para estilização
- Eventos para integração com lógica externa

## Dependências

- **Vuetify**: Componentes de UI
- **Vue 3**: Framework base
- **TypeScript**: Tipagem estática
- **Nuxt 3**: Framework full-stack
- **useSanctumFetch**: Autenticação e requisições

### Performance Considerations

#### Data Processing

- **Computed Properties**: Uso extensivo para evitar recálculos desnecessários
- **Virtual Scrolling**: Implementado na timeline para grandes datasets
- **Lazy Loading**: Componentes carregados sob demanda
- **Debouncing**: Filtros com delay para reduzir chamadas

#### Memory Management

```typescript
// Reset automático de estado ao fechar modal
const closeModal = () => {
  setTimeout(() => {
    historyData.value = null
    error.value = null
    selectedProgram.value = null
  }, 300) // Delay para animação
}
```

#### Bundle Optimization

- Chart.js: Importação seletiva de componentes
- FullCalendar: Plugins carregados condicionalmente
- Tree-shaking: Eliminação de código não utilizado

### Security

#### Authentication

- **Sanctum Integration**: Autenticação via cookies seguros
- **CSRF Protection**: Tokens automáticos em requisições
- **API Validation**: Validação server-side de parâmetros

#### Data Sanitization

```typescript
// Sanitização de dados da API
const sanitizeHistoryData = (data: any): PromotionHistoryResponse => {
  // Validação e limpeza de dados
  return cleanData
}
```

### Accessibility

#### WCAG 2.1 Compliance

- **Keyboard Navigation**: Suporte completo a navegação por teclado
- **Screen Readers**: ARIA labels e descriptions
- **Color Contrast**: Ratios mínimos respeitados
- **Focus Management**: Indicadores visuais claros

#### Implementation

```vue
<div
  role="application"
  aria-label="Sistema de histórico de promoções"
  :aria-describedby="descriptionId"
>
  <!-- Conteúdo acessível -->
</div>
```

## Testing Strategy

### Unit Tests

- **Computed Properties**: Validação de transformações de dados
- **Methods**: Testes de formatação e cálculos
- **State Management**: Verificação de mudanças de estado

### Integration Tests

- **API Integration**: Mocks de chamadas Sanctum
- **Component Communication**: Props e eventos
- **Responsive Behavior**: Testes em diferentes viewports

### E2E Tests

- **User Flows**: Abertura de modal, navegação entre abas
- **Data Loading**: Estados de loading, erro e sucesso
- **Mobile Experience**: Funcionalidades específicas mobile

## Alternatives Considered

### Chart Libraries

- **Chart.js** ✅ Escolhido: Flexível, bem documentado, Vue 3 compatible
- **D3.js** ❌ Rejeitado: Curva de aprendizado alta, bundle size
- **ApexCharts** ❌ Rejeitado: Menos customizável

### Calendar Libraries

- **FullCalendar** ✅ Escolhido: Rico em features, Vue 3 support
- **Vue Calendar** ❌ Rejeitado: Funcionalidades limitadas
- **Custom Implementation** ❌ Rejeitado: Tempo de desenvolvimento

### State Management

- **Composition API** ✅ Escolhido: Nativo Vue 3, type-safe
- **Pinia** ❌ Rejeitado: Overhead desnecessário para escopo local
- **Vuex** ❌ Rejeitado: Deprecated em favor do Pinia

## Future Work

### Short Term (1-2 sprints)

- [ ] Implementar testes unitários completos
- [ ] Adicionar loading skeletons
- [ ] Otimizar bundle size
- [ ] Melhorar acessibilidade

### Medium Term (3-6 sprints)

- [ ] Adicionar filtros avançados
- [ ] Implementar exportação PDF
- [ ] Cache inteligente de dados
- [ ] Notificações push para mudanças

### Long Term (6+ sprints)

- [ ] Análise preditiva com ML
- [ ] Integração com Google Analytics
- [ ] Dashboard executivo
- [ ] API GraphQL

## Monitoring & Metrics

### Performance Metrics

- **Time to Interactive**: < 3s em 3G
- **Bundle Size**: < 500KB gzipped
- **Memory Usage**: < 50MB peak
- **API Response Time**: < 500ms p95

### User Metrics

- **Modal Open Rate**: % de usuários que abrem o modal
- **Tab Usage**: Distribuição de uso entre abas
- **Mobile vs Desktop**: Padrões de uso por dispositivo
- **Error Rate**: < 1% de falhas na API

## Conclusion

O sistema de histórico de promoções fornece uma solução robusta e escalável para visualização de dados temporais. A arquitetura modular permite fácil manutenção e extensão, enquanto o design mobile-first garante uma experiência consistente em todos os dispositivos.

A implementação segue as melhores práticas de Vue 3, TypeScript e Vuetify, resultando em código type-safe, performático e acessível.
