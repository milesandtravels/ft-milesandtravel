<template>
  <div class="alerts-container" :class="containerClasses">
    <!-- Aviso principal de redirecionamento -->
    <v-alert
      color="warning"
      variant="tonal"
      :density="alertDensity"
      class="primary-alert"
      :class="alertClasses"
      border="start"
      border-color="warning"
    >
      <template #prepend>
        <div class="alert-icon-container warning">
          <v-icon :size="iconSize">mdi-information-outline</v-icon>
        </div>
      </template>
      <div class="alert-content">
        <h4 class="alert-title" :class="titleClasses">
          Importante: Redirecionamento para {{ programName }}
        </h4>
        <p class="alert-text" :class="textClasses">
          Você será redirecionado para o site oficial do programa. Certifique-se de seguir todas as regras para garantir o recebimento da bonificação.
        </p>
      </div>
    </v-alert>

    <!-- Aviso sobre possíveis problemas de redirecionamento -->
    <v-alert
      color="info"
      variant="tonal"
      :density="alertDensity"
      class="secondary-alert"
      :class="alertClasses"
      border="start"
      border-color="info"
    >
      <template #prepend>
        <div class="alert-icon-container info">
          <v-icon :size="iconSize">mdi-alert-circle-outline</v-icon>
        </div>
      </template>
      <div class="alert-content">
        <h4 class="alert-title" :class="titleClasses">
          Atenção: Redirecionamento Manual
        </h4>
        <p class="alert-text" :class="textClasses">
          Em alguns casos, pode não ser possível redirecionar automaticamente para a loja parceira. Se isso acontecer, busque manualmente a loja dentro do programa {{ programName }} para garantir a bonificação.
        </p>
      </div>
    </v-alert>
  </div>
</template>

<script setup lang="ts">
  import { useDisplay } from 'vuetify';

  interface Props {
    programName: string
  }

  defineProps<Props>()

  const { xs, sm } = useDisplay()

  const containerClasses = computed(() => ({
    'mb-4': xs.value,
    'mb-5': !xs.value
  }))

  const alertClasses = computed(() => ({
    'mb-3': true
  }))

  const alertDensity = computed(() => xs.value ? 'compact' : 'comfortable')

  const iconSize = computed(() => xs.value ? 18 : 20)

  const titleClasses = computed(() => ({
    'text-subtitle-2': xs.value,
    'text-subtitle-1': !xs.value
  }))

  const textClasses = computed(() => ({
    'text-caption': xs.value,
    'text-body-2': !xs.value
  }))
</script>

<style scoped>
  .alerts-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .primary-alert {
    background: linear-gradient(135deg, rgba(var(--v-theme-warning), 0.08) 0%, rgba(var(--v-theme-warning), 0.03) 100%);
    border-radius: 12px;
    border-left-width: 4px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    position: relative;
  }

  .secondary-alert {
    background: linear-gradient(135deg, rgba(var(--v-theme-info), 0.08) 0%, rgba(var(--v-theme-info), 0.03) 100%);
    border-radius: 12px;
    border-left-width: 4px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    position: relative;
  }

  .alert-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
  }

  .alert-icon-container.warning {
    background: rgba(var(--v-theme-warning), 0.15);
    border: 2px solid rgba(var(--v-theme-warning), 0.25);
  }

  .alert-icon-container.info {
    background: rgba(var(--v-theme-info), 0.15);
    border: 2px solid rgba(var(--v-theme-info), 0.25);
  }

  .alert-content {
    flex: 1;
    min-width: 0;
  }

  .alert-title {
    font-weight: 600;
    margin-bottom: 6px;
    color: rgba(var(--v-theme-on-surface), 0.9);
    line-height: 1.3;
    word-break: break-word;
  }

  .alert-text {
    margin-bottom: 0;
    color: rgba(var(--v-theme-on-surface), 0.75);
    line-height: 1.5;
    word-break: break-word;
  }

  /* Responsividade para mobile */
  @media (max-width: 599px) {
    .alerts-container {
      gap: 10px;
    }

    .primary-alert,
    .secondary-alert {
      border-radius: 10px;
      padding: 14px 16px;
    }

    .alert-icon-container {
      width: 32px;
      height: 32px;
    }

    .alert-title {
      font-size: 0.9rem;
      margin-bottom: 4px;
    }

    .alert-text {
      font-size: 0.8rem;
      line-height: 1.4;
    }
  }

  /* Responsividade para tablet */
  @media (min-width: 600px) and (max-width: 959px) {
    .primary-alert,
    .secondary-alert {
      padding: 16px 20px;
    }
  }

  /* Desktop */
  @media (min-width: 960px) {
    .primary-alert,
    .secondary-alert {
      padding: 18px 24px;
    }
  }

  /* Estados de hover */
  .primary-alert:hover {
    background: linear-gradient(135deg, rgba(var(--v-theme-warning), 0.12) 0%, rgba(var(--v-theme-warning), 0.05) 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(var(--v-theme-warning), 0.15);
  }

  .secondary-alert:hover {
    background: linear-gradient(135deg, rgba(var(--v-theme-info), 0.12) 0%, rgba(var(--v-theme-info), 0.05) 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(var(--v-theme-info), 0.15);
  }

  .primary-alert:hover .alert-icon-container.warning {
    background: rgba(var(--v-theme-warning), 0.2);
    border-color: rgba(var(--v-theme-warning), 0.35);
    transform: scale(1.05);
  }

  .secondary-alert:hover .alert-icon-container.info {
    background: rgba(var(--v-theme-info), 0.2);
    border-color: rgba(var(--v-theme-info), 0.35);
    transform: scale(1.05);
  }

  /* Melhorias de acessibilidade */
  @media (prefers-reduced-motion: reduce) {
    .primary-alert,
    .secondary-alert,
    .alert-icon-container {
      transition: none;
    }

    .primary-alert:hover,
    .secondary-alert:hover {
      transform: none;
    }

    .primary-alert:hover .alert-icon-container.warning,
    .secondary-alert:hover .alert-icon-container.info {
      transform: none;
    }
  }

  /* Modo escuro */
  @media (prefers-color-scheme: dark) {
    .primary-alert {
      background: linear-gradient(135deg, rgba(var(--v-theme-warning), 0.06) 0%, rgba(var(--v-theme-warning), 0.02) 100%);
    }

    .secondary-alert {
      background: linear-gradient(135deg, rgba(var(--v-theme-info), 0.06) 0%, rgba(var(--v-theme-info), 0.02) 100%);
    }

    .primary-alert:hover {
      background: linear-gradient(135deg, rgba(var(--v-theme-warning), 0.08) 0%, rgba(var(--v-theme-warning), 0.03) 100%);
    }

    .secondary-alert:hover {
      background: linear-gradient(135deg, rgba(var(--v-theme-info), 0.08) 0%, rgba(var(--v-theme-info), 0.03) 100%);
    }
  }

  /* Estados de foco para acessibilidade */
  .primary-alert:focus-within,
  .secondary-alert:focus-within {
    outline: 2px solid rgb(var(--v-theme-primary));
    outline-offset: 2px;
  }
</style>
