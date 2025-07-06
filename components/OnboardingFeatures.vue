<!-- OnboardingFeatures.vue -->
<template>
  <div class="features-section">
    <h4 class="features-title">
      <v-icon icon="mdi-star" size="16" color="primary" class="me-2" />
      O que você vai aprender:
    </h4>
    <div class="features-grid">
      <div
        v-for="(feature, index) in features"
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
</template>

<script setup lang="ts">
interface Props {
  features: string[]
  isMobile: boolean
}

defineProps<Props>()
</script>

<style scoped>
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

/* Mobile */
@media screen and (max-width: 768px) {
  .feature-item {
    padding: 10px;
  }
}
</style>