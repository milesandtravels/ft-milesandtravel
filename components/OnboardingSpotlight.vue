<!-- OnboardingSpotlight.vue -->
<template>
  <div
    v-if="show && spotlightStyle.display !== 'none'"
    class="onboarding-spotlight"
    :style="spotlightStyle"
  />
</template>

<script setup lang="ts">
  interface Props {
    target?: string
    show: boolean
  }

  const props = defineProps<Props>()

  const spotlightStyle = computed(() => {
    if (!props.target) return { display: 'none' }

    const element = document.querySelector(props.target)
    if (!element) {
      return { display: 'none' }
    }

    const rect = element.getBoundingClientRect()
    const padding = 10

    return {
      position: 'fixed' as const,
      top: `${rect.top - padding}px`,
      left: `${rect.left - padding}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`,
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.9)',
      border: '3px solid #0f2b46',
      zIndex: 10001,
      pointerEvents: 'none' as const,
      transition: 'all 0.3s ease',
    }
  })
</script>

<style scoped>
  .onboarding-spotlight {
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.8);
    animation: spotlight-pulse 2s infinite;
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

  /* Mobile: esconder spotlight */
  @media screen and (max-width: 768px) {
    .onboarding-spotlight {
      display: none !important;
    }
  }
</style>
