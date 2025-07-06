<!-- OnboardingModal.vue -->
<template>
  <div class="onboarding-overlay" @click.self="handleOverlayClick">
    <!-- Spotlight -->
    <OnboardingSpotlight :target="step.target" :show="!!step.target" />

    <!-- Tour Card -->
    <v-card
      :class="[
        'onboarding-card',
        'elevation-8',
        { 'mobile-card': isMobile, 'mobile-fullscreen': isMobile },
      ]"
      :style="cardStyle"
      :width="isMobile ? '100vw' : '620'"
      :max-width="isMobile ? '100vw' : '620px'"
      :max-height="isMobile ? '100vh' : '75vh'"
    >
      <!-- Header -->
      <OnboardingHeader
        :step="step"
        :step-index="stepIndex"
        :total-steps="totalSteps"
        :is-mobile="isMobile"
        @close="$emit('skip')"
      />

      <!-- Content -->
      <OnboardingContent :step="step" :is-mobile="isMobile" />

      <!-- Actions -->
      <OnboardingActions
        :step-index="stepIndex"
        :is-last-step="isLastStep"
        :is-mobile="isMobile"
        @next="$emit('next')"
        @previous="$emit('previous')"
        @skip="$emit('skip')"
      />
    </v-card>
  </div>
</template>

<script setup lang="ts">
  import OnboardingActions from './OnboardingActions.vue'
  import OnboardingContent from './OnboardingContent.vue'
  import OnboardingHeader from './OnboardingHeader.vue'
  import OnboardingSpotlight from './OnboardingSpotlight.vue'

  interface Props {
    step: any
    stepIndex: number
    totalSteps: number
    isLastStep: boolean
    isMobile: boolean
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    next: []
    previous: []
    skip: []
  }>()

  // Card positioning
  const cardStyle = computed(() => {
    // No mobile, fullscreen
    if (props.isMobile) {
      return {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        zIndex: 10002,
        borderRadius: '0 !important',
      }
    }

    const element = props.step?.target
      ? document.querySelector(props.step.target)
      : null

    if (!element) {
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

  const handleOverlayClick = (event: Event) => {
    if (event.target === event.currentTarget) {
      emit('skip')
    }
  }
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

  .onboarding-card {
    backdrop-filter: blur(10px);
    border-radius: 16px !important;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
  }

  .mobile-card {
    width: 100vw !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    overflow-y: auto !important;
  }

  .mobile-fullscreen {
    border-radius: 0 !important;
    height: 100vh !important;
    display: flex !important;
    flex-direction: column !important;
  }

  /* Mobile Responsivity */
  @media screen and (max-width: 768px) {
    .onboarding-card {
      width: 100vw !important;
      max-width: 100vw !important;
      max-height: 100vh !important;
      height: 100vh !important;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      transform: none !important;
      border-radius: 0 !important;
      display: flex !important;
      flex-direction: column !important;
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
  }
</style>
