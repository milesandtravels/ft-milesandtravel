<!-- OnboardingTour.vue -->
<template>
  <div v-if="showOnboarding">
    <!-- Overlay -->
    <div class="onboarding-overlay" @click.self="handleOverlayClick">
      <!-- Spotlight -->
      <div
        v-if="currentStep && !showCompletion"
        class="onboarding-spotlight"
        :style="spotlightStyle"
      />

      <!-- Tour Card - Só mostrar se não estiver na conclusão -->
      <v-card
        v-if="currentStep && !showCompletion"
        :class="['onboarding-card', 'elevation-8', { 'mobile-card': isMobile }]"
        :style="cardStyle"
        :width="isMobile ? '90vw' : '620'"
        :max-width="isMobile ? '90vw' : '620px'"
        :max-height="isMobile ? '90vh' : '75vh'"
      >
        <!-- Header Melhorado -->
        <div class="onboarding-header">
          <div class="header-content">
            <div class="step-indicator">
              <div class="step-number">{{ currentStepIndex + 1 }}</div>
              <div class="step-total">de {{ onboardingSteps.length }}</div>
            </div>

            <div class="header-main">
              <div class="step-icon">
                <v-icon :icon="currentStep.icon" size="24" color="white" />
              </div>
              <div class="header-text">
                <h2 class="step-title">{{ currentStep.title }}</h2>
                <div class="step-category">Guia Interativo</div>
              </div>
            </div>

            <v-btn
              icon="mdi-close"
              variant="text"
              color="white"
              size="small"
              class="close-btn"
              @click="skipTour"
            />
          </div>

          <!-- Progress Bar Melhorada -->
          <div class="progress-container">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: progressPercentage + '%' }"
              ></div>
            </div>
            <div class="progress-text">
              {{ Math.round(progressPercentage) }}% concluído
            </div>
          </div>
        </div>

        <!-- Content Melhorado -->
        <v-card-text :class="isMobile ? 'pa-4' : 'pa-6'" class="content-area">
          <!-- Animation Icon -->
          <div class="animation-container">
            <div class="icon-backdrop">
              <v-icon
                :icon="currentStep.animation.icon"
                :color="currentStep.animation.color"
                :size="isMobile ? '40' : '48'"
                class="step-animation-icon"
              />
            </div>
          </div>

          <!-- Description -->
          <div class="description-section">
            <p
              :class="isMobile ? 'text-body-2' : 'text-body-1'"
              class="step-description"
            >
              {{ currentStep.description }}
            </p>
          </div>

          <!-- Features list -->
          <div class="features-section">
            <h4 class="features-title">
              <v-icon icon="mdi-star" size="16" color="primary" class="me-2" />
              O que você vai aprender:
            </h4>
            <div class="features-grid">
              <div
                v-for="(feature, index) in currentStep.features"
                :key="feature"
                class="feature-item"
              >
                <div class="feature-number">{{ index + 1 }}</div>
                <span
                  :class="isMobile ? 'text-caption' : 'text-body-2'"
                  class="feature-text"
                >
                  {{ feature }}
                </span>
              </div>
            </div>
          </div>

          <!-- Tips -->
          <div class="tip-section">
            <div class="tip-card">
              <div class="tip-icon">
                <v-icon icon="mdi-lightbulb" size="20" color="amber" />
              </div>
              <div class="tip-content">
                <div class="tip-label">Dica Especial</div>
                <span
                  :class="isMobile ? 'text-caption' : 'text-body-2'"
                  class="tip-text"
                >
                  {{ currentStep.tip }}
                </span>
              </div>
            </div>
          </div>
        </v-card-text>

        <!-- Actions Melhoradas -->
        <div class="actions-section">
          <div
            class="actions-container"
            :class="{ 'mobile-actions': isMobile }"
          >
            <!-- Left side - Skip button (desktop only) -->
            <div v-if="!isMobile" class="actions-left">
              <v-btn
                variant="text"
                color="grey-darken-1"
                @click="skipTour"
                class="skip-btn"
              >
                <v-icon icon="mdi-close" size="16" class="me-1" />
                Pular Tour
              </v-btn>
            </div>

            <!-- Center/Right - Navigation buttons -->
            <div class="actions-right" :class="{ 'mobile-full': isMobile }">
              <v-btn
                v-if="currentStepIndex > 0"
                variant="outlined"
                color="primary"
                @click="previousStep"
                :class="{ 'mobile-btn': isMobile }"
                :size="isMobile ? 'default' : 'default'"
                class="prev-btn"
              >
                <v-icon icon="mdi-arrow-left" size="16" class="me-1" />
                {{ isMobile ? 'Voltar' : 'Anterior' }}
              </v-btn>

              <v-btn
                color="primary"
                variant="flat"
                @click="nextStep"
                :class="{ 'mobile-btn': isMobile, 'next-btn': true }"
                :size="isMobile ? 'default' : 'default'"
              >
                {{ isLastStep ? 'Finalizar' : 'Próximo' }}
                <v-icon
                  :icon="isLastStep ? 'mdi-check' : 'mdi-arrow-right'"
                  size="16"
                  class="ml-1"
                />
              </v-btn>
            </div>
          </div>

          <!-- Mobile skip button -->
          <div v-if="isMobile" class="mobile-skip">
            <v-btn
              variant="text"
              color="grey-darken-1"
              @click="skipTour"
              size="small"
              class="w-100"
            >
              <v-icon icon="mdi-close" size="14" class="me-1" />
              Pular Tour
            </v-btn>
          </div>
        </div>
      </v-card>
    </div>

    <!-- Welcome Modal -->
    <v-dialog
      v-model="showWelcome"
      :max-width="dialogMaxWidth"
      persistent
      :fullscreen="isMobile"
    >
      <v-card class="text-center">
        <v-card-text :class="isMobile ? 'pa-4' : 'pa-8'">
          <div class="mb-6">
            <v-icon
              icon="mdi-compass"
              size="80"
              color="primary"
              class="animate-spin-slow"
            />
          </div>

          <h1
            :class="isMobile ? 'text-h5' : 'text-h4'"
            class="font-weight-bold mb-4 text-primary"
          >
            Bem-vindo ao Miles&Travels! 🎉
          </h1>

          <p
            :class="isMobile ? 'text-body-1' : 'text-h6'"
            class="mb-6 text-medium-emphasis"
          >
            Vamos te mostrar como aproveitar ao máximo nossa plataforma
          </p>

          <v-alert type="info" variant="tonal" class="mb-6 text-start">
            <template v-slot:prepend>
              <v-icon icon="mdi-lightbulb" />
            </template>
            <strong>💡 Dica:</strong> Este tour leva apenas 2 minutos e vai te
            ajudar a economizar muito mais nas suas compras!
          </v-alert>
        </v-card-text>

        <v-card-actions
          :class="isMobile ? 'pa-4 pt-0 flex-column' : 'pa-6 pt-0'"
        >
          <v-btn
            variant="outlined"
            color="grey"
            size="large"
            @click="skipTour"
            :class="isMobile ? 'w-100 mb-2' : 'flex-grow-1'"
          >
            Agora Não
          </v-btn>

          <v-btn
            color="primary"
            variant="flat"
            size="large"
            @click="startTour"
            :class="isMobile ? 'w-100' : 'flex-grow-1 ml-4'"
          >
            <v-icon icon="mdi-play" class="me-2" />
            Começar Tour
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Completion Modal -->
    <v-dialog
      v-model="showCompletion"
      :max-width="dialogMaxWidth"
      persistent
      :fullscreen="isMobile"
      :z-index="10005"
    >
      <v-card class="text-center">
        <v-card-text :class="isMobile ? 'pa-4' : 'pa-8'">
          <div class="mb-6">
            <v-icon
              icon="mdi-check-circle"
              size="80"
              color="success"
              class="animate-bounce"
            />
          </div>

          <h1
            :class="isMobile ? 'text-h5' : 'text-h4'"
            class="font-weight-bold mb-4 text-success"
          >
            Parabéns! 🎉
          </h1>

          <p
            :class="isMobile ? 'text-body-1' : 'text-h6'"
            class="mb-6 text-medium-emphasis"
          >
            Você completou o tour da plataforma
          </p>

          <v-alert type="success" variant="tonal" class="mb-6 text-start">
            <template v-slot:prepend>
              <v-icon icon="mdi-rocket" />
            </template>
            <strong>Próximos passos:</strong> Que tal fazer sua primeira busca
            agora e descobrir as melhores ofertas?
          </v-alert>
        </v-card-text>

        <v-card-actions :class="isMobile ? 'pa-4 pt-0' : 'pa-6 pt-0'">
          <v-btn
            color="success"
            variant="flat"
            size="large"
            @click="finishTour"
            :class="isMobile ? 'w-100' : 'flex-grow-1'"
          >
            <v-icon icon="mdi-rocket" class="me-2" />
            Começar a Usar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
  interface OnboardingStep {
    id: string
    title: string
    description: string
    target?: string
    icon: string
    animation: { icon: string; color: string }
    features: string[]
    tip: string
  }

  interface Props {
    modelValue: boolean
    autoStart?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    autoStart: false,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'tour-completed': []
    'tour-skipped': []
  }>()

  // Steps do onboarding baseados no fluxo real da aplicação
  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome-home',
      title: 'Bem-vindo ao Miles&Travels',
      description:
        'Sua jornada para economizar com cashback, pontos e milhas começa aqui! Na página inicial você encontra as promoções em destaque para começar a explorar.',
      target: '[data-onboarding="promotions-highlight"]',
      icon: 'mdi-home',
      animation: { icon: 'mdi-compass', color: 'primary' },
      features: [
        'Veja promoções em destaque na página inicial',
        'Descubra ofertas especiais de programas',
        'Explore categorias com melhores benefícios',
        'Comece sua busca por produtos',
      ],
      tip: '🏠 A página inicial mostra as melhores oportunidades do momento para você começar!',
    },

    {
      id: 'search-products-page',
      title: 'Busca Inteligente de Produtos',
      description:
        'Acesse a página de busca para encontrar produtos específicos. Quanto mais detalhada sua busca, melhores serão os resultados com ofertas personalizadas!',
      target: '[data-onboarding="search-input"]',
      icon: 'mdi-magnify',
      animation: { icon: 'mdi-magnify', color: 'primary' },
      features: [
        'Use termos específicos como "iPhone 15 Pro 256GB Azul"',
        'Inclua marca, modelo e características importantes',
        'Evite termos muito genéricos como "celular"',
        'O sistema busca em centenas de lojas simultaneamente',
      ],
      tip: '💡 Exemplo: Ao invés de "notebook", tente "notebook Dell Inspiron 15 i5 8GB" para resultados precisos.',
    },

    {
      id: 'product-selection',
      title: 'Seleção de Produtos',
      description:
        'Após a busca, você verá os produtos encontrados. Selecione aqueles que mais se aproximam do que você procura - eles serão usados para gerar ofertas personalizadas.',
      target: '[data-onboarding="product-list"]',
      icon: 'mdi-checkbox-marked-circle',
      animation: { icon: 'mdi-cursor-default-click', color: 'green' },
      features: [
        'Compare preços entre diferentes produtos',
        'Verifique avaliações e especificações',
        'Observe características como cor, tamanho e marca',
        'Selecione múltiplos produtos para mais opções',
      ],
      tip: '⚡ Selecione vários produtos similares - isso gera mais opções de ofertas para comparar!',
    },

    {
      id: 'offers-page',
      title: 'Ofertas dos Produtos Selecionados',
      description:
        'Na página de ofertas, você encontra todas as oportunidades geradas a partir dos produtos que selecionou, comparando cashback, pontos e milhas de diferentes programas.',
      target: '[data-onboarding="offers-list"]',
      icon: 'mdi-gift-outline',
      animation: { icon: 'mdi-auto-fix', color: 'orange' },
      features: [
        'Ofertas dos seus produtos em Amazon, Shopee, Magazine Luiza e mais',
        'Comparação de programas de cashback, pontos e milhas',
        'Cálculo do melhor custo-benefício por produto',
        'Filtros para refinar suas opções',
      ],
      tip: '🛍️ Essas ofertas são baseadas especificamente nos produtos que você selecionou!',
    },
    {
      id: 'strategic-benefits',
      title: 'Entendendo os Benefícios',
      description:
        'Agora que você viu as ofertas, vamos explicar o que você pode fazer com cada tipo de benefício e como maximizar seus ganhos através de estratégias inteligentes.',
      // SEM target - será centralizado
      icon: 'mdi-school',
      animation: { icon: 'mdi-lightbulb', color: 'amber' },
      features: [
        'Cashback: Dinheiro de volta direto na sua conta',
        'Pontos: Podem virar produtos, descontos ou transferir para milhas',
        'Milhas: Use para passagens aéreas, hotéis e upgrades',
        'Transferências bonificadas: Dobre ou triplique seus pontos!',
      ],
      tip: '🚀 Estratégia secreta: Acumule pontos em compras estratégicas e depois transfira com bônus para maximizar milhas!',
    },

    {
      id: 'strategic-explanation',
      title: 'Compras Estratégicas Explicadas',
      description:
        'Compras estratégicas significam escolher conscientemente onde e como comprar para maximizar seus benefícios. Não é apenas sobre o menor preço!',
      // SEM target - será centralizado
      icon: 'mdi-strategy',
      animation: { icon: 'mdi-chart-line', color: 'success' },
      features: [
        'Escolha produtos que geram mais pontos/milhas por real gasto',
        'Considere o valor total: preço + benefícios',
        'Aproveite promoções de transferência bonificada',
        'Planeje compras grandes em períodos de bônus',
      ],
      tip: '💰 Exemplo: Um produto R$ 50 mais caro pode compensar se gerar 5.000 pontos extras que viram uma passagem!',
    },

    {
      id: 'bonus-transfers',
      title: 'Transferências Bonificadas - O Segredo',
      description:
        'Transferências bonificadas são promoções onde você ganha pontos/milhas extras ao transferir entre programas. É a forma mais eficiente de multiplicar seus benefícios!',
      // SEM target - será centralizado
      icon: 'mdi-gift',
      animation: { icon: 'mdi-trending-up', color: 'purple' },
      features: [
        'Transfira 10.000 pontos e ganhe 20.000 (bônus de 100%)',
        'Transforme pontos de cartão em milhas aéreas',
        'Aproveite promoções sazonais e datas especiais',
        'Multiplique o valor das suas compras estratégicas',
      ],
      tip: '⭐ Ciclo perfeito: Compra estratégica → Acumula pontos → Transferência bonificada → Milhas para viagem!',
    },
    {
      id: 'offers-filters',
      title: 'Filtros Inteligentes',
      description:
        'Use os filtros para refinar as ofertas dos seus produtos. Compare por tipo de programa, loja, ou encontre as melhores oportunidades de cashback.',
      target: '[data-onboarding="offers-filters"]',
      icon: 'mdi-filter-variant',
      animation: { icon: 'mdi-filter-variant', color: 'blue' },
      features: [
        'Filtre por cashback, pontos ou milhas',
        'Compare diferentes lojas e marketplaces',
        'Ordene por melhor benefício',
        'Encontre ofertas específicas dos seus produtos',
      ],
      tip: '💰 Considere não apenas o preço, mas também o valor total do cashback e benefícios!',
    },

    {
      id: 'promotions-page',
      title: 'Promoções Exclusivas de Programas',
      description:
        'Na página de promoções, descubra transferências bonificadas, ofertas especiais de programas de pontos e oportunidades por categorias que podem multiplicar seus benefícios!',
      target: '[data-onboarding="promotions-menu"]',
      icon: 'mdi-gift',
      animation: { icon: 'mdi-trending-up', color: 'purple' },
      features: [
        'Transferências bonificadas entre programas (ex: 100% bônus)',
        'Promoções específicas de programas de pontos e milhas',
        'Ofertas por categorias de produtos',
        'Oportunidades limitadas por tempo',
      ],
      tip: '⭐ Combine promoções com suas compras para maximizar pontos e milhas!',
    },
  ]

  // Estado do onboarding
  const showOnboarding = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value),
  })

  const showWelcome = ref(false)
  const showCompletion = ref(false)
  const currentStepIndex = ref(0)

  // Computed
  const currentStep = computed(() => {
    const step = onboardingSteps[currentStepIndex.value]
    console.log(
      'Current step:',
      step?.id,
      'index:',
      currentStepIndex.value,
      'total steps:',
      onboardingSteps.length
    )
    return step
  })

  const isLastStep = computed(() => {
    const isLast = currentStepIndex.value >= onboardingSteps.length - 1
    console.log('🔚 isLastStep calculado:', {
      currentIndex: currentStepIndex.value,
      totalSteps: onboardingSteps.length,
      isLast,
      calculation: `${currentStepIndex.value} >= ${onboardingSteps.length - 1}`,
      stepIds: onboardingSteps.map(s => s.id),
    })
    return isLast
  })

  const progressPercentage = computed(() => {
    const progress =
      ((currentStepIndex.value + 1) / onboardingSteps.length) * 100
    console.log('Progress:', progress)
    return progress
  })

  // Spotlight positioning
  const spotlightStyle = computed(() => {
    if (!currentStep.value?.target) return {}

    const element = document.querySelector(currentStep.value.target)
    if (!element) {
      // Se o elemento não existe, não mostrar spotlight
      return { display: 'none' }
    }

    const rect = element.getBoundingClientRect()
    const padding = 10

    return {
      position: 'fixed',
      top: `${rect.top - padding}px`,
      left: `${rect.left - padding}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`,
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.9)',
      border: '3px solid #1976d2',
      zIndex: 10001,
      pointerEvents: 'none',
      transition: 'all 0.3s ease',
    }
  })

  // Computed para detectar mobile
  const isMobile = computed(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth <= 768
  })

  const dialogMaxWidth = computed(() => {
    if (typeof window === 'undefined') return '600px'
    return window.innerWidth <= 768 ? '95vw' : '600px'
  })

  // Computed para largura máxima responsiva
  const cardMaxWidth = computed(() => {
    if (typeof window === 'undefined') return '420px'
    return window.innerWidth <= 768 ? '95vw' : '420px'
  })

  // Card positioning
  const cardStyle = computed(() => {
    const isMobileDevice =
      typeof window !== 'undefined' && window.innerWidth <= 768

    // No mobile, sempre centralizar
    if (isMobileDevice) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10002,
        width: '90vw',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflowY: 'auto',
      }
    }

    const element = currentStep.value?.target
      ? document.querySelector(currentStep.value.target)
      : null

    if (!element) {
      // Se não há elemento alvo, centralizar a modal
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10002,
      }
    }

    const rect = element.getBoundingClientRect()
    const cardWidth = 420
    const spacing = 20

    let top = rect.bottom + spacing
    let left = rect.left

    // Ajustar posição se sair da tela
    if (top + 600 > window.innerHeight) {
      top = rect.top - 600 - spacing
    }

    if (left + cardWidth > window.innerWidth) {
      left = window.innerWidth - cardWidth - spacing
    }

    if (left < spacing) {
      left = spacing
    }

    return {
      position: 'fixed',
      top: `${Math.max(spacing, top)}px`,
      left: `${left}px`,
      zIndex: 10002,
    }
  })

  // Métodos
  const startTour = () => {
    showWelcome.value = false
    currentStepIndex.value = 0
    highlightElement()
  }

  const nextStep = () => {
    if (isLastStep.value) {
      showCompletion.value = true
    } else {
      currentStepIndex.value++
      highlightElement()
    }
  }

  const previousStep = () => {
    if (currentStepIndex.value > 0) {
      currentStepIndex.value--
      highlightElement()
    }
  }

  const skipTour = () => {
    console.log('❌ skipTour chamado - FECHANDO MODAL')
    showOnboarding.value = false
    emit('tour-skipped')
  }

  const finishTour = () => {
    console.log('🏆 finishTour chamado - COMPLETANDO TOUR')
    showOnboarding.value = false
    showCompletion.value = false

    // Salvar que o usuário completou o onboarding
    localStorage.setItem('onboarding-completed', 'true')

    emit('tour-completed')
  }

  const handleOverlayClick = event => {
    console.log('🎯 Clique no overlay detectado:', event.target)
    // Só fechar se clicar diretamente no overlay, não em elementos filhos
    if (event.target === event.currentTarget) {
      console.log('✅ Clique direto no overlay - fechando tour')
      skipTour()
    } else {
      console.log('❌ Clique em elemento filho - ignorando')
    }
  }

  const highlightElement = () => {
    nextTick(() => {
      if (currentStep.value?.target) {
        const element = document.querySelector(currentStep.value.target)
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }
      }
    })
  }

  // Watchers
  watch(showOnboarding, (newValue, oldValue) => {
    console.log('🔄 showOnboarding mudou:', oldValue, '->', newValue)
    if (newValue) {
      if (props.autoStart) {
        console.log('🚀 Auto-start ativado, iniciando tour')
        startTour()
      } else {
        console.log('👋 Mostrando modal de boas-vindas')
        showWelcome.value = true
      }
    }
  })

  watch(showCompletion, (newValue, oldValue) => {
    console.log('🎉 showCompletion mudou:', oldValue, '->', newValue)
  })

  watch(currentStepIndex, (newValue, oldValue) => {
    console.log('📈 currentStepIndex mudou:', oldValue, '->', newValue)
  })

  watch(
    () => currentStep.value,
    (newStep, oldStep) => {
      console.log('📋 currentStep mudou:', oldStep?.id, '->', newStep?.id)
    }
  )

  // Lifecycle
  onMounted(() => {
    // Verificar se deve mostrar o onboarding automaticamente
    const hasCompletedOnboarding = localStorage.getItem('onboarding-completed')
    if (!hasCompletedOnboarding && props.autoStart) {
      showOnboarding.value = true
    }
  })
</script>

<style scoped>
  .onboarding-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10000;
    backdrop-filter: blur(2px);
  }

  .onboarding-spotlight {
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.8);
    animation: spotlight-pulse 2s infinite;
  }

  .onboarding-card {
    backdrop-filter: blur(10px);
    border-radius: 16px !important;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
  }

  /* Header Styling */
  .onboarding-header {
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
    color: white;
    position: relative;
    overflow: hidden;
  }

  .onboarding-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>')
      repeat;
    opacity: 0.3;
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 16px;
    position: relative;
    z-index: 1;
  }

  .step-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(255, 255, 255, 0.2);
    padding: 6px 12px;
    border-radius: 20px;
    backdrop-filter: blur(10px);
  }

  .step-number {
    font-size: 14px;
    font-weight: 700;
    color: white;
  }

  .step-total {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
  }

  .header-main {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    justify-content: center;
  }

  .step-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
  }

  .header-text {
    text-align: center;
  }

  .step-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    line-height: 1.2;
  }

  .step-category {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 2px;
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px);
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.2) !important;
  }

  /* Progress Bar */
  .progress-container {
    padding: 0 24px 16px;
    position: relative;
    z-index: 1;
  }

  .progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4caf50 0%, #66bb6a 100%);
    border-radius: 3px;
    transition: width 0.3s ease;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
  }

  .progress-text {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
  }

  /* Content Area */
  .content-area {
    background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  }

  .animation-container {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
  }

  .icon-backdrop {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(25, 118, 210, 0.2);
    animation: float 3s ease-in-out infinite;
  }

  .step-animation-icon {
    animation: pulse 2s ease-in-out infinite;
  }

  .description-section {
    margin-bottom: 24px;
  }

  .step-description {
    color: #424242;
    line-height: 1.6;
    text-align: center;
    margin: 0;
  }

  /* Features */
  .features-section {
    margin-bottom: 24px;
  }

  .features-title {
    font-size: 14px;
    font-weight: 600;
    color: #1976d2;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
  }

  .features-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 12px;
    border-left: 3px solid #1976d2;
  }

  .feature-number {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #1976d2;
    color: white;
    font-size: 11px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .feature-text {
    color: #555;
    line-height: 1.4;
  }

  /* Tip Section */
  .tip-section {
    margin-bottom: 8px;
  }

  .tip-card {
    background: linear-gradient(135deg, #fff8e1 0%, #fff3c4 100%);
    border: 1px solid #ffecb3;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  .tip-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #ffc107;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
  }

  .tip-content {
    flex: 1;
  }

  .tip-label {
    font-size: 12px;
    font-weight: 600;
    color: #f57c00;
    margin-bottom: 4px;
  }

  .tip-text {
    color: #e65100;
    line-height: 1.4;
  }

  /* Actions */
  .actions-section {
    background: #f5f5f5;
    border-top: 1px solid #e0e0e0;
    flex-shrink: 0;
  }

  .actions-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    min-height: 72px;
  }

  .actions-left {
    flex-shrink: 0;
  }

  .actions-right {
    display: flex;
    gap: 12px;
    flex: 1;
    justify-content: flex-end;
    max-width: 280px;
  }

  .mobile-actions {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
    min-height: auto;
  }

  .mobile-full {
    width: 100%;
    justify-content: stretch;
    max-width: none;
  }

  .mobile-btn {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
  }

  .mobile-skip {
    padding: 0 24px 16px;
    border-top: 1px solid #e0e0e0;
  }

  .next-btn {
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3) !important;
    min-width: 120px;
  }

  .next-btn:hover {
    box-shadow: 0 6px 16px rgba(25, 118, 210, 0.4) !important;
    transform: translateY(-1px);
  }

  .skip-btn {
    opacity: 0.7;
  }

  .skip-btn:hover {
    opacity: 1;
  }

  /* Animations */
  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
  }

  @keyframes spotlight-pulse {
    0%,
    100% {
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.8);
    }
    50% {
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6);
    }
  }

  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes bounce {
    0%,
    20%,
    53%,
    80%,
    100% {
      transform: translate3d(0, 0, 0);
    }
    40%,
    43% {
      transform: translate3d(0, -15px, 0);
    }
    70% {
      transform: translate3d(0, -7px, 0);
    }
    90% {
      transform: translate3d(0, -2px, 0);
    }
  }

  .animate-spin-slow {
    animation: spin-slow 4s linear infinite;
  }

  .animate-bounce {
    animation: bounce 1s ease-in-out 3;
  }

  .mobile-card {
    width: 90vw !important;
    max-width: 90vw !important;
    max-height: 90vh !important;
    overflow-y: auto !important;
  }

  .w-100 {
    width: 100% !important;
  }

  .flex-column {
    flex-direction: column !important;
  }

  .ga-2 {
    gap: 8px !important;
  }

  .d-flex {
    display: flex !important;
  }

  /* Mobile Responsivity */
  @media screen and (max-width: 768px) {
    .onboarding-card {
      width: 90vw !important;
      max-width: 90vw !important;
      max-height: 90vh !important;
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      overflow-y: auto !important;
    }

    .onboarding-spotlight {
      display: none !important;
    }

    .header-content {
      padding: 16px 16px 12px;
    }

    .step-title {
      font-size: 16px;
    }

    .progress-container {
      padding: 0 16px 12px;
    }

    .content-area {
      padding: 16px !important;
      overflow-y: auto !important;
    }

    .icon-backdrop {
      width: 60px;
      height: 60px;
    }

    .actions-container {
      padding: 12px 16px !important;
      flex-direction: column !important;
      gap: 12px !important;
      min-height: auto !important;
    }

    .actions-left {
      order: 2;
      max-width: none !important;
    }

    .actions-right {
      order: 1;
      width: 100% !important;
      max-width: none !important;
      min-width: auto !important;
    }

    .mobile-skip {
      padding: 0 16px 12px;
    }

    .feature-item {
      padding: 10px;
    }

    .tip-card {
      padding: 12px;
    }

    .prev-btn,
    .next-btn {
      min-width: 0 !important;
      flex: 1 !important;
    }
  }

  /* Desktop específico */
  @media screen and (min-width: 769px) {
    .onboarding-card {
      max-height: 600px !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
    }

    .content-area {
      overflow-y: auto !important;
      flex: 1 !important;
    }

    .actions-section {
      flex-shrink: 0 !important;
    }
  }
</style>
