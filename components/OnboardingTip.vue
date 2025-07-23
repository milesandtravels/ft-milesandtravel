<!-- OnboardingTip.vue -->
<template>
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
          {{ tip }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    tip: string
    isMobile: boolean
  }

  defineProps<Props>()
</script>

<style scoped>
  .tip-section {
    margin-bottom: 8px;
  }

  .tip-card {
    background: #f8f9fa;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    border-left: 3px solid #ffc107;
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
    color: #555;
    line-height: 1.4;
  }

  /* Mobile */
  @media screen and (max-width: 768px) {
    .tip-card {
      padding: 12px;
    }
  }
</style>
