<template>
  <v-card class="promotion-card h-100" elevation="2" hover>
    <v-card-text class="pa-6">
      <!-- Header com logos lado a lado -->
      <div class="logos-header mb-4">
        <div class="d-flex justify-space-between align-center">
          <!-- E-commerce Logo & Info -->
          <div class="logo-section">
            <div class="logo-container mb-2">
              <v-img
                :src="promotion.ecommerce.logo_url"
                :alt="promotion.ecommerce.name"
                contain
                height="80"
                max-width="120"
                class="ecommerce-logo"
              >
                <template v-slot:error>
                  <div class="logo-error">
                    <v-icon icon="mdi-store" size="30" color="grey"></v-icon>
                  </div>
                </template>
              </v-img>
            </div>
            <div class="text-center">
              <p class="text-caption text-medium-emphasis mb-0">E-commerce</p>
              <p class="text-body-2 font-weight-medium">
                {{ promotion.ecommerce.name }}
              </p>
            </div>
          </div>

          <!-- VS Divider -->
          <div class="vs-divider mx-3">
            <v-icon icon="mdi-plus" size="16" color="grey-lighten-1"></v-icon>
          </div>

          <!-- Program Logo & Info -->
          <div class="logo-section">
            <div class="logo-container mb-2">
              <v-img
                :src="promotion.program.logo_url"
                :alt="promotion.program.name"
                contain
                height="80"
                max-width="120"
                class="program-logo"
              >
                <template v-slot:error>
                  <div class="logo-error">
                    <v-icon
                      icon="mdi-card-giftcard"
                      size="30"
                      color="grey"
                    ></v-icon>
                  </div>
                </template>
              </v-img>
            </div>
            <div class="text-center">
              <p class="text-caption text-medium-emphasis mb-0">Programa</p>
              <p class="text-body-2 font-weight-medium">
                {{ promotion.program.name }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Promotion Value -->
      <div class="promotion-value">
        <v-divider class="mb-4"></v-divider>
        <div class="text-center">
          <p class="text-caption text-medium-emphasis mb-2">
            Valor Atual da Promoção
          </p>
          <p class="text-h4 font-weight-bold text-primary mb-0">
            {{ formatValue(promotion.current_value, promotion.program.type) }}
          </p>
        </div>
      </div>
    </v-card-text>

    <v-card-actions class="pa-6 pt-0">
      <v-btn
        variant="outlined"
        color="primary"
        block
        size="large"
        @click="openConfirmationModal"
      >
        <v-icon start>mdi-external-link</v-icon>
        Ver Detalhes
      </v-btn>
    </v-card-actions>

    <!-- Modal de Confirmação -->
    <v-dialog v-model="showConfirmationModal" max-width="520" persistent>
      <v-card class="confirmation-modal">
        <!-- Header -->
        <v-card-title class="pa-0">
          <div class="modal-header">
            <div class="d-flex align-center pa-6 pb-4">
              <div class="warning-icon-container mr-4">
                <v-icon color="warning" size="24">mdi-alert-circle</v-icon>
              </div>
              <div class="flex-grow-1">
                <h2 class="text-h6 font-weight-bold mb-1">
                  Atenção - Regras do Programa
                </h2>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Leia as orientações antes de prosseguir
                </p>
              </div>
            </div>
            <v-divider />
          </div>
        </v-card-title>

        <v-card-text class="pa-6">
          <!-- Program Info -->
          <div class="program-info-section mb-5">
            <div class="d-flex align-center">
              <v-avatar size="48" class="mr-4">
                <v-img
                  :src="promotion.program.logo_url"
                  :alt="promotion.program.name"
                  cover
                >
                  <template v-slot:error>
                    <div class="logo-error-small">
                      <v-icon
                        icon="mdi-card-giftcard"
                        size="20"
                        color="grey"
                      ></v-icon>
                    </div>
                  </template>
                </v-img>
              </v-avatar>
              <div class="flex-grow-1">
                <h3 class="text-h6 font-weight-bold mb-1">
                  {{ promotion.program.name }}
                </h3>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Programa de {{ getProgramTypeName(promotion.program.type) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Important Alert -->
          <v-alert
            color="warning"
            variant="tonal"
            icon="mdi-information-outline"
            class="mb-5"
            border="start"
            border-color="warning"
          >
            <div class="text-body-2">
              <strong>Importante:</strong> Você será redirecionado para o site
              oficial do programa {{ promotion.program.name }}.
            </div>
          </v-alert>

          <!-- Guidelines -->
          <div class="guidelines-section">
            <h4
              class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center"
            >
              <v-icon class="mr-2" color="primary" size="20"
                >mdi-clipboard-check-outline</v-icon
              >
              Por favor, atente-se às seguintes orientações:
            </h4>

            <div class="guidelines-list">
              <div
                v-for="(guideline, index) in guidelines"
                :key="index"
                class="guideline-item"
              >
                <div class="guideline-bullet">
                  <v-icon color="primary" size="14">mdi-check-circle</v-icon>
                </div>
                <span class="guideline-text">{{ guideline }}</span>
              </div>
            </div>

            <div class="disclaimer mt-4 pa-3">
              <v-icon class="mr-2" color="grey" size="16"
                >mdi-shield-alert-outline</v-icon
              >
              <span class="text-body-2 text-medium-emphasis">
                O Miles&Travels não se responsabiliza por alterações nas regras
                ou valores dos programas de fidelidade.
              </span>
            </div>
          </div>
        </v-card-text>

        <!-- Footer Actions -->
        <v-card-actions class="pa-0">
          <div class="modal-footer w-100">
            <v-divider />
            <div class="pa-6 pt-4">
              <v-row no-gutters class="w-100">
                <v-col cols="5">
                  <v-btn
                    variant="outlined"
                    color="grey-darken-1"
                    size="large"
                    block
                    @click="showConfirmationModal = false"
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
                    @click="goToProgram"
                    class="text-body-2 font-weight-bold"
                    elevation="0"
                  >
                    <v-icon start size="18">mdi-open-in-new</v-icon>
                    Ir para Programa
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  type ProgramType = 'miles' | 'points' | 'cashback'

  interface Props {
    promotion: {
      id: number
      current_value: number
      program: {
        id: number
        name: string
        logo_url: string
        link_url: string
        type: ProgramType
        value_per_mile?: string
      }
      ecommerce: {
        id: number
        name: string
        logo_url: string
        category?: string
      }
    }
  }

  const props = defineProps<Props>()

  defineEmits<{
    'view-details': [promotion: Props['promotion']]
  }>()

  // State
  const showConfirmationModal = ref(false)

  // Guidelines data
  const guidelines = [
    'Leia atentamente todas as regras e condições do programa',
    'Verifique os prazos de validade das promoções',
    'Confirme os valores e taxas de conversão atuais',
    'Observe os termos específicos de cada e-commerce parceiro',
    'Mantenha-se atualizado sobre mudanças nas regras',
  ]

  // Methods
  function formatValue(value: number, type: string): string {
    switch (type) {
      case 'miles':
        return `${value} milhas/R$`
      case 'points':
        return `${value} pontos/R$`
      case 'cashback':
        return `${value}% cashback`
      default:
        return value.toString()
    }
  }

  function getProgramTypeName(type: string): string {
    switch (type) {
      case 'miles':
        return 'Milhas'
      case 'points':
        return 'Pontos'
      case 'cashback':
        return 'Cashback'
      default:
        return 'Fidelidade'
    }
  }

  function openConfirmationModal(): void {
    showConfirmationModal.value = true
  }

  function goToProgram(): void {
    window.open(
      props.promotion.program.link_url,
      '_blank',
      'noopener,noreferrer'
    )
    showConfirmationModal.value = false
  }
</script>

<style scoped>
  .promotion-card {
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .promotion-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
  }

  .logos-header {
    background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
    padding: 20px;
    border-radius: 16px;
    margin: -24px -24px 20px -24px;
  }

  .logo-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 45%;
  }

  .logo-container {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .ecommerce-logo,
  .program-logo {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
  }

  .logo-error {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .logo-error-small {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: #f5f5f5;
    border-radius: 8px;
    margin: 0 auto;
  }

  .vs-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }

  .promotion-value {
    background: rgba(25, 118, 210, 0.02);
    padding: 20px;
    border-radius: 16px;
    margin: 0 -24px -24px -24px;
  }

  .logo-section .text-body-2 {
    font-size: 0.9rem;
    line-height: 1.3;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .h-100 {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .h-100 .v-card-text {
    flex-grow: 1;
  }

  .confirmation-modal {
    border-radius: 16px;
    overflow: hidden;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    background: linear-gradient(135deg, #fff7e6 0%, #fff 100%);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .warning-icon-container {
    width: 48px;
    height: 48px;
    background: rgba(255, 193, 7, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .program-info-section {
    background: rgba(25, 118, 210, 0.02);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(25, 118, 210, 0.08);
  }

  .guidelines-section {
    background: #fafafa;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .guidelines-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .guideline-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 8px 0;
  }

  .guideline-bullet {
    flex-shrink: 0;
    margin-top: 2px;
  }

  .guideline-text {
    color: #424242;
    font-size: 0.875rem;
    line-height: 1.5;
    flex: 1;
  }

  .disclaimer {
    background: rgba(158, 158, 158, 0.08);
    border-radius: 8px;
    border: 1px solid rgba(158, 158, 158, 0.2);
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .modal-footer {
    background: #fafafa;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 600px) {
    .logos-header {
      padding: 16px;
      margin: -24px -24px 16px -24px;
    }

    .logo-container {
      height: 60px;
      padding: 8px;
    }

    .vs-divider {
      width: 32px;
      height: 32px;
      margin: 0 12px;
    }

    .logo-section .text-body-2 {
      font-size: 0.8rem;
    }

    .promotion-value {
      padding: 16px;
      margin: 0 -24px -24px -24px;
    }

    .program-info-section {
      padding: 16px;
    }

    .guidelines-section {
      padding: 16px;
    }

    .guideline-item {
      gap: 8px;
      padding: 6px 0;
    }

    .disclaimer {
      padding: 12px;
      flex-direction: column;
      gap: 6px;
    }
  }

  .v-theme--dark .logos-header {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.05) 0%,
      rgba(255, 255, 255, 0.02) 100%
    );
  }

  .v-theme--dark .logo-container {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
  }

  .v-theme--dark .vs-divider {
    background: rgba(255, 255, 255, 0.08);
  }

  .v-theme--dark .promotion-value {
    background: rgba(25, 118, 210, 0.08);
  }

  .v-theme--dark .logo-error {
    background: rgba(255, 255, 255, 0.05);
  }

  .v-theme--dark .logo-error-small {
    background: rgba(255, 255, 255, 0.05);
  }

  .v-theme--dark .guidelines-section {
    background: rgba(255, 255, 255, 0.02);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .v-theme--dark .program-info-section {
    background: rgba(25, 118, 210, 0.08);
    border-color: rgba(25, 118, 210, 0.16);
  }

  .v-theme--dark .modal-header {
    background: linear-gradient(
      135deg,
      rgba(255, 247, 230, 0.05) 0%,
      rgba(255, 255, 255, 0.02) 100%
    );
    border-color: rgba(255, 255, 255, 0.08);
  }

  .v-theme--dark .modal-footer {
    background: rgba(255, 255, 255, 0.02);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .v-theme--dark .disclaimer {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.12);
  }

  .v-theme--dark .warning-icon-container {
    background: rgba(255, 193, 7, 0.16);
  }
</style>
