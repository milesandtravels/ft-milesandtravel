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

/* Mobile */
@media screen and (max-width: 768px) {
  .tip-card {
    padding: 12px;
  }
}
</style>