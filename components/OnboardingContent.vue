<!-- OnboardingContent.vue -->
<template>
  <v-card-text :class="isMobile ? 'pa-4' : 'pa-6'" class="content-area">
    <!-- Animation Icon -->
    <div class="animation-container">
      <div class="icon-backdrop">
        <v-icon
          :icon="step.animation.icon"
          :color="step.animation.color"
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
        {{ step.description }}
      </p>
    </div>

    <!-- Features list -->
    <OnboardingFeatures :features="step.features" :is-mobile="isMobile" />

    <!-- Tips -->
    <OnboardingTip :tip="step.tip" :is-mobile="isMobile" />
  </v-card-text>
</template>

<script setup lang="ts">
  import OnboardingFeatures from './OnboardingFeatures.vue'
  import OnboardingTip from './OnboardingTip.vue'

  interface Props {
    step: any
    isMobile: boolean
  }

  defineProps<Props>()
</script>

<style scoped>
  .content-area {
    background: white;
    overflow-y: auto !important;
    flex: 1 !important;
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
    background: #e3f2fd;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(15, 43, 70, 0.2);
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

  /* Mobile */
  @media screen and (max-width: 768px) {
    .content-area {
      padding: 16px !important;
    }

    .icon-backdrop {
      width: 60px;
      height: 60px;
    }
  }
</style>
