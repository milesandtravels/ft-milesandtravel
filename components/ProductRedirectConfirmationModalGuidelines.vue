<template>
  <div class="guidelines-section">
    <div class="guidelines-header" :class="headerClasses">
      <div class="header-icon-container">
        <v-icon color="primary" :size="iconSize">
          mdi-clipboard-list-outline
        </v-icon>
      </div>
      <h4 class="guidelines-title" :class="titleClasses">
        Orientações importantes para uso do link:
      </h4>
    </div>

    <div class="guidelines-content" :class="contentClasses">
      <ProductRedirectConfirmationModalGuidelinesList
        :guidelines="guidelines"
      />
    </div>

    <div class="disclaimer-wrapper" :class="disclaimerClasses">
      <DisclaimerNote
        disclaimer-text="O Miles&Travels utiliza a API do Google para buscar produtos. Alguns links podem não redirecionar diretamente para o marketplace correto. Este serviço é fornecido apenas como referência."
      />
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

  const headerClasses = computed(() => ({
    'mb-3': xs.value,
    'mb-4': !xs.value,
  }))

  const iconSize = computed(() => (xs.value ? 18 : 20))

  const titleClasses = computed(() => ({
    'text-subtitle-2': xs.value,
    'text-subtitle-1': !xs.value,
  }))

  const contentClasses = computed(() => ({
    'mb-3': xs.value,
    'mb-4': !xs.value,
  }))

  const disclaimerClasses = computed(() => ({
    'mt-3': xs.value,
    'mt-4': !xs.value,
  }))
</script>

<style scoped>
  .guidelines-section {
    position: relative;
  }

  .guidelines-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-primary), 0.08) 0%,
      rgba(var(--v-theme-primary), 0.04) 100%
    );
    border: 1px solid rgba(var(--v-theme-primary), 0.15);
    border-radius: 12px;
    position: relative;
    overflow: hidden;
  }

  .guidelines-header::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(
      180deg,
      rgb(var(--v-theme-primary)) 0%,
      rgba(var(--v-theme-primary), 0.7) 100%
    );
    border-radius: 0 2px 2px 0;
  }

  .header-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgba(var(--v-theme-primary), 0.12);
    border: 1px solid rgba(var(--v-theme-primary), 0.25);
    border-radius: 50%;
    flex-shrink: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .guidelines-title {
    font-weight: 600;
    color: rgba(var(--v-theme-on-surface), 0.9);
    margin: 0;
    line-height: 1.3;
    flex: 1;
  }

  .guidelines-content {
    margin-top: 16px;
  }

  /* Estados de hover */
  .guidelines-header:hover {
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-primary), 0.12) 0%,
      rgba(var(--v-theme-primary), 0.06) 100%
    );
    border-color: rgba(var(--v-theme-primary), 0.25);
    transform: translateY(-2px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .guidelines-header:hover .header-icon-container {
    background: rgba(var(--v-theme-primary), 0.18);
    border-color: rgba(var(--v-theme-primary), 0.35);
    transform: scale(1.05);
  }

  /* Melhorias de acessibilidade */
  @media (prefers-reduced-motion: reduce) {
    .guidelines-header,
    .header-icon-container {
      transition: none;
    }

    .guidelines-header:hover {
      transform: none;
    }

    .guidelines-header:hover .header-icon-container {
      transform: none;
    }
  }

  /* Modo escuro */
  @media (prefers-color-scheme: dark) {
    .guidelines-header {
      background: linear-gradient(
        135deg,
        rgba(var(--v-theme-primary), 0.06) 0%,
        rgba(var(--v-theme-primary), 0.03) 100%
      );
      border-color: rgba(var(--v-theme-primary), 0.12);
    }

    .guidelines-header:hover {
      background: linear-gradient(
        135deg,
        rgba(var(--v-theme-primary), 0.1) 0%,
        rgba(var(--v-theme-primary), 0.05) 100%
      );
    }

    .guidelines-title {
      color: rgba(var(--v-theme-on-surface), 0.85);
    }
  }

  /* Responsividade para mobile */
  @media (max-width: 600px) {
    .guidelines-header {
      padding: 12px 16px;
      gap: 10px;
      border-radius: 10px;
    }

    .header-icon-container {
      width: 28px;
      height: 28px;
    }

    .guidelines-title {
      font-size: 0.9rem;
    }

    .guidelines-content {
      margin-top: 12px;
    }
  }
</style>
