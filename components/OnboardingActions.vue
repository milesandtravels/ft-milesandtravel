<!-- OnboardingActions.vue -->
<template>
  <div class="actions-section">
    <div class="actions-container" :class="{ 'mobile-actions': isMobile }">
      <!-- Left side - Skip button (desktop only) -->
      <div v-if="!isMobile" class="actions-left">
        <v-btn
          variant="text"
          color="grey-darken-1"
          @click="$emit('skip')"
          class="skip-btn"
        >
          <v-icon icon="mdi-close" size="16" class="me-1" />
          Pular Tour
        </v-btn>
      </div>

      <!-- Center/Right - Navigation buttons -->
      <div class="actions-right" :class="{ 'mobile-full': isMobile }">
        <v-btn
          v-if="stepIndex > 0"
          variant="outlined"
          color="primary"
          @click="$emit('previous')"
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
          @click="$emit('next')"
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
        @click="$emit('skip')"
        size="small"
        class="w-100"
      >
        <v-icon icon="mdi-close" size="14" class="me-1" />
        Pular Tour
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    stepIndex: number
    isLastStep: boolean
    isMobile: boolean
  }

  defineProps<Props>()

  defineEmits<{
    next: []
    previous: []
    skip: []
  }>()
</script>

<style scoped>
  .actions-section {
    background: white;
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
    box-shadow: 0 2px 8px rgba(15, 43, 70, 0.2) !important;
    min-width: 120px;
  }

  .next-btn:hover {
    box-shadow: 0 4px 12px rgba(15, 43, 70, 0.3) !important;
    transform: translateY(-1px);
  }

  .skip-btn {
    opacity: 0.7;
  }

  .skip-btn:hover {
    opacity: 1;
  }

  .w-100 {
    width: 100% !important;
  }

  /* Mobile */
  @media screen and (max-width: 768px) {
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

    .prev-btn,
    .next-btn {
      min-width: 0 !important;
      flex: 1 !important;
    }
  }
</style>
