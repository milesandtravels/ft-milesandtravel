<template>
  <v-container
    :fluid="$vuetify.display.mobile"
    class="results-header-container"
  >
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Mobile Header -->
        <div v-if="$vuetify.display.mobile" class="mobile-header">
          <div class="d-flex justify-space-between align-center mb-3">
            <h3 class="text-h6 font-weight-bold text-truncate">
              {{ resultsCount }} produto{{ resultsCount > 1 ? 's' : '' }}
            </h3>
            <v-chip
              v-if="selectedCount > 0"
              color="primary"
              size="small"
              variant="flat"
              class="ml-2"
            >
              {{ selectedCount }}
            </v-chip>
          </div>

          <div class="d-flex justify-space-between align-center">
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
                <span class="text-body-2">{{ selectAllLabel }}</span>
              </template>
            </v-checkbox>

            <div class="d-flex align-center ga-2">
              <v-btn
                v-if="selectedCount > 0 && !selectAll"
                color="error"
                variant="text"
                size="small"
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
            </div>
          </div>
        </div>

        <!-- Desktop Header -->
        <div v-else class="desktop-header">
          <div class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <h3 class="text-h5 font-weight-bold mr-4">
                {{ resultsCount }} produto{{
                  resultsCount > 1 ? 's' : ''
                }}
                encontrado{{ resultsCount > 1 ? 's' : '' }}
              </h3>
              <v-chip
                v-if="selectedCount > 0"
                color="primary"
                size="default"
                variant="flat"
                class="selection-counter"
              >
                <v-icon start size="small">mdi-check-circle</v-icon>
                {{ selectedCount }} selecionado{{
                  selectedCount > 1 ? 's' : ''
                }}
              </v-chip>
            </div>

            <div class="d-flex align-center ga-4">
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
  }

  const props = defineProps<Props>()
  defineEmits<Emits>()

  const selectAllLabel = computed(() => {
    if (props.selectedCount === 0) return 'Selecionar todos'
    if (props.selectedCount === props.resultsCount) return 'Todos selecionados'
    return 'Selecionar todos'
  })
</script>

<style scoped>
  .results-header-container {
    background: rgba(var(--v-theme-surface), 1);
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
    margin-bottom: 0;
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .mobile-header {
    padding: 0 4px;
  }

  .desktop-header {
    padding: 0 8px;
  }

  .select-all-mobile {
    flex: 0 0 auto;
    max-width: 180px;
  }

  .select-all-desktop {
    flex: 0 0 auto;
  }

  .selection-counter {
    animation: slideIn 0.3s ease-out;
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
</style>
