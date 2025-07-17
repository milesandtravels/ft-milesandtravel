<template>
  <div :class="['logo-container', sizeClass]" :style="customSize">
    <img
      :src="src"
      :alt="alt"
      :title="title || alt"
      class="logo-image"
      @error="handleImageError"
      @load="handleImageLoad"
    />

    <!-- Fallback quando a imagem não carrega -->
    <div v-if="showFallback" class="logo-fallback">
      <v-icon :size="fallbackIconSize" color="primary" icon="mdi-store" />
      <span v-if="showFallbackText" class="fallback-text">
        {{ fallbackText }}
      </span>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="logo-loading">
      <v-progress-circular :size="loadingSize" color="primary" indeterminate />
    </div>
  </div>
</template>

<script lang="ts" setup>
  type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom'
  type LogoType = 'ecommerce' | 'points' | 'cashback' | 'miles' | 'general'

  interface Props {
    src: string
    alt: string
    title?: string
    size?: LogoSize
    type?: LogoType
    width?: string | number
    height?: string | number
    showFallback?: boolean
    fallbackText?: string
    loading?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    type: 'general',
    showFallback: true,
    loading: false,
  })

  const isLoading = ref(props.loading)
  const showFallback = ref(false)

  // Tamanhos predefinidos
  const sizeMap = {
    xs: { width: '32px', height: '32px' },
    sm: { width: '48px', height: '48px' },
    md: { width: '64px', height: '64px' },
    lg: { width: '80px', height: '80px' },
    xl: { width: '120px', height: '120px' },
  }

  // Classes de tamanho
  const sizeClass = computed(() => {
    if (props.size === 'custom') return 'logo-custom'
    return `logo-${props.size}`
  })

  // Estilo customizado para tamanho personalizado
  const customSize = computed(() => {
    if (props.size === 'custom') {
      const size = props.width || props.height || '64px'
      const sizeValue = typeof size === 'number' ? `${size}px` : size
      return {
        width: sizeValue,
        height: sizeValue, // Sempre quadrado para manter o círculo
      }
    }
    return {}
  })

  // Ícone de fallback baseado no tipo
  const fallbackIcon = computed(() => {
    return 'mdi-store' // Ícone padrão sempre será mdi-store
  })

  // Texto de fallback
  const fallbackText = computed(() => {
    return props.fallbackText || props.alt
  })

  // Tamanho do ícone de fallback baseado no tamanho do container
  const fallbackIconSize = computed(() => {
    if (props.size === 'custom') {
      const width =
        typeof props.width === 'number'
          ? props.width
          : parseInt(props.width || '64')
      return Math.max(16, Math.min(32, width * 0.4))
    }

    const sizeIconMap = {
      xs: 12,
      sm: 16,
      md: 20,
      lg: 24,
      xl: 32,
    }
    return sizeIconMap[props.size]
  })

  // Tamanho do loading
  const loadingSize = computed(() => {
    if (props.size === 'custom') {
      const width =
        typeof props.width === 'number'
          ? props.width
          : parseInt(props.width || '64')
      return Math.max(16, Math.min(40, width * 0.5))
    }

    const sizeLoadingMap = {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
      xl: 36,
    }
    return sizeLoadingMap[props.size]
  })

  // Mostrar texto de fallback apenas em tamanhos maiores
  const showFallbackText = computed(() => {
    if (props.size === 'custom') {
      const width =
        typeof props.width === 'number'
          ? props.width
          : parseInt(props.width || '64')
      return width >= 80
    }
    return ['lg', 'xl'].includes(props.size)
  })

  const handleImageError = () => {
    isLoading.value = false
    showFallback.value = true
  }

  const handleImageLoad = () => {
    isLoading.value = false
    showFallback.value = false
  }

  // Watch para mudanças na prop loading
  watch(
    () => props.loading,
    newVal => {
      isLoading.value = newVal
      if (newVal) {
        showFallback.value = false
      }
    }
  )
</script>

<style scoped>
  .logo-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: rgba(var(--v-theme-surface), 1);
    border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
    transition: all 0.2s ease;
    border-radius: 50% !important;
    aspect-ratio: 1 / 1;
  }

  .logo-container:hover {
    border-color: rgba(var(--v-theme-on-surface), 0.12);
    box-shadow: 0 4px 12px rgba(var(--v-theme-on-surface), 0.15);
    transform: translateY(-1px);
  }

  /* Tamanhos predefinidos - sempre redondos */
  .logo-xs {
    width: 32px;
    height: 32px;
  }

  .logo-sm {
    width: 48px;
    height: 48px;
  }

  .logo-md {
    width: 64px;
    height: 64px;
  }

  .logo-lg {
    width: 80px;
    height: 80px;
  }

  .logo-xl {
    width: 120px;
    height: 120px;
  }

  /* Imagem principal */
  .logo-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
    transition: opacity 0.2s ease;
    padding: 8px; /* Padding interno para dar respiro à imagem */
  }

  .logo-image:hover {
    opacity: 0.9;
  }

  /* Fallback */
  .logo-fallback {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(var(--v-theme-surface), 0.95);
    gap: 4px;
  }

  .fallback-text {
    font-size: 0.6875rem;
    font-weight: 500;
    color: rgba(var(--v-theme-on-surface), 0.6);
    text-align: center;
    line-height: 1.2;
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Loading */
  .logo-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(var(--v-theme-surface), 0.9);
  }

  /* Variações por tipo - com gradientes circulares */
  .logo-container[data-type='ecommerce'] {
    background: radial-gradient(
      circle,
      rgba(var(--v-theme-primary), 0.05),
      rgba(var(--v-theme-surface), 1)
    );
    border-color: rgba(var(--v-theme-primary), 0.1);
  }

  .logo-container[data-type='points'] {
    background: radial-gradient(
      circle,
      rgba(var(--v-theme-warning), 0.05),
      rgba(var(--v-theme-surface), 1)
    );
    border-color: rgba(var(--v-theme-warning), 0.1);
  }

  .logo-container[data-type='cashback'] {
    background: radial-gradient(
      circle,
      rgba(var(--v-theme-success), 0.05),
      rgba(var(--v-theme-surface), 1)
    );
    border-color: rgba(var(--v-theme-success), 0.1);
  }

  .logo-container[data-type='miles'] {
    background: radial-gradient(
      circle,
      rgba(var(--v-theme-info), 0.05),
      rgba(var(--v-theme-surface), 1)
    );
    border-color: rgba(var(--v-theme-info), 0.1);
  }

  /* Responsividade para tamanhos pequenos */
  @media (max-width: 600px) {
    .logo-xl {
      width: 96px;
      height: 96px;
    }

    .logo-lg {
      width: 72px;
      height: 72px;
    }
  }

  /* Estados especiais */
  .logo-container.loading {
    pointer-events: none;
  }

  .logo-container.error .logo-image {
    display: none;
  }

  /* Acessibilidade */
  @media (prefers-reduced-motion: reduce) {
    .logo-container,
    .logo-image,
    .logo-loading {
      transition: none;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .logo-container {
      border-width: 2px;
      border-color: currentColor;
    }
  }
</style>
