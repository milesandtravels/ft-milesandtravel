# PromotionHistoryModal.vue

## Descrição

Componente modal principal que orquestra todo o sistema de visualização de histórico de promoções. Funciona como um hub central que integra todos os outros componentes do sistema através de um sistema de abas responsivo.

## Props

```typescript
interface Props {
  modelValue: boolean        // Controla abertura/fechamento do modal
  ecommerce: Ecommerce | null // Dados do e-commerce para buscar histórico
}
```

## Eventos

- `update:modelValue`: Emitido quando o modal é fechado

## Funcionalidades Principais

### 1. Modal Responsivo
- **Desktop**: Modal com largura máxima de 1200px
- **Mobile**: Fullscreen automático para melhor experiência
- Scroll interno para conteúdo extenso

### 2. Sistema de Abas Adaptativo
- **Desktop**: 4 abas disponíveis (Timeline, Gráfico, Calendário, Comparação)
- **Mobile**: 2 abas otimizadas (Calendário, Comparação)
- Navegação fluida entre visualizações

### 3. Integração com API
- Endpoint: `GET /api/promotion-histories/{ecommerce_id}`
- Autenticação via `useSanctumFetch`
- Tratamento de estados de loading e erro

### 4. Gerenciamento de Estado
```typescript
const loading = ref(false)                              // Estado de carregamento
const error = ref<string | null>(null)                  // Mensagens de erro
const historyData = ref<PromotionHistoryResponse | null>(null) // Dados da API
const activeTab = ref('calendar')                       // Aba ativa (padrão: calendário)
const selectedProgram = ref<string | null>(null)        // Programa selecionado
```

## Estados de Interface

### Loading
- Spinner centralizado
- Mensagem "Carregando histórico..."
- Bloqueia interação durante carregamento

### Erro
- Ícone de alerta
- Mensagem de erro específica
- Botão "Tentar Novamente" para retry

### Dados Vazios
- Ícone de histórico
- Mensagem informativa
- Estado visual limpo

### Conteúdo
- Header com logo e nome do e-commerce
- Sistema de abas responsivo
- Conteúdo dinâmico baseado na aba ativa

## Computed Properties

### `isOpen`
Controla a visibilidade do modal com two-way binding:
```typescript
const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
```

### `defaultTab`
Define a aba padrão para melhor experiência mobile:
```typescript
const defaultTab = computed(() => {
  return 'calendar' // Sempre inicia com calendário
})
```

## Métodos

### `fetchHistory()`
Busca dados de histórico da API:
```typescript
const fetchHistory = async (): Promise<void> => {
  if (!props.ecommerce?.id) return
  
  loading.value = true
  error.value = null
  
  try {
    const { data } = await useSanctumFetch<PromotionHistoryResponse>(
      `/api/promotion-histories/${props.ecommerce.id}`,
      { method: 'GET' }
    )
    
    historyData.value = data.value
    
    // Define primeiro programa como selecionado por padrão
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
```

### `closeModal()`
Fecha modal e reseta estado:
```typescript
const closeModal = (): void => {
  isOpen.value = false
  
  // Reset de estado com delay para animação
  setTimeout(() => {
    historyData.value = null
    error.value = null
    activeTab.value = defaultTab.value
    selectedProgram.value = null
  }, 300)
}
```

## Responsividade Mobile

### Detecção de Dispositivo
Usa `$vuetify.display.mobile` para detectar dispositivos móveis

### Adaptações Mobile
- Fullscreen modal (`fullscreen="$vuetify.display.mobile"`)
- Largura 100% (`max-width="$vuetify.display.mobile ? '100%' : '1200px'"`)
- Altura total da tela (`h-screen` class)
- Abas reduzidas (apenas calendário e comparação)

### Abas Condicionais
```vue
<v-tab v-if="!$vuetify.display.mobile" value="timeline">
  <v-icon start>mdi-timeline</v-icon>
  Timeline
</v-tab>
<v-tab v-if="!$vuetify.display.mobile" value="chart">
  <v-icon start>mdi-chart-line</v-icon>
  Gráfico
</v-tab>
```

## Exemplo de Uso

```vue
<template>
  <div>
    <!-- Botão para abrir modal -->
    <v-btn @click="openModal">Ver Histórico</v-btn>
    
    <!-- Modal de histórico -->
    <PromotionHistoryModal
      v-model="showModal"
      :ecommerce="selectedEcommerce"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import type { Ecommerce } from '~/interfaces/ecommerces'

const showModal = ref(false)
const selectedEcommerce = ref<Ecommerce | null>(null)

const openModal = () => {
  selectedEcommerce.value = {
    id: 1,
    name: 'Loja Exemplo',
    logo_url: '/logo.png'
  }
  showModal.value = true
}
</script>
```