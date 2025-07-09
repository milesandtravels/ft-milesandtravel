<template>
  <div class="action-bar">
    <v-container fluid class="pa-0">
      <div class="action-bar-content">
        <!-- Mobile Layout -->
        <div
          v-if="$vuetify.display.mobile"
          class="d-flex align-center justify-space-between"
        >
          <div class="selection-info">
            <v-icon color="white" size="small" class="mr-1"
              >mdi-check-circle</v-icon
            >
            <span class="text-white text-body-2 font-weight-medium">
              {{ selectedCount }} selecionado{{ selectedCount > 1 ? 's' : '' }}
            </span>
          </div>

          <v-btn
            color="white"
            variant="flat"
            size="small"
            class="font-weight-bold text-primary mobile-action-btn"
            :loading="loading"
            @click="$emit('explore-advantages')"
          >
            <v-icon start size="x-small">mdi-star</v-icon>
            <span class="mobile-btn-text">Explorar</span>
          </v-btn>
        </div>

        <!-- Desktop Layout -->
        <div v-else class="d-flex align-center justify-space-between">
          <div class="selection-info">
            <v-icon color="white" size="default" class="mr-2"
              >mdi-check-circle</v-icon
            >
            <span class="text-white text-body-1 font-weight-medium">
              {{ selectedCount }} produto{{
                selectedCount > 1 ? 's' : ''
              }}
              selecionado{{ selectedCount > 1 ? 's' : '' }}
            </span>
          </div>

          <div class="d-flex align-center ga-3">
            <v-btn
              color="white"
              variant="text"
              size="default"
              class="text-white"
              @click="$emit('deselect-all')"
            >
              <v-icon start size="small">mdi-close</v-icon>
              Limpar
            </v-btn>

            <v-btn
              color="white"
              variant="flat"
              size="large"
              class="font-weight-bold text-primary px-6"
              :loading="loading"
              @click="$emit('explore-advantages')"
            >
              <v-icon start>mdi-star</v-icon>
              Explorar vantagens
            </v-btn>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
  interface Props {
    selectedCount: number
    loading: boolean
  }

  interface Emits {
    (e: 'deselect-all'): void
    (e: 'explore-advantages'): void
  }

  defineProps<Props>()
  defineEmits<Emits>()
</script>

<style scoped>
  .action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgb(var(--v-theme-primary));
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    animation: slideUp 0.3s ease-out;
  }

  .action-bar-content {
    padding: 12px 16px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .selection-info {
    display: flex;
    align-items: center;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 599px) {
    .action-bar-content {
      padding: 10px 12px;
    }
  }
</style>
