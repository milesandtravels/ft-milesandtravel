# EcommerceAutocomplete Component

Componente reutilizável para seleção de e-commerces/marketplaces com autocomplete, desenvolvido para o projeto Miles and Travel.

## Características

- ✅ **Autocomplete moderno** com busca e filtragem
- ✅ **Logos dos e-commerces** com fallback visual
- ✅ **Categorização** com chips coloridos
- ✅ **Estados de loading e erro** com retry automático
- ✅ **Tema escuro** suportado
- ✅ **Mobile-first** e responsivo
- ✅ **TypeScript** com tipagem completa
- ✅ **Performance otimizada** com lazy loading

## Uso Básico

```vue
<template>
  <EcommerceAutocomplete
    v-model="selectedEcommerce"
    @ecommerce-selected="handleEcommerceSelected"
  />
</template>

<script setup>
import EcommerceAutocomplete from './EcommerceAutocomplete.vue'

const selectedEcommerce = ref(null)

const handleEcommerceSelected = (ecommerce) => {
  console.log('E-commerce selecionado:', ecommerce)
}
</script>
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `modelValue` | `number \| null` | `null` | ID do e-commerce selecionado |
| `autoFetch` | `boolean` | `true` | Carrega automaticamente os e-commerces ao montar |

## Events

| Event | Payload | Descrição |
|-------|---------|----------|
| `update:modelValue` | `number \| null` | Emitido quando a seleção muda |
| `ecommerce-selected` | `Ecommerce \| null` | Emitido com os dados completos do e-commerce |

## Interface Ecommerce

```typescript
interface Ecommerce {
  id: number
  name: string
  logo_url: string
  category: string | null
}
```

## Métodos Expostos

| Método | Descrição |
|--------|----------|
| `fetchEcommerces()` | Recarrega a lista de e-commerces |
| `selectedEcommerce` | Ref reativo com o ID selecionado |
| `ecommerceOptions` | Ref reativo com a lista de e-commerces |

## Exemplos Avançados

### Controle Externo

```vue
<template>
  <div>
    <v-btn @click="setSpecificEcommerce">Selecionar Amazon</v-btn>
    <v-btn @click="clearSelection">Limpar</v-btn>
    
    <EcommerceAutocomplete
      v-model="selectedEcommerce"
      @ecommerce-selected="handleSelection"
      ref="autocompleteRef"
    />
  </div>
</template>

<script setup>
const selectedEcommerce = ref(null)
const autocompleteRef = ref()

const setSpecificEcommerce = () => {
  selectedEcommerce.value = 1 // ID da Amazon
}

const clearSelection = () => {
  selectedEcommerce.value = null
}

const handleSelection = (ecommerce) => {
  if (ecommerce) {
    console.log(`Selecionado: ${ecommerce.name}`)
  }
}
</script>
```

### Carregamento Manual

```vue
<template>
  <div>
    <v-btn 
      @click="loadEcommerces" 
      :loading="isLoading"
    >
      Carregar E-commerces
    </v-btn>
    
    <EcommerceAutocomplete
      v-model="selectedEcommerce"
      :auto-fetch="false"
      ref="manualRef"
    />
  </div>
</template>

<script setup>
const isLoading = ref(false)
const manualRef = ref()

const loadEcommerces = async () => {
  isLoading.value = true
  try {
    await manualRef.value?.fetchEcommerces()
  } finally {
    isLoading.value = false
  }
}
</script>
```

## Customização de Estilos

O componente utiliza classes CSS modulares que podem ser sobrescritas:

```css
/* Container da logo (lista) */
.ecommerce-logo-container {
  width: 48px;
  height: 32px;
  /* ... outros estilos */
}

/* Container da logo (seleção) */
.ecommerce-logo-container-small {
  width: 32px;
  height: 20px;
  /* ... outros estilos */
}

/* Fallback de erro */
.logo-error-small {
  background: #f5f5f5;
  /* ... outros estilos */
}
```

## Integração com API

O componente espera que a API `/api/ecommerces` retorne:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Amazon",
      "logo_url": "https://example.com/amazon-logo.png",
      "category": "Marketplace"
    }
  ]
}
```

## Dependências

- **Vuetify 3** - Componentes UI
- **useSanctumFetch** - Composable para requisições autenticadas
- **Vue 3** - Framework base

## Performance

- ⚡ **Lazy loading** - Carrega e-commerces apenas quando necessário
- 🎯 **Debounce** - Evita requisições excessivas
- 🖼️ **Image optimization** - Logos com fallback e object-fit
- 📱 **Mobile-first** - Otimizado para dispositivos móveis

## Acessibilidade

- ♿ **ARIA labels** - Suporte completo a leitores de tela
- ⌨️ **Navegação por teclado** - Totalmente acessível via teclado
- 🎨 **Alto contraste** - Suporte a temas escuros
- 📱 **Touch-friendly** - Otimizado para touch screens

## Exemplo Completo

Veja o arquivo `EcommerceAutocompleteExample.vue` para exemplos práticos de uso.