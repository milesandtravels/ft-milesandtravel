<template>
  <v-card-actions class="pa-0">
    <div class="modal-footer w-100">
      <v-divider />
      <div class="pa-6 pt-4">
        <!-- Disclaimer adicional -->
        <div class="disclaimer-section mb-4" v-if="!isMobile">
          <v-alert
            type="info"
            variant="tonal"
            density="compact"
            class="text-caption disclaimer-alert"
            :class="disclaimerClasses"
          >
            <template #prepend>
              <v-icon size="16">mdi-information-outline</v-icon>
            </template>
            <span class="disclaimer-text">
              Ao clicar em "Ver Produto", você será redirecionado para o site do
              parceiro.
            </span>
          </v-alert>
        </div>

        <!-- Botões de ação -->
        <v-row no-gutters class="w-100">
          <v-col cols="5">
            <v-btn
              variant="outlined"
              color="grey-darken-1"
              size="large"
              block
              @click="$emit('cancel')"
              class="text-body-2"
            >
              Cancelar
            </v-btn>
          </v-col>
          <v-col cols="7" class="ps-3">
            <v-btn
              color="primary"
              size="large"
              block
              @click="$emit('confirm')"
              class="text-body-2 font-weight-bold"
              elevation="0"
            >
              <v-icon start size="18">mdi-open-in-new</v-icon>
              Ver Produto
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-card-actions>
</template>

<script setup lang="ts">
  import { useDisplay } from 'vuetify'

  defineEmits<{
    cancel: []
    confirm: []
  }>()

  const { xs } = useDisplay()

  const isMobile = computed(() => xs.value)

  const disclaimerClasses = computed(() => ({
    'mobile-disclaimer': xs.value,
    'desktop-disclaimer': !xs.value,
  }))
</script>

<style scoped>
  .modal-footer {
    background-color: rgba(var(--v-theme-surface-variant), 0.1);
  }

  .disclaimer-section {
    opacity: 0;
    animation: slideInUp 0.4s ease-out 0.2s forwards;
  }

  .disclaimer-alert {
    border-radius: 8px !important;
    background-color: rgba(var(--v-theme-info), 0.08) !important;
  }

  .disclaimer-text {
    font-size: 0.75rem;
    line-height: 1.4;
    color: rgba(var(--v-theme-on-surface), 0.8);
  }

  /* Animações */
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Melhorias de acessibilidade */
  @media (prefers-reduced-motion: reduce) {
    .disclaimer-section {
      animation: none;
      opacity: 1;
    }
  }

  /* Suporte a modo escuro */
  @media (prefers-color-scheme: dark) {
    .disclaimer-text {
      color: rgba(var(--v-theme-on-surface), 0.9);
    }
  }
</style>
