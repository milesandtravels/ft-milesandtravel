<template>
  <v-card-title class="modal-header" :class="headerClasses">
    <div class="header-content">
      <div class="header-icon-container" :class="iconContainerClasses">
        <v-icon color="warning" :size="iconSize" class="header-icon">
          mdi-alert-circle-outline
        </v-icon>
      </div>
      <div class="header-text">
        <h3 class="header-title" :class="titleClasses">
          Atenção: Link de Referência
        </h3>
        <p class="header-subtitle" :class="subtitleClasses">
          Importante ler antes de prosseguir
        </p>
      </div>
    </div>
  </v-card-title>
</template>

<script setup lang="ts">
  import { useDisplay } from 'vuetify'

  const { xs, sm } = useDisplay()

  const headerClasses = computed(() => ({
    'pa-3': xs.value,
    'pa-5': sm.value,
    'pa-6': !xs.value && !sm.value,
    'pb-2': xs.value,
    'pb-3': !xs.value,
  }))

  const iconContainerClasses = computed(() => ({
    'mobile-icon-container': xs.value,
    'tablet-icon-container': sm.value,
    'desktop-icon-container': !xs.value && !sm.value,
  }))

  const titleClasses = computed(() => ({
    'text-h6': xs.value,
    'text-h5': !xs.value,
  }))

  const subtitleClasses = computed(() => ({
    'text-caption': xs.value,
    'text-body-2': !xs.value,
  }))

  const iconSize = computed(() => (xs.value ? 24 : 28))
</script>

<style scoped>
  .modal-header {
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-warning), 0.08) 0%,
      rgba(var(--v-theme-warning), 0.04) 100%
    );
    border-bottom: 1px solid rgba(var(--v-theme-outline), 0.08);
    position: relative;
    overflow: hidden;
  }

  .modal-header::before {
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
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
  }

  .header-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: rgba(var(--v-theme-warning), 0.12);
    border: 1px solid rgba(var(--v-theme-warning), 0.25);
    border-radius: 50%;
    flex-shrink: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .mobile-icon-container {
    width: 40px;
    height: 40px;
  }

  .tablet-icon-container {
    width: 44px;
    height: 44px;
  }

  .desktop-icon-container {
    width: 48px;
    height: 48px;
  }

  .header-icon {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .header-text {
    flex: 1;
    min-width: 0;
  }

  .header-title {
    font-weight: 600;
    color: rgba(var(--v-theme-on-surface), 0.9);
    margin: 0;
    line-height: 1.2;
  }

  .header-subtitle {
    color: rgba(var(--v-theme-on-surface), 0.7);
    margin: 4px 0 0 0;
    line-height: 1.3;
  }

  /* Estados de hover */
  .modal-header:hover .header-icon-container {
    background: rgba(var(--v-theme-warning), 0.18);
    border-color: rgba(var(--v-theme-warning), 0.35);
    transform: scale(1.05);
  }

  .modal-header:hover .header-icon {
    transform: rotate(15deg);
  }

  /* Melhorias de acessibilidade */
  @media (prefers-reduced-motion: reduce) {
    .header-icon-container,
    .header-icon {
      transition: none;
    }

    .modal-header:hover .header-icon-container {
      transform: none;
    }

    .modal-header:hover .header-icon {
      transform: none;
    }
  }

  /* Modo escuro */
  @media (prefers-color-scheme: dark) {
    .modal-header {
      background: linear-gradient(
        135deg,
        rgba(var(--v-theme-warning), 0.06) 0%,
        rgba(var(--v-theme-warning), 0.03) 100%
      );
      border-bottom-color: rgba(var(--v-theme-outline), 0.06);
    }

    .header-title {
      color: rgba(var(--v-theme-on-surface), 0.85);
    }

    .header-subtitle {
      color: rgba(var(--v-theme-on-surface), 0.65);
    }
  }

  /* Responsividade para mobile */
  @media (max-width: 600px) {
    .modal-header {
      padding: 12px 16px 8px 16px !important;
      min-height: auto;
    }

    .header-content {
      gap: 10px;
    }

    .header-title {
      font-size: 1.05rem;
      line-height: 1.3;
    }

    .header-subtitle {
      font-size: 0.75rem;
      margin-top: 2px !important;
    }

    .mobile-icon-container {
      width: 36px;
      height: 36px;
    }
  }
</style>
