<template>
  <v-card-title class="pa-0">
    <div class="modal-header">
      <div class="header-content" :class="headerClasses">
        <div class="warning-icon-container" :class="iconClasses">
          <v-icon color="warning" :size="iconSize">mdi-alert-circle</v-icon>
        </div>
        <div class="flex-grow-1 header-text">
          <h2 class="header-title" :class="titleClasses">
            Atenção - Regras do Programa
          </h2>
          <p class="header-subtitle" :class="subtitleClasses">
            Leia as orientações antes de prosseguir
          </p>
        </div>
      </div>
      <v-divider class="header-divider" />
    </div>
  </v-card-title>
</template>

<script setup lang="ts">
  import { useDisplay } from 'vuetify';

  const { xs, sm } = useDisplay()

  const headerClasses = computed(() => ({
    'pa-4 pb-3': xs.value,
    'pa-5 pb-4': sm.value,
    'pa-6 pb-4': !xs.value && !sm.value
  }))

  const iconClasses = computed(() => ({
    'mr-3': xs.value,
    'mr-4': !xs.value
  }))

  const iconSize = computed(() => xs.value ? 20 : 24)

  const titleClasses = computed(() => ({
    'text-subtitle-1': xs.value,
    'text-h6': !xs.value
  }))

  const subtitleClasses = computed(() => ({
    'text-caption': xs.value,
    'text-body-2': !xs.value
  }))
</script>

<style scoped>
  .modal-header {
    width: 100%;
    background: linear-gradient(135deg, rgba(var(--v-theme-surface), 1) 0%, rgba(var(--v-theme-surface-variant), 0.1) 100%);
  }

  .header-content {
    display: flex;
    align-items: center;
    position: relative;
  }

  .warning-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, rgba(var(--v-theme-warning), 0.15) 0%, rgba(var(--v-theme-warning), 0.05) 100%);
    border-radius: 50%;
    border: 2px solid rgba(var(--v-theme-warning), 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
  }

  .header-text {
    min-width: 0;
  }

  .header-title {
    font-weight: 700;
    margin-bottom: 4px;
    color: rgba(var(--v-theme-on-surface), 0.95);
    line-height: 1.3;
  }

  .header-subtitle {
    margin-bottom: 0;
    color: rgba(var(--v-theme-on-surface), 0.7);
    line-height: 1.4;
  }

  .header-divider {
    opacity: 0.12;
  }

  /* Responsividade para mobile */
  @media (max-width: 599px) {
    .warning-icon-container {
      width: 40px;
      height: 40px;
    }

    .header-title {
      font-size: 1.1rem;
    }

    .header-subtitle {
      font-size: 0.8rem;
    }
  }

  /* Melhorias de acessibilidade */
  @media (prefers-reduced-motion: reduce) {
    .warning-icon-container {
      transition: none;
    }
  }

  /* Modo escuro */
  @media (prefers-color-scheme: dark) {
    .modal-header {
      background: linear-gradient(135deg, rgba(var(--v-theme-surface), 1) 0%, rgba(var(--v-theme-surface-bright), 0.05) 100%);
    }
  }
</style>
