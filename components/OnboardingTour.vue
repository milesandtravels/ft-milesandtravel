<!-- OnboardingTour.vue -->
<template>
  <div v-if="showOnboarding">
    <!-- Tour Modal -->
    <OnboardingModal
      v-if="currentStep && !showCompletion"
      :step="currentStep"
      :step-index="currentStepIndex"
      :total-steps="onboardingSteps.length"
      :is-last-step="isLastStep"
      :is-mobile="isMobile"
      @next="nextStep"
      @previous="previousStep"
      @skip="skipTour"
    />

    <!-- Welcome Modal -->
    <OnboardingWelcomeModal
      v-model="showWelcome"
      :is-mobile="isMobile"
      @start-tour="startTour"
      @skip-tour="skipTour"
    />

    <!-- Completion Modal -->
    <OnboardingCompletionModal
      v-model="showCompletion"
      :is-mobile="isMobile"
      @finish-tour="finishTour"
    />
  </div>
</template>

<script setup lang="ts">
import { onboardingSteps } from '~/constants/onboardingSteps';
import type { OnboardingProps } from '~/interfaces/onboarding';
import OnboardingCompletionModal from './OnboardingCompletionModal.vue';
import OnboardingModal from './OnboardingModal.vue';
import OnboardingWelcomeModal from './OnboardingWelcomeModal.vue';

const props = withDefaults(defineProps<OnboardingProps>(), {
  autoStart: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'tour-completed': []
  'tour-skipped': []
}>()

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
  return onboardingSteps[currentStepIndex.value]
})

const isLastStep = computed(() => {
  return currentStepIndex.value >= onboardingSteps.length - 1
})

const isMobile = computed(() => {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= 768
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
  showOnboarding.value = false
  emit('tour-skipped')
}

const finishTour = () => {
  showOnboarding.value = false
  showCompletion.value = false
  
  // Salvar que o usuário completou o onboarding
  localStorage.setItem('onboarding-completed', 'true')
  
  emit('tour-completed')
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
watch(showOnboarding, (newValue) => {
  if (newValue) {
    if (props.autoStart) {
      startTour()
    } else {
      showWelcome.value = true
    }
  }
})

// Lifecycle
onMounted(() => {
  const hasCompletedOnboarding = localStorage.getItem('onboarding-completed')
  if (!hasCompletedOnboarding && props.autoStart) {
    showOnboarding.value = true
  }
})
</script>