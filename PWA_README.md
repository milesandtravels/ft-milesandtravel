# PWA (Progressive Web App) - Miles and Travel

## 📱 Implementação Completa do PWA

Este projeto agora possui uma implementação completa de PWA (Progressive Web App) que permite aos usuários instalar a aplicação em seus dispositivos e usar funcionalidades offline.

## 🚀 Funcionalidades Implementadas

### 1. **Manifest Web App**

- Configuração completa no `nuxt.config.ts`
- Ícones PWA (192x192 e 512x512 pixels)
- Tema personalizado com cores da marca
- Configuração para modo standalone

### 2. **Service Worker**

- Registro automático via `@vite-pwa/nuxt`
- Cache inteligente para recursos estáticos
- Estratégias de cache personalizadas:
  - **Imagens**: Cache First (30 dias)
  - **API**: Network First (5 minutos)
  - **Recursos estáticos**: Stale While Revalidate

### 3. **Componentes PWA**

#### `PwaInstallPrompt.vue`

- Prompt de instalação automático
- Controle de frequência (não mostra por 7 dias após dispensar)
- Detecção se já está instalado

#### `PwaUpdatePrompt.vue`

- Notificação quando nova versão está disponível
- Botão para atualizar instantaneamente
- Loading state durante atualização

#### `PwaOfflineIndicator.vue`

- Indicador visual de status online/offline
- Notificação quando conexão é restaurada
- Feedback visual para o usuário

### 4. **Composable `usePwa()`**

- Gerenciamento reativo do estado PWA
- Funcionalidades disponíveis:
  - `isInstalled`: Verifica se está instalado como PWA
  - `isOnline`: Status de conectividade
  - `updateAvailable`: Nova versão disponível
  - `shareContent()`: Web Share API
  - `requestNotificationPermission()`: Permissões de notificação
  - `showNotification()`: Notificações locais
  - `deviceCapabilities`: Capacidades do dispositivo

## 📦 Arquivos Criados/Modificados

### Configuração

- `nuxt.config.ts` - Configuração do módulo PWA
- `package.json` - Dependência `@vite-pwa/nuxt`

### Componentes

- `components/PwaInstallPrompt.vue`
- `components/PwaUpdatePrompt.vue`
- `components/PwaOfflineIndicator.vue`

### Composables

- `composables/usePwa.ts`

### Assets

- `public/pwa-192x192.png` - Ícone PWA 192x192
- `public/pwa-512x512.png` - Ícone PWA 512x512
- `public/sw.js` - Service Worker personalizado

### Layout

- `layouts/default.vue` - Integração dos componentes PWA

## 🛠️ Como Usar

### 1. **Instalação**

O PWA já está configurado e funcionando. Os usuários verão automaticamente:

- Prompt de instalação (após algumas visitas)
- Notificações de atualização
- Indicadores de conectividade

### 2. **Personalização**

#### Modificar Manifest

```typescript
// nuxt.config.ts
pwa: {
  manifest: {
    name: 'Seu App Name',
    short_name: 'App',
    description: 'Descrição do seu app',
    theme_color: '#sua-cor',
    // ... outras configurações
  }
}
```

#### Usar o Composable

```vue
<script setup>
  const { isInstalled, isOnline, shareContent, deviceCapabilities } = usePwa()

  // Compartilhar conteúdo
  const share = () => {
    shareContent({
      title: 'Miles and Travel',
      text: 'Confira esta oferta incrível!',
      url: window.location.href,
    })
  }
</script>
```

### 3. **Notificações Push**

O service worker já está preparado para notificações push. Para implementar:

1. Configure seu servidor de push
2. Use o OneSignal já integrado
3. Ou implemente notificações customizadas via `usePwa()`

## 🔧 Configurações Avançadas

### Cache Personalizado

Modifique `public/sw.js` para adicionar estratégias específicas:

```javascript
// Exemplo: Cache específico para dados de usuário
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/api/user'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'user-data',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60, // 1 hora
      }),
    ],
  })
)
```

### Ícones Customizados

Substitua os arquivos em `public/`:

- `pwa-192x192.png`
- `pwa-512x512.png`

**Importante**: Use imagens PNG reais, não SVG, para melhor compatibilidade.

## 📱 Testando o PWA

### Chrome DevTools

1. Abra DevTools (F12)
2. Vá para aba "Application"
3. Verifique:
   - **Manifest**: Configurações do manifest
   - **Service Workers**: Status do SW
   - **Storage**: Cache e dados offline

### Lighthouse

1. Abra DevTools
2. Vá para aba "Lighthouse"
3. Selecione "Progressive Web App"
4. Execute auditoria

### Instalação Manual

1. Chrome: Ícone de instalação na barra de endereços
2. Edge: Menu → Apps → Instalar este site como app
3. Safari: Compartilhar → Adicionar à Tela Inicial

## 🚨 Troubleshooting

### ✅ Problema de Recarregamento Resolvido

**Problema**: Página ficava recarregando continuamente
**Solução**:

- Removido service worker personalizado conflitante (`/public/sw.js`)
- Alterado `registerType` de `'autoUpdate'` para `'prompt'`
- Removido `navigateFallback` e `periodicSyncForUpdates`
- Desabilitado `devOptions.enabled` em produção
- Criado plugin para prevenir reloads desnecessários

### Service Worker não registra

- Verifique console do navegador
- Certifique-se que está em HTTPS (ou localhost)
- Limpe cache do navegador

### Prompt de instalação não aparece

- Aguarde algumas visitas ao site
- Verifique se já não está instalado
- Teste em modo incógnito

### Cache não funciona

- Verifique Network tab no DevTools
- Force refresh (Ctrl+Shift+R)
- Limpe cache do Service Worker

## 📈 Métricas PWA

O PWA implementado atende aos critérios:

- ✅ **Installable**: Manifest + Service Worker
- ✅ **Reliable**: Funciona offline
- ✅ **Fast**: Cache inteligente
- ✅ **Engaging**: Notificações + Instalação

## 🔄 Atualizações

Para atualizar o PWA:

1. Faça deploy da nova versão
2. Service Worker detectará mudanças
3. Usuários verão prompt de atualização
4. Atualização acontece automaticamente

---

**Desenvolvido para Miles and Travel** 🛫✈️
