# MILES & TRAVEL - Prompt de Desenvolvimento

## PRODUTO - Miles & Travel

**Descrição**: Plataforma de comparação inteligente de ofertas de cashback, pontos e milhas entre e-commerces e programas de fidelidade. A aplicação permite aos usuários encontrar as melhores oportunidades para acumular benefícios em suas compras online.

**Principais Funcionalidades**:

- Comparação de ofertas entre diferentes e-commerces
- Integração com programas de pontos, milhas e cashback
- Sistema de busca avançada por produtos
- Alertas personalizados para promoções
- Histórico de promoções e análise de tendências
- Configuração personalizada de valores de mileiros
- Sistema de notificações push (OneSignal)
- Autenticação via Google OAuth

## STACK TÉCNICA

### Frontend

- **Framework**: Nuxt 3 (v3.17.5) - Vue 3 com SSR desabilitado (SPA mode)
- **UI Framework**: Vuetify 3 (v3.8.8) + Material Design Icons
- **State Management**: Pinia (v3.0.3)
- **Composables**: VueUse (@vueuse/nuxt v13.5.0)
- **TypeScript**: Totalmente tipado
- **Build**: Vite

### Autenticação & API

- **Autenticação**: Laravel Sanctum via nuxt-auth-sanctum (v0.6.7)
- **API**: Laravel (backend não visível no projeto frontend)
- **Modo de autenticação**: Token-based

### Ferramentas de Desenvolvimento

- **Code Formatting**: Prettier (v3.5.3)
- **Import Organization**: prettier-plugin-organize-imports (v4.1.0)
- **Linting**: ESLint configurado para Vue/TypeScript
- **Package Manager**: Yarn (v1.22.22)

### Integração Externa

- **Analytics**: Google Tag Manager/Analytics
- **Push Notifications**: OneSignal (v2.2.2)
- **OAuth**: Google Authentication

## ARQUITETURA E ESTRUTURA

### Estrutura de Pastas

```
/
├── components/          # Componentes Vue reutilizáveis
├── pages/              # Páginas da aplicação (auto-rota)
├── layouts/            # Layouts da aplicação
├── interfaces/         # Definições de tipos TypeScript
├── composables/        # Composables customizados
├── middleware/         # Middlewares Nuxt
├── store/             # Stores Pinia
├── utils/             # Utilitários e formatadores
├── plugins/           # Plugins Nuxt
├── constants/         # Constantes da aplicação
└── types/             # Definições de tipos globais
```

### Principais Interfaces de Dados

- **OfferItem**: Ofertas de produtos com cashback/pontos/milhas
- **Promotion**: Promoções ativas dos programas
- **Program**: Programas de fidelidade (cashback, pontos, milhas)
- **Ecommerce**: E-commerces parceiros
- **Product**: Produtos disponíveis para comparação

## REGRAS DE DESENVOLVIMENTO

### 1. PADRÕES DE CÓDIGO

#### Nomenclatura

- **Componentes**: PascalCase (`OfferCard.vue`, `TheHeader.vue`)
- **Páginas**: kebab-case (`search-products.vue`, `offers.vue`)
- **Interfaces**: PascalCase (`OfferItem`, `PromotionFilters`)
- **Composables**: camelCase com prefixo `use` (`useAuthGoogle`, `useGtag`)
- **Stores**: camelCase (`snackbar.ts`, `loading.ts`)

#### Estrutura de Componentes Vue

```vue
<template>
  <!-- Sempre usar Vuetify components quando possível -->
  <v-container>
    <v-card>
      <!-- UI components -->
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
  // 1. Imports
  import type { Interface } from '~/interfaces/...'

  // 2. Props/Emits
  interface Props {
    // Sempre tipar props
  }

  const props = defineProps<Props>()
  const emit = defineEmits<{...}>()

  // 3. Composables
  const route = useRoute()
  const router = useRouter()

  // 4. Reactive data
  const loading = ref(false)

  // 5. Computed
  const computed = computed(() => ...)

  // 6. Methods
  const handleAction = async () => {...}

  // 7. Lifecycle
  onMounted(() => {...})
</script>

<style scoped>
  /* Sempre usar scoped styles */
  /* Responsividade mobile-first */
  @media (max-width: 600px) {
    /* Mobile styles */
  }
</style>
```

### 2. REGRAS DE AUTENTICAÇÃO

- **Middleware**: Usar `sanctum:auth` para páginas protegidas
- **API Calls**: Sempre usar `useSanctumFetch()` para chamadas autenticadas
- **Redirecionamento**: Configurado para `/login` quando não autenticado

### 3. PADRÕES DE UI/UX

#### Responsividade

- **Mobile First**: Sempre considerar mobile primeiro
- **Breakpoints Vuetify**: xs, sm, md, lg, xl
- **Grid System**: Usar `v-container`, `v-row`, `v-col`

#### Tema e Cores

- **Tema Principal**: Light (primary: '#0F2B46')
- **Cores por Tipo**:
  - Cashback: verde (`success`)
  - Pontos: azul (`info`)
  - Milhas: roxo (`purple`)

#### Loading States

- **Global**: Usar `UniversalLoading` component
- **Local**: `v-progress-circular` ou skeleton loaders
- **Button Loading**: Sempre adicionar `:loading` em ações assíncronas

### 4. GERENCIAMENTO DE ESTADO

- **Store Global**: Pinia stores em `/store/`
- **Estado Local**: `ref()`, `reactive()` no componente
- **Computed**: Para valores derivados
- **Watchers**: Para reações a mudanças

### 5. TRATAMENTO DE ERROS

- **API Errors**: Capturar e mostrar via snackbar store
- **Loading States**: Sempre gerenciar loading/error states
- **Fallbacks**: Prover estados empty/error apropriados

### 6. SEO E METADATA

```typescript
useSeoMeta({
  title: 'Título da página',
  ogTitle: 'Título para compartilhamento',
  description: 'Descrição da página',
  ogDescription: 'Descrição para compartilhamento',
})
```

### 7. FORMATAÇÃO E VALIDAÇÃO

- **Preços**: Usar `Intl.NumberFormat` para BRL
- **Números**: Usar `toLocaleString('pt-BR')`
- **Validadores**: Criar composable `useValidators`

### 8. ROTEAMENTO

- **Navegação**: Usar `navigateTo()` do Nuxt
- **Query Params**: Preservar estado em URLs para filtros
- **External Links**: `window.open()` com `noopener,noreferrer`

### 9. PERFORMANCE

- **Lazy Loading**: Componentes grandes devem ser lazy loaded
- **Image Optimization**: Usar Nuxt Image quando necessário
- **API Calls**: Usar `useSanctumFetch` com cache adequado
- **Bundle Splitting**: Configurar code splitting quando necessário

## COMANDOS ESSENCIAIS

```bash
# Desenvolvimento
yarn dev

# Build
yarn build

# Formatação
yarn format        # Formatar todos os arquivos
yarn format:check  # Verificar formatação

# Linting
yarn lint         # Lint e fix
yarn lint:check   # Apenas verificar
```

## ESTRUTURA DE BRANCHES E COMMITS

- **Main Branch**: `master`
- **Commits**: Usar conventional commits quando possível
- **Português**: Mensagens de commit em português

## INTEGRAÇÃO COM API

- **Base URL**: Definida via `process.env.API_URL`
- **Endpoints**: Sempre prefixar com `/api/`
- **Autenticação**: Token via Sanctum
- **Tratamento de Erro**: Capturar e mostrar feedback ao usuário

## BOAS PRÁTICAS ESPECÍFICAS

### Componentes

- **Reusabilidade**: Criar componentes pequenos e focados
- **Props Validation**: Sempre tipar e validar props
- **Emits**: Definir eventos claramente
- **Slots**: Usar para flexibilidade quando necessário

### Performance

- **Virtual Scrolling**: Para listas grandes
- **Debounce**: Em inputs de busca
- **Pagination**: Implementar em listas extensas
- **Lazy Loading**: Para imagens e componentes pesados

### Acessibilidade

- **ARIA Labels**: Adicionar quando necessário
- **Keyboard Navigation**: Suporte a navegação por teclado
- **Color Contrast**: Seguir guidelines WCAG
- **Screen Readers**: Texto alternativo em imagens

## REGRAS IMPORTANTES

### 10. USO DE EMOJIS

- **NUNCA USAR EMOJIS**: Não utilizar emojis em nenhum código, comentário, mensagem de commit, ou documentação
- **Alternativas**: Usar texto descritivo ou ícones do Material Design quando necessário
- **Consistência**: Manter linguagem profissional e limpa em todo o projeto

Este documento deve ser consultado sempre antes de iniciar desenvolvimento para garantir consistência e qualidade do código.

### 11. Campanhas

Transferência Bonificada

Exemplos:
Transfira seus pontos na promoção: Premmia e Smiles e ganhe até 80% de bônus
Transfira seus pontos na promoção: Inter Loop e TudoAzul e ganhe até 80% de bônus
Transfira seus pontos na promoção: Livelo e TudoAzul e ganhe até 110% de bônus

Compra de Pontos com Bônus

Exemplos:
Ganhe até 250% de bônus na compra de pontos no programa Smiles
Ganhe até 100% de bônus na compra de pontos no programa MileagePlus
Ganhe até 350% de bônus na compra de pontos no programa Smiles

Compra de Pontos com Desconto

Exemplos:
Ganhe até 60% de desconto na compra de pontos no programa LATAM Pass
Ganhe até 50% de desconto na compra de pontos no programa Livelo
Ganhe até 55% de desconto na compra de pontos no programa Livelo

Upgrade de Clube

Exemplos:
Faça o Upgrade de clube do programa Smiles e ganhe até 240.000 pontos de bônus
Faça o Upgrade de clube do programa Esfera e ganhe até 60.000 pontos de bônus
Faça o Upgrade de clube do programa Smiles e ganhe até 96.000 pontos de bônus

Adesão de Clube

Exemplos:
Assine o clube do programa Livelo e ganhe até 10.000 pontos bônus  
Assine o clube do programa Smiles e ganhe até 14.000 pontos bônus
Assine o clube do programa Livelo e ganhe até 98.000 (Top) pontos bônus
