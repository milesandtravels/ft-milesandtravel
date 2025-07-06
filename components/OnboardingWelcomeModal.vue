<!-- OnboardingWelcomeModal.vue -->
<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :max-width="dialogMaxWidth"
    persistent
    :fullscreen="isMobile"
  >
    <v-card class="text-center">
      <v-card-text :class="isMobile ? 'pa-4' : 'pa-8'">
        <div class="mb-6">
          <v-icon
            icon="mdi-compass"
            size="80"
            color="primary"
            class="animate-spin-slow"
          />
        </div>

        <h1
          :class="isMobile ? 'text-h5' : 'text-h4'"
          class="font-weight-bold mb-4 text-primary"
        >
          Bem-vindo ao Miles&Travels! 🎉
        </h1>

        <p
          :class="isMobile ? 'text-body-1' : 'text-h6'"
          class="mb-6 text-medium-emphasis"
        >
          Vamos te mostrar como aproveitar ao máximo nossa plataforma
        </p>

        <v-alert type="info" variant="tonal" class="mb-6 text-start">
          <template v-slot:prepend>
            <v-icon icon="mdi-lightbulb" />
          </template>
          <strong>💡 Dica:</strong> Este tour leva apenas 2 minutos e vai te
          ajudar a economizar muito mais nas suas compras!
        </v-alert>
      </v-card-text>

      <v-card-actions :class="isMobile ? 'pa-4 pt-0 flex-column' : 'pa-6 pt-0'">
        <v-btn
          variant="outlined"
          color="grey"
          size="large"
          @click="$emit('skip-tour')"
          :class="isMobile ? 'w-100 mb-2' : 'flex-grow-1'"
        >
          Agora Não
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          size="large"
          @click="$emit('start-tour')"
          :class="isMobile ? 'w-100' : 'flex-grow-1 ml-4'"
        >
          <v-icon icon="mdi-play" class="me-2" />
          Começar Tour
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
    'start-tour': []
    'skip-tour': []
  }>()

  const dialogMaxWidth = computed(() => {
    if (typeof window === 'undefined') return '600px'
    return window.innerWidth <= 768 ? '95vw' : '600px'
  })
</script>

<style scoped>
  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin-slow {
    animation: spin-slow 4s linear infinite;
  }

  .w-100 {
    width: 100% !important;
  }

  .flex-column {
    flex-direction: column !important;
  }

  .flex-grow-1 {
    flex-grow: 1 !important;
  }
</style>
