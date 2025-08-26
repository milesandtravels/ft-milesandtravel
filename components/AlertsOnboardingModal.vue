<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600"
    persistent
    :fullscreen="$vuetify.display.mobile"
  >
    <v-card>
      <!-- Header -->
      <v-card-title class="text-center">
        <div class="d-flex flex-column align-center w-100">
          <v-icon
            icon="mdi-whatsapp"
            :size="$vuetify.display.mobile ? '48' : '64'"
            color="success"
            class="mb-3"
          />
          <h2 class="text-h5 font-weight-bold text-center">
            Bem-vindo aos Alertas!
          </h2>
        </div>
      </v-card-title>

      <!-- Content -->
      <v-card-text>
        <div class="text-center mb-6">
          <p class="text-body-1 text-medium-emphasis">
            Configure o WhatsApp para receber notificações instantâneas sobre as
            melhores ofertas e cashbacks.
          </p>
        </div>

        <!-- Steps -->
        <div class="steps-container">
          <v-list class="pa-0">
            <v-list-item
              v-for="(step, index) in steps"
              :key="index"
              class="px-0 py-3"
            >
              <template v-slot:prepend>
                <v-avatar size="40" :color="step.color" class="me-4">
                  <span class="text-white font-weight-bold">{{
                    index + 1
                  }}</span>
                </v-avatar>
              </template>

              <v-list-item-title class="mb-1">
                <span class="text-subtitle-1 font-weight-medium">{{
                  step.title
                }}</span>
              </v-list-item-title>

              <v-list-item-subtitle class="text-body-2 text-wrap">
                {{ step.description }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions>
        <div class="w-100 d-flex flex-column flex-sm-row-reverse ga-4">
          <v-btn
            color="success"
            variant="flat"
            size="large"
            prepend-icon="mdi-whatsapp"
            @click="$emit('configure')"
            :block="$vuetify.display.mobile"
            class="flex-sm-0 flex-sm-shrink-0 mb-3 mb-sm-0"
          >
            {{ $vuetify.display.xs ? 'Configurar' : 'Configurar WhatsApp' }}
          </v-btn>

          <v-btn
            variant="text"
            color="medium-emphasis"
            @click="$emit('close')"
            :block="$vuetify.display.mobile"
            class="flex-sm-1"
          >
            Pular por Agora
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  interface Props {
    modelValue: boolean
  }

  interface Emits {
    'update:modelValue': [value: boolean]
    configure: []
    close: []
  }

  defineProps<Props>()
  defineEmits<Emits>()

  const steps = [
    {
      color: 'success',
      title: 'Configure o WhatsApp',
      description: 'Autorize o recebimento de mensagens em nosso sistema',
    },
    {
      color: 'primary',
      title: 'Crie seus Alertas',
      description:
        'Defina os alertas para as ofertas que você deseja acompanhar',
    },
    {
      color: 'warning',
      title: 'Receba Notificações',
      description:
        'Seja notificado instantaneamente quando suas ofertas favoritas estiverem disponíveis',
    },
  ]
</script>

<style scoped>
  /* Garantir que o modal tenha aparência consistente */
  .v-card {
    border-radius: 16px;
  }

  /* Melhorar espaçamento dos steps */
  .steps-container {
    max-width: 100%;
  }

  .v-list-item {
    min-height: auto !important;
    align-items: flex-start !important;
  }

  .v-list-item-title {
    white-space: normal !important;
    line-height: 1.4 !important;
  }

  .v-list-item-subtitle {
    white-space: normal !important;
    line-height: 1.5 !important;
    opacity: 0.7 !important;
    margin-top: 4px;
  }

  /* Ajustes para mobile */
  @media (max-width: 599px) {
    .v-card-title {
      padding-bottom: 16px !important;
    }

    .v-card-text {
      padding-top: 0 !important;
    }

    .steps-container .v-list-item {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }

  /* Ajustes para desktop */
  @media (min-width: 600px) {
    .v-card-actions .w-100 {
      align-items: center;
    }

    .flex-sm-0 {
      flex: 0 0 auto !important;
      min-width: 180px;
    }

    .flex-sm-1 {
      flex: 1 1 auto !important;
      max-width: 140px;
    }

    .flex-sm-shrink-0 {
      flex-shrink: 0 !important;
    }
  }
</style>
