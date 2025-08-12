<template>
  <div class="alerts-container" :class="containerClasses">
    <!-- Alerta Principal de Aviso -->
    <v-alert
      type="error"
      variant="tonal"
      :density="alertDensity"
      class="main-alert"
      :class="alertClasses"
      prominent
    >
      <template v-slot:prepend>
        <v-icon :size="iconSize">mdi-alert-octagon</v-icon>
      </template>

      <div class="alert-content">
        <h4 class="alert-title" :class="titleClasses">
          NÃO COMPRE ATRAVÉS DESTE LINK!
        </h4>
        <p class="alert-text" :class="textClasses">
          Este é apenas um <strong>link de referência</strong> para você
          visualizar detalhes, fotos e informações do produto. Se você fizer a
          compra através deste link,
          <strong>NÃO receberá nenhuma bonificação</strong> (pontos, milhas ou
          cashback).
        </p>
      </div>
    </v-alert>

    <!-- Alerta Informativo -->
    <v-alert
      type="warning"
      variant="tonal"
      :density="alertDensity"
      class="info-alert"
      :class="alertClasses"
    >
      <template v-slot:prepend>
        <v-icon :size="iconSize">mdi-information-outline</v-icon>
      </template>

      <div class="alert-content">
        <h4 class="alert-title" :class="titleClasses">
          Como garantir sua bonificação:
        </h4>
        <p class="alert-text" :class="textClasses">
          Para receber pontos, milhas ou cashback, você deve acessar o
          marketplace através do
          <strong>programa de fidelidade oficial</strong>. Use este link apenas
          para ver detalhes do produto.
        </p>
      </div>
    </v-alert>

    <!-- Alerta sobre Limitações -->
    <v-alert
      type="info"
      variant="tonal"
      :density="alertDensity"
      class="limitation-alert"
      :class="alertClasses"
    >
      <template v-slot:prepend>
        <v-icon :size="iconSize">mdi-alert-circle-outline</v-icon>
      </template>

      <div class="alert-content">
        <h4 class="alert-title" :class="titleClasses">
          Limitações do sistema:
        </h4>
        <p class="alert-text" :class="textClasses">
          Alguns produtos como <strong>bebidas alcoólicas</strong> ou
          <strong>itens +18 anos</strong> podem não ter links disponíveis.
          Nestes casos, busque o produto diretamente no marketplace através do
          programa de fidelidade.
        </p>
      </div>
    </v-alert>
  </div>
</template>

<script setup lang="ts">
  import { useDisplay } from 'vuetify'

  const { xs, sm } = useDisplay()

  const containerClasses = computed(() => ({
    'mb-4': xs.value,
    'mb-5': sm.value,
    'mb-6': !xs.value && !sm.value,
  }))

  const alertClasses = computed(() => ({
    'mobile-alert': xs.value,
    'tablet-alert': sm.value,
    'desktop-alert': !xs.value && !sm.value,
  }))

  const alertDensity = computed(() => (xs.value ? 'compact' : 'default'))

  const iconSize = computed(() => (xs.value ? 20 : 24))

  const titleClasses = computed(() => ({
    'text-subtitle-2': xs.value,
    'text-subtitle-1': !xs.value,
  }))

  const textClasses = computed(() => ({
    'text-caption': xs.value,
    'text-body-2': !xs.value,
  }))
</script>

<style scoped>
  .alerts-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .main-alert {
    border-left: 4px solid rgb(var(--v-theme-error)) !important;
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-error), 0.08) 0%,
      rgba(var(--v-theme-error), 0.04) 100%
    ) !important;
  }

  .info-alert {
    border-left: 4px solid rgb(var(--v-theme-warning)) !important;
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-warning), 0.08) 0%,
      rgba(var(--v-theme-warning), 0.04) 100%
    ) !important;
  }

  .limitation-alert {
    border-left: 4px solid rgb(var(--v-theme-info)) !important;
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-info), 0.08) 0%,
      rgba(var(--v-theme-info), 0.04) 100%
    ) !important;
  }

  .alert-content {
    width: 100%;
  }

  .alert-title {
    font-weight: 700;
    margin: 0 0 8px 0;
    line-height: 1.3;
    color: rgba(var(--v-theme-on-surface), 0.9);
  }

  .alert-text {
    margin: 0;
    line-height: 1.5;
    color: rgba(var(--v-theme-on-surface), 0.8);
  }

  /* Responsividade para mobile */
  .mobile-alert {
    border-radius: 8px;
  }

  .mobile-alert .alert-title {
    font-size: 0.9rem;
    margin-bottom: 6px;
  }

  .mobile-alert .alert-text {
    font-size: 0.8rem;
    line-height: 1.4;
  }

  /* Responsividade para tablet */
  .tablet-alert {
    border-radius: 10px;
  }

  /* Desktop */
  .desktop-alert {
    border-radius: 12px;
  }

  /* Animações de entrada */
  .main-alert {
    animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.1s;
    opacity: 0;
    transform: translateY(10px);
  }

  .info-alert {
    animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.2s;
    opacity: 0;
    transform: translateY(10px);
  }

  .limitation-alert {
    animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.3s;
    opacity: 0;
    transform: translateY(10px);
  }

  @keyframes slideInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Estados de hover */
  .v-alert:hover {
    transform: translateY(-2px);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Melhorias de acessibilidade */
  @media (prefers-reduced-motion: reduce) {
    .main-alert,
    .info-alert,
    .limitation-alert {
      animation: none;
      opacity: 1;
      transform: none;
    }

    .v-alert:hover {
      transform: none;
    }
  }

  /* Modo escuro */
  @media (prefers-color-scheme: dark) {
    .main-alert {
      background: linear-gradient(
        135deg,
        rgba(var(--v-theme-error), 0.06) 0%,
        rgba(var(--v-theme-error), 0.03) 100%
      ) !important;
    }

    .info-alert {
      background: linear-gradient(
        135deg,
        rgba(var(--v-theme-warning), 0.06) 0%,
        rgba(var(--v-theme-warning), 0.03) 100%
      ) !important;
    }

    .limitation-alert {
      background: linear-gradient(
        135deg,
        rgba(var(--v-theme-info), 0.06) 0%,
        rgba(var(--v-theme-info), 0.03) 100%
      ) !important;
    }

    .alert-title {
      color: rgba(var(--v-theme-on-surface), 0.85);
    }

    .alert-text {
      color: rgba(var(--v-theme-on-surface), 0.75);
    }
  }

  /* Ajustes para mobile */
  @media (max-width: 600px) {
    .alerts-container {
      gap: 12px;
    }
  }
</style>
