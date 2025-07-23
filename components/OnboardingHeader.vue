<!-- OnboardingHeader.vue -->
<template>
  <div class="onboarding-header">
    <div class="header-content">
      <div class="step-indicator">
        <div class="step-number">{{ stepIndex + 1 }}</div>
        <div class="step-total">de {{ totalSteps }}</div>
      </div>

      <div class="header-main">
        <div class="step-icon">
          <v-icon :icon="step.icon" size="24" color="white" />
        </div>
        <div class="header-text">
          <h2 class="step-title">{{ step.title }}</h2>
          <div class="step-category">Guia Interativo</div>
        </div>
      </div>

      <v-btn
        icon="mdi-close"
        variant="text"
        color="white"
        size="small"
        class="close-btn"
        @click="$emit('close')"
      />
    </div>

    <!-- Progress Bar -->
    <OnboardingProgressBar
      :current-step="stepIndex"
      :total-steps="totalSteps"
    />
  </div>
</template>

<script setup lang="ts">
  import OnboardingProgressBar from './OnboardingProgressBar.vue'

  interface Props {
    step: any
    stepIndex: number
    totalSteps: number
    isMobile: boolean
  }

  defineProps<Props>()

  defineEmits<{
    close: []
  }>()
</script>

<style scoped>
  .onboarding-header {
    background: #0f2b46;
    color: white;
    position: relative;
    overflow: hidden;
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

  /* Mobile */
  @media screen and (max-width: 768px) {
    .header-content {
      padding: 16px 16px 12px;
    }

    .step-title {
      font-size: 16px;
    }
  }
</style>
