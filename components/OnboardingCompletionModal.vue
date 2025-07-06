<!-- OnboardingCompletionModal.vue -->
<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :max-width="dialogMaxWidth"
    persistent
    :fullscreen="isMobile"
    :z-index="10005"
  >
    <v-card class="text-center" :class="{ 'mobile-fullscreen-card': isMobile }">
      <v-card-text :class="isMobile ? 'pa-4 mobile-content' : 'pa-8'">
        <div class="mb-6">
          <v-icon
            icon="mdi-check-circle"
            size="80"
            color="success"
            class="animate-bounce"
          />
        </div>

        <h1
          :class="isMobile ? 'text-h5' : 'text-h4'"
          class="font-weight-bold mb-4 text-success"
        >
          Parabéns! 🎉
        </h1>

        <p
          :class="isMobile ? 'text-body-1' : 'text-h6'"
          class="mb-6 text-medium-emphasis"
        >
          Você completou o tour da plataforma
        </p>

        <v-alert type="success" variant="tonal" class="mb-6 text-start">
          <template v-slot:prepend>
            <v-icon icon="mdi-rocket" />
          </template>
          <strong>Próximos passos:</strong> Que tal fazer sua primeira busca
          agora e descobrir as melhores ofertas?
        </v-alert>
      </v-card-text>

      <v-card-actions :class="isMobile ? 'pa-4 pt-0 mobile-actions' : 'pa-6 pt-0'">
        <v-btn
          color="success"
          variant="flat"
          size="large"
          @click="$emit('finish-tour')"
          :class="isMobile ? 'w-100' : 'flex-grow-1'"
        >
          <v-icon icon="mdi-rocket" class="me-2" />
          Começar a Usar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  isMobile: boolean
}

const props = defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: boolean]
  'finish-tour': []
}>()

const dialogMaxWidth = computed(() => {
  if (typeof window === 'undefined') return '600px'
  return window.innerWidth <= 768 ? '100vw' : '600px'
})
</script>

<style scoped>
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -15px, 0);
  }
  70% {
    transform: translate3d(0, -7px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

.animate-bounce {
  animation: bounce 1s ease-in-out 3;
}

.w-100 {
  width: 100% !important;
}

.flex-grow-1 {
  flex-grow: 1 !important;
}

/* Mobile fullscreen styles */
.mobile-fullscreen-card {
  height: 100vh !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  border-radius: 0 !important;
}

.mobile-content {
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  padding: 32px 24px !important;
}

.mobile-actions {
  flex-shrink: 0 !important;
  margin-top: auto !important;
  padding: 24px !important;
  border-top: 1px solid #e0e0e0 !important;
  background: #fafafa !important;
}

/* Mobile specific adjustments */
@media screen and (max-width: 768px) {
  .mobile-fullscreen-card {
    width: 100vw !important;
    max-width: 100vw !important;
    height: 100vh !important;
    max-height: 100vh !important;
  }
  
  .mobile-content {
    min-height: 0 !important;
    overflow-y: auto !important;
  }
  
  .mb-6 {
    margin-bottom: 1.5rem !important;
  }
  
  .mb-4 {
    margin-bottom: 1rem !important;
  }
}</style>