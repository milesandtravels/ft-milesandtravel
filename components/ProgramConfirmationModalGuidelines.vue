<template>
  <div class="guidelines-section">
    <div class="guidelines-header" :class="headerClasses">
      <div class="header-icon-container">
        <v-icon color="primary" :size="iconSize">
          mdi-clipboard-check-outline
        </v-icon>
      </div>
      <h4 class="guidelines-title" :class="titleClasses">
        Por favor, atente-se às seguintes orientações:
      </h4>
    </div>

    <div class="guidelines-content" :class="contentClasses">
      <ProgramConfirmationModalGuidelinesList :guidelines="guidelines" />
    </div>

    <div class="disclaimer-wrapper" :class="disclaimerClasses">
      <DisclaimerNote 
        disclaimer-text="O Miles&Travels não se responsabiliza por alterações nas regras ou valores dos programas de fidelidade."
      />
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

  const headerClasses = computed(() => ({
    'mb-3': xs.value,
    'mb-4': !xs.value
  }))

  const iconSize = computed(() => xs.value ? 18 : 20)

  const titleClasses = computed(() => ({
    'text-subtitle-2': xs.value,
    'text-subtitle-1': !xs.value
  }))

  const contentClasses = computed(() => ({
    'mb-3': xs.value,
    'mb-4': !xs.value
  }))

  const disclaimerClasses = computed(() => ({
    'mt-3': xs.value,
    'mt-4': !xs.value
  }))
</script>

<style scoped>
  .guidelines-section {
    position: relative;
  }

  .guidelines-header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08) 0%, rgba(var(--v-theme-primary), 0.03) 100%);
    border-radius: 12px;
    border: 1px solid rgba(var(--v-theme-primary), 0.12);
    position: relative;
    overflow: hidden;
  }

  .guidelines-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.7) 100%);
  }

  .header-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(var(--v-theme-primary), 0.15);
    border: 2px solid rgba(var(--v-theme-primary), 0.25);
    border-radius: 50%;
    margin-right: 12px;
    flex-shrink: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .guidelines-title {
    font-weight: 600;
    margin-bottom: 0;
    color: rgba(var(--v-theme-on-surface), 0.9);
    line-height: 1.3;
    flex: 1;
  }

  .guidelines-content {
    background: rgba(var(--v-theme-surface-variant), 0.05);
    border-radius: 12px;
    padding: 20px;
    border: 1px solid rgba(var(--v-theme-outline), 0.08);
  }

  .disclaimer-wrapper {
    position: relative;
  }

  /* Responsividade para mobile */
  @media (max-width: 599px) {
    .guidelines-header {
      padding: 12px 16px;
      border-radius: 10px;
    }

    .header-icon-container {
      width: 36px;
      height: 36px;
      margin-right: 10px;
    }

    .guidelines-title {
      font-size: 0.9rem;
    }

    .guidelines-content {
      padding: 16px;
      border-radius: 10px;
    }
  }

  /* Responsividade para tablet */
  @media (min-width: 600px) and (max-width: 959px) {
    .guidelines-header {
      padding: 14px 18px;
    }

    .guidelines-content {
      padding: 18px;
    }
  }

  /* Estados de hover */
  .guidelines-header:hover {
    background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.12) 0%, rgba(var(--v-theme-primary), 0.05) 100%);
    border-color: rgba(var(--v-theme-primary), 0.2);
  }

  .guidelines-header:hover .header-icon-container {
    background: rgba(var(--v-theme-primary), 0.2);
    border-color: rgba(var(--v-theme-primary), 0.35);
    transform: scale(1.05);
  }

  /* Melhorias de acessibilidade */
  @media (prefers-reduced-motion: reduce) {
    .header-icon-container {
      transition: none;
    }

    .guidelines-header:hover .header-icon-container {
      transform: none;
    }
  }

  /* Modo escuro */
  @media (prefers-color-scheme: dark) {
    .guidelines-header {
      background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.06) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
      border-color: rgba(var(--v-theme-primary), 0.08);
    }

    .guidelines-content {
      background: rgba(var(--v-theme-surface-bright), 0.03);
      border-color: rgba(var(--v-theme-outline), 0.06);
    }

    .guidelines-header:hover {
      background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08) 0%, rgba(var(--v-theme-primary), 0.03) 100%);
    }
  }
</style>
