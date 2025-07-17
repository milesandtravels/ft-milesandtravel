<template>
  <v-container
    :fluid="$vuetify.display.mobile"
    class="results-header-container"
  >
    <!-- Instruction Section -->
    <div v-if="showInstructions" class="instruction-section mb-6">
      <div
        class="instruction-header d-flex align-center justify-space-between mb-3"
      >
        <div class="d-flex align-center">
          <v-icon color="primary" size="28" class="mr-2">mdi-shopping</v-icon>
          <h2 class="instruction-title mb-0">
            Selecione os Produtos do Seu Perfil
          </h2>
        </div>
        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          color="medium-emphasis"
          class="close-btn"
          @click="closeInstructions"
        />
      </div>

      <p class="instruction-text text-medium-emphasis mb-4">
        Escolha todos os produtos que encaixam no seu perfil de compras para
        validarmos quais programas de pontos, cashbacks ou milhas trarão as
        melhores bonificações.
      </p>

      <div class="cta-section d-flex align-center">
        <v-icon color="success" size="18" class="mr-2">mdi-lightbulb-on</v-icon>
        <span class="cta-text">
          Após a seleção, clique em <strong>"Explorar Vantagens"</strong> para
          ver o comparativo completo das melhores opções.
        </span>
      </div>
    </div>

    <v-row no-gutters>
      <v-col cols="12">
        <!-- Mobile Header -->
        <div v-if="$vuetify.display.mobile" class="mobile-header">
          <div class="results-summary-mobile mb-3">
            <div class="d-flex justify-space-between align-center">
              <div class="results-info d-flex align-center">
                <v-icon color="primary" size="20" class="mr-2"
                  >mdi-package-variant</v-icon
                >
                <h3 class="text-h6 font-weight-bold text-truncate">
                  {{ resultsCount }} produto{{ resultsCount > 1 ? 's' : '' }}
                </h3>
              </div>
              <v-chip
                v-if="selectedCount > 0"
                color="success"
                size="small"
                variant="flat"
                class="selection-chip"
              >
                <v-icon start size="14">mdi-check-circle</v-icon>
                {{ selectedCount }}
              </v-chip>
            </div>

            <v-progress-linear
              v-if="resultsCount > 0"
              :model-value="(selectedCount / resultsCount) * 100"
              color="success"
              height="3"
              class="mt-2"
              rounded
            />
          </div>

          <div
            class="controls-mobile d-flex justify-space-between align-center"
          >
            <v-checkbox
              :model-value="selectAll"
              :indeterminate="isIndeterminate"
              color="primary"
              density="compact"
              hide-details
              class="select-all-mobile"
              @update:model-value="$emit('select-all', $event)"
            >
              <template #label>
                <span class="text-body-2 font-weight-medium">{{
                  selectAllLabel
                }}</span>
              </template>
            </v-checkbox>

            <div class="d-flex align-center ga-2">
              <v-btn
                v-if="selectedCount > 0 && !selectAll"
                color="error"
                variant="text"
                size="small"
                prepend-icon="mdi-close"
                @click="$emit('deselect-all')"
              >
                Limpar
              </v-btn>
              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                icon="mdi-filter-variant"
                @click="$emit('open-filter')"
              />
              <slot name="btn-filter" />
            </div>
          </div>
        </div>

        <!-- Desktop Header -->
        <div v-else class="desktop-header">
          <div class="results-summary-desktop mb-4">
            <div class="d-flex justify-space-between align-center">
              <div class="results-info d-flex align-center">
                <v-icon color="primary" size="24" class="mr-3"
                  >mdi-package-variant</v-icon
                >
                <div>
                  <h3 class="text-h5 font-weight-bold mb-1">
                    {{ resultsCount }} produto{{
                      resultsCount > 1 ? 's' : ''
                    }}
                    encontrado{{ resultsCount > 1 ? 's' : '' }}
                  </h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    {{ getResultsDescription }}
                  </p>
                </div>
              </div>

              <div class="selection-info d-flex align-center">
                <v-chip
                  v-if="selectedCount > 0"
                  color="success"
                  size="default"
                  variant="flat"
                  class="selection-counter mr-4"
                >
                  <v-icon start size="18">mdi-check-circle</v-icon>
                  {{ selectedCount }} selecionado{{
                    selectedCount > 1 ? 's' : ''
                  }}
                </v-chip>

                <v-progress-circular
                  v-if="resultsCount > 0"
                  :model-value="(selectedCount / resultsCount) * 100"
                  color="success"
                  size="40"
                  width="3"
                  class="mr-4"
                >
                  <span class="text-caption font-weight-bold">
                    {{ Math.round((selectedCount / resultsCount) * 100) }}%
                  </span>
                </v-progress-circular>
              </div>
            </div>
          </div>

          <div
            class="controls-desktop d-flex justify-space-between align-center"
          >
            <v-checkbox
              :model-value="selectAll"
              :indeterminate="isIndeterminate"
              color="primary"
              density="comfortable"
              hide-details
              class="select-all-desktop"
              @update:model-value="$emit('select-all', $event)"
            >
              <template #label>
                <span class="text-body-1 font-weight-medium">{{
                  selectAllLabel
                }}</span>
              </template>
            </v-checkbox>

            <div class="d-flex align-center ga-3">
              <v-btn
                v-if="selectedCount > 0 && !selectAll"
                color="error"
                variant="outlined"
                size="default"
                prepend-icon="mdi-close-circle"
                @click="$emit('deselect-all')"
              >
                Remover seleção
              </v-btn>

              <v-btn
                color="primary"
                variant="outlined"
                size="default"
                prepend-icon="mdi-filter-variant"
                @click="$emit('open-filter')"
              >
                Filtros
              </v-btn>

              <slot name="btn-filter" />
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  interface Props {
    resultsCount: number
    selectedCount: number
    selectAll: boolean
    isIndeterminate: boolean
  }

  interface Emits {
    (e: 'select-all', value: boolean): void
    (e: 'deselect-all'): void
    (e: 'open-filter'): void
    (e: 'close-instructions'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // Controle de exibição das instruções via localStorage
  const INSTRUCTIONS_STORAGE_KEY = 'bonus-purchase-instructions-dismissed'
  const instructionsDismissed = useLocalStorage(INSTRUCTIONS_STORAGE_KEY, false)
  const showInstructions = computed(() => !instructionsDismissed.value)

  const showCloseModal = ref(false)

  const closeInstructions = () => {
    instructionsDismissed.value = true
    showCloseModal.value = false
    emit('close-instructions')
  }

  const selectAllLabel = computed(() => {
    if (props.selectedCount === 0) return 'Selecionar todos'
    if (props.selectedCount === props.resultsCount) return 'Todos selecionados'
    return 'Selecionar todos'
  })

  const getResultsDescription = computed(() => {
    if (props.resultsCount === 0) return 'Nenhum produto encontrado'
    if (props.selectedCount === 0)
      return 'Selecione os produtos que encaixam no seu perfil'
    if (props.selectedCount === props.resultsCount)
      return 'Todos os produtos foram selecionados'
    return `${props.selectedCount} de ${props.resultsCount} produtos selecionados`
  })
</script>

<style scoped>
  .results-header-container {
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-surface), 1) 0%,
      rgba(var(--v-theme-surface), 0.98) 100%
    );
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06);
    margin-bottom: 0;
    padding-top: 20px;
    padding-bottom: 20px;
    position: relative;
  }

  .results-header-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      rgb(var(--v-theme-primary)),
      rgb(var(--v-theme-success))
    );
  }

  /* Instruction Section - Mobile First */
  .instruction-section {
    max-width: 100%;
    padding: 20px;
    background: rgba(var(--v-theme-primary), 0.02);
    border-radius: 12px;
    border: 1px solid rgba(var(--v-theme-primary), 0.08);
  }

  .instruction-header {
    align-items: flex-start;
  }

  .instruction-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: rgb(var(--v-theme-primary));
    line-height: 1.3;
    letter-spacing: -0.02em;
  }

  .instruction-text {
    font-size: 0.9375rem;
    line-height: 1.5;
    margin: 0;
    color: rgba(var(--v-theme-on-surface), 0.8);
  }

  .cta-section {
    background: rgba(var(--v-theme-success), 0.05);
    padding: 12px 16px;
    border-radius: 8px;
    border-left: 3px solid rgb(var(--v-theme-success));
  }

  .cta-text {
    font-size: 0.875rem;
    line-height: 1.4;
    color: rgba(var(--v-theme-on-surface), 0.9);
  }

  .mobile-header {
    padding: 0 4px;
  }

  .desktop-header {
    padding: 0 8px;
  }

  .results-summary-mobile,
  .results-summary-desktop {
    background: rgba(var(--v-theme-surface), 0.8);
    border-radius: 12px;
    padding: 16px;
    border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  }

  .results-info {
    flex-grow: 1;
  }

  .selection-chip,
  .selection-counter {
    animation: slideIn 0.3s ease-out;
    box-shadow: 0 2px 8px rgba(var(--v-theme-success), 0.2);
  }

  .controls-mobile,
  .controls-desktop {
    background: rgba(var(--v-theme-surface), 0.6);
    border-radius: 8px;
    padding: 12px 16px;
    border: 1px solid rgba(var(--v-theme-on-surface), 0.04);
  }

  .select-all-mobile {
    flex: 0 0 auto;
    max-width: 200px;
  }

  .select-all-desktop {
    flex: 0 0 auto;
  }

  /* Tablet adjustments */
  @media (min-width: 600px) and (max-width: 959px) {
    .instruction-section {
      max-width: 600px;
      padding: 24px;
      margin: 0 auto;
    }

    .instruction-title {
      font-size: 1.375rem;
    }

    .instruction-text {
      font-size: 1rem;
    }

    .cta-text {
      font-size: 0.9375rem;
    }
  }

  /* Desktop adjustments */
  @media (min-width: 960px) {
    .instruction-section {
      max-width: 900px;
      padding: 32px;
      margin: 0 auto 32px;
    }

    .instruction-title {
      font-size: 1.5rem;
    }

    .instruction-text {
      font-size: 1.0625rem;
    }

    .cta-text {
      font-size: 1rem;
    }

    .results-summary-desktop {
      padding: 20px;
    }

    .controls-desktop {
      padding: 16px 20px;
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Hover effects */
  .instruction-section:hover {
    border-color: rgba(var(--v-theme-primary), 0.12);
    transition: border-color 0.2s ease;
  }

  .results-summary-mobile:hover,
  .results-summary-desktop:hover {
    border-color: rgba(var(--v-theme-on-surface), 0.1);
    transition: border-color 0.2s ease;
  }

  .close-btn {
    opacity: 0.6;
    transition: opacity 0.2s ease;
  }

  .close-btn:hover {
    opacity: 1;
  }

  .confirmation-modal {
    border-radius: 16px;
    overflow: hidden;
  }

  .confirmation-modal .v-card-title {
    background: rgba(var(--v-theme-warning), 0.05);
    border-bottom: 1px solid rgba(var(--v-theme-warning), 0.1);
    padding: 20px 24px 16px;
  }

  .confirmation-modal .v-card-text {
    padding: 20px 24px;
    line-height: 1.5;
  }

  .confirmation-modal .v-card-actions {
    padding: 16px 24px 20px;
    background: rgba(var(--v-theme-surface), 0.5);
  }

  .notice-box {
    background: rgba(var(--v-theme-info), 0.05);
    border-radius: 8px;
    padding: 12px 16px;
    border-left: 3px solid rgb(var(--v-theme-info));
  }
</style>
