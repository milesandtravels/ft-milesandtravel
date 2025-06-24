<template>
  <div class="under-development">
    <v-row display="flex" align="center" justify="center">
      <v-col cols="12" sm="12" md="12" lg="12" xl="12">
        <v-card
          class="pa-4 pa-sm-6 pa-md-8 text-center elevation-8"
          rounded="lg"
        >
          <!-- Animated Icon -->
          <div class="icon-container mb-6">
            <v-avatar
              :size="iconSize"
              color="orange-lighten-4"
              class="animated-icon"
            >
              <v-icon :size="iconSize * 0.6" color="orange-darken-2">
                mdi-tools
              </v-icon>
            </v-avatar>
          </div>

          <!-- Title -->
          <h1 class="text-h5 text-md-h4 font-weight-bold mb-4 text-primary">
            Em Desenvolvimento
          </h1>

          <!-- Subtitle -->
          <p
            class="text-body-1 text-md-h6 font-weight-medium mb-4 text-medium-emphasis"
          >
            {{ subtitle }}
          </p>

          <!-- Description -->
          <p
            class="text-body-2 text-md-body-1 mb-6 text-high-emphasis description-text"
          >
            {{ description }}
          </p>

          <!-- Action Buttons -->
          <div class="actions-section" v-if="showBackButton">
            <v-btn
              color="primary"
              variant="elevated"
              size="large"
              class="back-button"
              @click="handleBackClick"
            >
              <v-icon left class="mr-2">mdi-arrow-left</v-icon>
              {{ backButtonText }}
            </v-btn>
          </div>

          <!-- Contact Info -->
          <div class="contact-section mt-6 pt-4" v-if="showContact">
            <p class="text-body-2 text-medium-emphasis mb-2">
              Dúvidas ou sugestões?
            </p>
            <p class="text-body-2">
              <v-icon size="small" class="mr-1">mdi-email-outline</v-icon>
              {{ contactEmail }}
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useDisplay } from 'vuetify'

  // Types
  interface Props {
    title?: string
    subtitle?: string
    description?: string
    showBackButton?: boolean
    backButtonText?: string
    contactEmail?: string
    showContact?: boolean
    customBackAction?: () => void
  }

  // Props with defaults
  const props = withDefaults(defineProps<Props>(), {
    title: 'Em Desenvolvimento',
    subtitle: 'Esta funcionalidade estará disponível em breve',
    description:
      'Nossa equipe está trabalhando para trazer esta nova funcionalidade para você. Fique atento às atualizações!',
    showBackButton: true,
    backButtonText: 'Voltar',
    contactEmail: 'contato@milestravels.com',
    showContact: true,
    customBackAction: undefined,
  })

  // Emits
  const emit = defineEmits<{
    back: []
  }>()

  // Composables
  const router = useRouter()
  const { mobile, smAndUp } = useDisplay()

  // Computed properties
  const iconSize = computed((): number => {
    if (mobile.value) return 80
    if (smAndUp.value) return 100
    return 120
  })

  // Methods
  const handleBackClick = (): void => {
    if (props.customBackAction) {
      props.customBackAction()
    } else {
      emit('back')
      router.back()
    }
  }

  // Lifecycle
  onMounted(() => {
    // Add any initialization logic here
  })
</script>

<style scoped>
  .under-development {
    display: flex;
    justify-content: 'center';
    align-items: center;
    margin: 0 auto;
    max-width: 700px;
  }
  .icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .animated-icon {
    animation: pulse 2s ease-in-out infinite;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
  }

  .animated-progress {
    animation: shimmer 1.5s ease-in-out infinite;
  }

  .description-text {
    line-height: 1.6;
    max-width: 400px;
    margin: 0 auto;
  }

  .actions-section {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .contact-section {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  /* Mobile First Responsive Design */
  @media (max-width: 599px) {
    .under-development {
      padding: 16px 0;
    }

    .v-card {
      margin: 0 8px;
    }

    .back-button {
      width: 100%;
      max-width: 280px;
    }

    .description-text {
      font-size: 0.875rem;
      max-width: 100%;
    }
  }

  @media (min-width: 600px) {
    .back-button {
      width: auto;
      min-width: 140px;
    }
  }

  @media (min-width: 960px) {
    .description-text {
      font-size: 1rem;
    }
  }

  /* Vuetify overrides for pixel perfect design */
  :deep(.v-card) {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  :deep(.v-card:hover) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
  }

  :deep(.v-btn) {
    text-transform: none;
    letter-spacing: 0.5px;
    font-weight: 500;
  }

  :deep(.v-progress-linear) {
    border-radius: 4px;
    overflow: hidden;
  }

  :deep(.v-list-item) {
    min-height: 40px;
  }

  :deep(.v-list-item__prepend) {
    width: auto;
  }

  /* Accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    .animated-icon {
      animation: none;
    }

    :deep(.v-card:hover) {
      transform: none;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .under-development {
      background: #fff;
    }

    .animated-icon {
      box-shadow: 0 0 0 2px currentColor;
    }
  }
</style>
