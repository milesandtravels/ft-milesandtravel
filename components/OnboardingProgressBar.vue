<template>
  <div class="progress-container">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercentage + '%' }" />
    </div>
    <div class="progress-text">
      {{ Math.round(progressPercentage) }}% concluído
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    currentStep: number
    totalSteps: number
  }

  const props = defineProps<Props>()

  const progressPercentage = computed(() => {
    return ((props.currentStep + 1) / props.totalSteps) * 100
  })
</script>

<style scoped>
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
    background: #0f2b46;
    border-radius: 3px;
    transition: width 0.3s ease;
    box-shadow: 0 0 10px rgba(15, 43, 70, 0.3);
  }

  .progress-text {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
  }

  /* Mobile */
  @media screen and (max-width: 768px) {
    .progress-container {
      padding: 0 16px 12px;
    }
  }
</style>
