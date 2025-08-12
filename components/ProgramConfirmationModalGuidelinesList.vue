<template>
  <div class="guidelines-list">
    <div
      v-for="(guideline, index) in guidelines"
      :key="index"
      class="guideline-item"
      :class="itemClasses"
    >
      <div class="guideline-bullet" :class="bulletClasses">
        <v-icon color="primary" :size="iconSize">mdi-check-circle</v-icon>
      </div>
      <span class="guideline-text" :class="textClasses">{{ guideline }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useDisplay } from 'vuetify';

  interface Props {
    guidelines: string[]
  }

  defineProps<Props>()

  const { xs, sm } = useDisplay()

  const itemClasses = computed(() => ({
    'mobile-item': xs.value,
    'tablet-item': sm.value,
    'desktop-item': !xs.value && !sm.value
  }))

  const bulletClasses = computed(() => ({
    'mobile-bullet': xs.value,
    'tablet-bullet': sm.value,
    'desktop-bullet': !xs.value && !sm.value
  }))

  const textClasses = computed(() => ({
    'text-caption': xs.value,
    'text-body-2': !xs.value
  }))

  const iconSize = computed(() => xs.value ? 12 : 14)
</script>

<style scoped>
  .guidelines-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .guideline-item {
    display: flex;
    align-items: flex-start;
    padding: 12px 16px;
    background: rgba(var(--v-theme-surface-variant), 0.08);
    border-radius: 10px;
    border: 1px solid rgba(var(--v-theme-outline), 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .guideline-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.7) 100%);
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .guideline-bullet {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: rgba(var(--v-theme-primary), 0.1);
    border: 1px solid rgba(var(--v-theme-primary), 0.2);
    border-radius: 50%;
    margin-right: 12px;
    margin-top: 2px;
    flex-shrink: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .guideline-text {
    flex: 1;
    font-size: 0.875rem;
    line-height: 1.5;
    color: rgba(var(--v-theme-on-surface), 0.85);
    font-weight: 400;
    word-break: break-word;
  }

  /* Responsividade para mobile */
  .mobile-item {
    padding: 10px 12px;
    gap: 10px;
  }

  .mobile-bullet {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  .mobile-item .guideline-text {
    font-size: 0.8rem;
    line-height: 1.4;
  }

  /* Responsividade para tablet */
  .tablet-item {
    padding: 11px 14px;
  }

  .tablet-bullet {
    width: 22px;
    height: 22px;
    margin-right: 11px;
  }

  /* Desktop */
  .desktop-item {
    padding: 12px 16px;
  }

  .desktop-bullet {
    width: 24px;
    height: 24px;
    margin-right: 12px;
  }

  /* Estados de hover */
  .guideline-item:hover {
    background: rgba(var(--v-theme-surface-variant), 0.12);
    border-color: rgba(var(--v-theme-primary), 0.15);
    transform: translateX(4px);
  }

  .guideline-item:hover::before {
    opacity: 1;
  }

  .guideline-item:hover .guideline-bullet {
    background: rgba(var(--v-theme-primary), 0.15);
    border-color: rgba(var(--v-theme-primary), 0.3);
    transform: scale(1.1);
  }

  .guideline-item:hover .guideline-text {
    color: rgba(var(--v-theme-on-surface), 0.95);
  }

  /* Melhorias de acessibilidade */
  @media (prefers-reduced-motion: reduce) {
    .guideline-item,
    .guideline-bullet,
    .guideline-item::before {
      transition: none;
    }

    .guideline-item:hover {
      transform: none;
    }

    .guideline-item:hover .guideline-bullet {
      transform: none;
    }
  }

  /* Modo escuro */
  @media (prefers-color-scheme: dark) {
    .guideline-item {
      background: rgba(var(--v-theme-surface-bright), 0.05);
      border-color: rgba(var(--v-theme-outline), 0.04);
    }

    .guideline-item:hover {
      background: rgba(var(--v-theme-surface-bright), 0.08);
    }

    .guideline-text {
      color: rgba(var(--v-theme-on-surface), 0.8);
    }

    .guideline-item:hover .guideline-text {
      color: rgba(var(--v-theme-on-surface), 0.9);
    }
  }

  /* Animação de entrada */
  .guideline-item {
    animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
    transform: translateY(10px);
  }

  .guideline-item:nth-child(1) { animation-delay: 0.1s; }
  .guideline-item:nth-child(2) { animation-delay: 0.2s; }
  .guideline-item:nth-child(3) { animation-delay: 0.3s; }
  .guideline-item:nth-child(4) { animation-delay: 0.4s; }
  .guideline-item:nth-child(5) { animation-delay: 0.5s; }

  @keyframes slideInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
     .guideline-item {
       animation: none;
       opacity: 1;
       transform: none;
     }
   }
</style>
