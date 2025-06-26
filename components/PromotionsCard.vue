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
            {{ formatValue(promotion.current_value, promotion.program_type) }}
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
        @click="$emit('view-details', promotion)"
      >
        <v-icon start>mdi-eye</v-icon>
        Ver Detalhes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
  interface Props {
    promotion: {
      id: number
      current_value: number
      program_type: 'miles' | 'points' | 'cashback'
      program: {
        id: number
        name: string
        logo_url: string
      }
      ecommerce: {
        id: number
        name: string
        logo_url: string
      }
    }
  }

  defineProps<Props>()
  defineEmits<{
    'view-details': [promotion: Props['promotion']]
  }>()

  const formatValue = (value: number, type: string): string => {
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
</style>
