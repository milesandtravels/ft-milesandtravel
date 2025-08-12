<template>
  <div class="disclaimer-note" :class="containerClasses">
    <div class="disclaimer-icon-wrapper" :class="iconWrapperClasses">
      <v-icon color="warning" :size="iconSize" class="disclaimer-icon"
        >mdi-alert-circle-outline</v-icon
      >
    </div>
    <span class="disclaimer-text" :class="textClasses">
      {{ disclaimerText }}
    </span>
  </div>
</template>

<script setup lang="ts">
  import { useDisplay } from 'vuetify'

  interface Props {
    disclaimerText: string
  }

  defineProps<Props>()

  const { xs, sm } = useDisplay()

  const containerClasses = computed(() => ({
    'mobile-disclaimer': xs.value,
    'tablet-disclaimer': sm.value,
    'desktop-disclaimer': !xs.value && !sm.value,
  }))

  const iconWrapperClasses = computed(() => ({
    'mobile-icon-wrapper': xs.value,
    'tablet-icon-wrapper': sm.value,
    'desktop-icon-wrapper': !xs.value && !sm.value,
  }))

  const textClasses = computed(() => ({
    'text-caption': xs.value,
    'text-body-2': !xs.value,
  }))

  const iconSize = computed(() => (xs.value ? 14 : 16))
</script>

<style scoped>
  .disclaimer-note {
    display: flex;
    align-items: flex-start;
    padding: 16px;
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-warning), 0.08) 0%,
      rgba(var(--v-theme-warning), 0.04) 100%
    );
    border: 1px solid rgba(var(--v-theme-warning), 0.15);
    border-radius: 12px;
    margin-top: 20px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
  }

  .disclaimer-note::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(
      180deg,
      rgb(var(--v-theme-warning)) 0%,
      rgba(var(--v-theme-warning), 0.7) 100%
    );
    border-radius: 0 2px 2px 0;
  }

  .disclaimer-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgba(var(--v-theme-warning), 0.12);
    border: 1px solid rgba(var(--v-theme-warning), 0.25);
    border-radius: 50%;
    margin-right: 12px;
    margin-top: 2px;
    flex-shrink: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .disclaimer-icon {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .disclaimer-text {
    font-size: 0.8rem;
    line-height: 1.5;
    color: rgba(var(--v-theme-on-surface), 0.75);
    flex: 1;
    font-weight: 400;
    word-break: break-word;
  }

  /* Responsividade para mobile */
  .mobile-disclaimer {
    padding: 12px 14px;
    margin-top: 16px;
    border-radius: 10px;
  }

  .mobile-icon-wrapper {
    width: 28px;
    height: 28px;
    margin-right: 10px;
  }

  .mobile-disclaimer .disclaimer-text {
    font-size: 0.75rem;
    line-height: 1.4;
  }

  /* Responsividade para tablet */
  .tablet-disclaimer {
    padding: 14px 15px;
    margin-top: 18px;
    border-radius: 11px;
  }

  .tablet-icon-wrapper {
    width: 30px;
    height: 30px;
    margin-right: 11px;
  }

  /* Desktop */
  .desktop-disclaimer {
    padding: 16px;
    margin-top: 20px;
    border-radius: 12px;
  }

  .desktop-icon-wrapper {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }

  /* Estados de hover */
  .disclaimer-note:hover {
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-warning), 0.12) 0%,
      rgba(var(--v-theme-warning), 0.06) 100%
    );
    border-color: rgba(var(--v-theme-warning), 0.25);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(var(--v-theme-warning), 0.15);
  }

  .disclaimer-note:hover .disclaimer-icon-wrapper {
    background: rgba(var(--v-theme-warning), 0.18);
    border-color: rgba(var(--v-theme-warning), 0.35);
    transform: scale(1.05);
  }

  .disclaimer-note:hover .disclaimer-icon {
    transform: rotate(15deg);
  }

  .disclaimer-note:hover .disclaimer-text {
    color: rgba(var(--v-theme-on-surface), 0.85);
  }

  /* Melhorias de acessibilidade */
  @media (prefers-reduced-motion: reduce) {
    .disclaimer-note,
    .disclaimer-icon-wrapper,
    .disclaimer-icon {
      transition: none;
    }

    .disclaimer-note:hover {
      transform: none;
    }

    .disclaimer-note:hover .disclaimer-icon-wrapper {
      transform: none;
    }

    .disclaimer-note:hover .disclaimer-icon {
      transform: none;
    }
  }

  /* Modo escuro */
  @media (prefers-color-scheme: dark) {
    .disclaimer-note {
      background: linear-gradient(
        135deg,
        rgba(var(--v-theme-warning), 0.06) 0%,
        rgba(var(--v-theme-warning), 0.03) 100%
      );
      border-color: rgba(var(--v-theme-warning), 0.12);
    }

    .disclaimer-note:hover {
      background: linear-gradient(
        135deg,
        rgba(var(--v-theme-warning), 0.1) 0%,
        rgba(var(--v-theme-warning), 0.05) 100%
      );
    }

    .disclaimer-text {
      color: rgba(var(--v-theme-on-surface), 0.7);
    }

    .disclaimer-note:hover .disclaimer-text {
      color: rgba(var(--v-theme-on-surface), 0.8);
    }
  }

  /* Animação de entrada */
  .disclaimer-note {
    animation: slideInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
    transform: translateY(15px);
  }

  @keyframes slideInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .disclaimer-note {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
</style>
