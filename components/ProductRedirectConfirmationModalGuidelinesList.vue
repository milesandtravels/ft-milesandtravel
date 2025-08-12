<template>
  <div class="guidelines-list">
    <div
      v-for="(guideline, index) in guidelines"
      :key="index"
      class="guideline-item"
      :class="itemClasses"
    >
      <div class="bullet-container" :class="bulletClasses">
        <v-icon color="primary" :size="iconSize"> mdi-check-circle </v-icon>
      </div>
      <p class="guideline-text" :class="textClasses">
        {{ guideline }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useDisplay } from 'vuetify'

  interface Props {
    guidelines: string[]
  }

  defineProps<Props>()

  const { xs, sm } = useDisplay()

  const itemClasses = computed(() => ({
    'mobile-item': xs.value,
    'tablet-item': sm.value,
    'desktop-item': !xs.value && !sm.value,
  }))

  const bulletClasses = computed(() => ({
    'mobile-bullet': xs.value,
    'tablet-bullet': sm.value,
    'desktop-bullet': !xs.value && !sm.value,
  }))

  const textClasses = computed(() => ({
    'text-caption': xs.value,
    'text-body-2': sm.value,
    'text-body-1': !xs.value && !sm.value,
  }))

  const iconSize = computed(() => (xs.value ? 16 : 18))
</script>

<style scoped>
  .guidelines-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .guideline-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(var(--v-theme-surface), 0.8);
    border: 1px solid rgba(var(--v-theme-outline), 0.12);
    border-radius: 10px;
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
    width: 2px;
    background: linear-gradient(
      180deg,
      rgb(var(--v-theme-primary)) 0%,
      rgba(var(--v-theme-primary), 0.6) 100%
    );
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .bullet-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: rgba(var(--v-theme-primary), 0.1);
    border: 1px solid rgba(var(--v-theme-primary), 0.2);
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 2px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .guideline-text {
    margin: 0;
    line-height: 1.5;
    color: rgba(var(--v-theme-on-surface), 0.8);
    flex: 1;
    font-weight: 400;
  }

  /* Estados de hover */
  .guideline-item:hover {
    background: rgba(var(--v-theme-surface), 1);
    border-color: rgba(var(--v-theme-primary), 0.25);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(var(--v-theme-shadow), 0.1);
  }

  .guideline-item:hover::before {
    opacity: 1;
  }

  .guideline-item:hover .bullet-container {
    background: rgba(var(--v-theme-primary), 0.15);
    border-color: rgba(var(--v-theme-primary), 0.3);
    transform: scale(1.1);
  }

  .guideline-item:hover .guideline-text {
    color: rgba(var(--v-theme-on-surface), 0.9);
  }

  /* Responsividade para mobile */
  .mobile-item {
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
  }

  .mobile-bullet {
    width: 20px;
    height: 20px;
  }

  .mobile-item .guideline-text {
    font-size: 0.8rem;
    line-height: 1.4;
  }

  /* Responsividade para tablet */
  .tablet-item {
    gap: 11px;
    padding: 11px 14px;
    border-radius: 9px;
  }

  .tablet-bullet {
    width: 22px;
    height: 22px;
  }

  /* Desktop */
  .desktop-item {
    border-radius: 12px;
  }

  .desktop-bullet {
    width: 26px;
    height: 26px;
  }

  /* Animações de entrada */
  .guideline-item {
    animation: slideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
    transform: translateX(-20px);
  }

  .guideline-item:nth-child(1) {
    animation-delay: 0.1s;
  }
  .guideline-item:nth-child(2) {
    animation-delay: 0.2s;
  }
  .guideline-item:nth-child(3) {
    animation-delay: 0.3s;
  }
  .guideline-item:nth-child(4) {
    animation-delay: 0.4s;
  }
  .guideline-item:nth-child(5) {
    animation-delay: 0.5s;
  }

  @keyframes slideInLeft {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Melhorias de acessibilidade */
  @media (prefers-reduced-motion: reduce) {
    .guideline-item {
      animation: none;
      opacity: 1;
      transform: none;
      transition: none;
    }

    .guideline-item:hover {
      transform: none;
    }

    .guideline-item:hover .bullet-container {
      transform: none;
    }
  }

  /* Modo escuro */
  @media (prefers-color-scheme: dark) {
    .guideline-item {
      background: rgba(var(--v-theme-surface), 0.6);
      border-color: rgba(var(--v-theme-outline), 0.08);
    }

    .guideline-item:hover {
      background: rgba(var(--v-theme-surface), 0.8);
      border-color: rgba(var(--v-theme-primary), 0.2);
    }

    .guideline-text {
      color: rgba(var(--v-theme-on-surface), 0.75);
    }

    .guideline-item:hover .guideline-text {
      color: rgba(var(--v-theme-on-surface), 0.85);
    }
  }

  /* Ajustes para mobile */
  @media (max-width: 600px) {
    .guidelines-list {
      gap: 10px;
    }
  }
</style>
