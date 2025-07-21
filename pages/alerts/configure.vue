<template>
  <v-container class="alert-settings" fluid>
    <!-- Header -->
    <div class="settings-header mb-6">
      <h1 class="text-h5 font-weight-bold mb-2">Configurações de Alertas</h1>
      <p class="text-body-2 text-medium-emphasis">
        Configure como deseja receber notificações sobre ofertas e cashbacks
      </p>
    </div>

    <!-- WhatsApp Settings Card -->
    <v-card class="whatsapp-card mb-4" elevation="1">
      <v-card-text class="pa-4">
        <div class="d-flex align-center justify-space-between">
          <div class="whatsapp-info flex-grow-1 me-4">
            <div class="d-flex align-center mb-2">
              <v-icon color="success" size="24" class="me-2"
                >mdi-whatsapp</v-icon
              >
              <h3 class="text-subtitle-1 font-weight-medium">
                Alertas via WhatsApp
              </h3>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Receba notificações instantâneas sobre as melhores ofertas e
              cashbacks diretamente no seu WhatsApp
            </p>
            <div
              v-if="whatsappEnabled && verifiedPhone"
              class="phone-display mt-2"
            >
              <v-chip size="small" color="success" variant="tonal">
                <v-icon start size="16">mdi-check-circle</v-icon>
                {{ formatPhone(verifiedPhone) }}
              </v-chip>
            </div>
          </div>

          <v-switch
            v-model="whatsappEnabled"
            color="success"
            density="compact"
            hide-details
            :disabled="isLoading"
            @update:model-value="handleWhatsAppToggle"
          />
        </div>
      </v-card-text>
    </v-card>

    <!-- WhatsApp Setup Modal -->
    <v-dialog
      v-model="showWhatsAppModal"
      max-width="500"
      persistent
      :fullscreen="$vuetify.display.mobile"
    >
      <v-card class="whatsapp-modal">
        <v-card-title class="d-flex align-center pa-4 pb-2">
          <v-icon color="success" size="28" class="me-2">mdi-whatsapp</v-icon>
          <span class="text-h6">Configurar WhatsApp</span>
        </v-card-title>

        <v-card-text class="pa-4">
          <!-- Phone Input Step -->
          <div v-if="currentStep === 'phone'" class="phone-step">
            <p class="text-body-2 text-medium-emphasis mb-4">
              Digite seu número de WhatsApp para receber um código de
              confirmação
            </p>

            <v-text-field
              v-model="phoneNumber"
              label="Número do WhatsApp"
              placeholder="(11) 99999-9999"
              prepend-inner-icon="mdi-phone"
              variant="outlined"
              density="comfortable"
              :rules="phoneRules"
              :error-messages="phoneError"
              :disabled="isLoading"
              @input="formatPhoneInput"
              @keyup.enter="sendVerificationCode"
            />

            <div class="phone-help mt-2">
              <v-icon size="16" color="info" class="me-1"
                >mdi-information</v-icon
              >
              <span class="text-caption text-medium-emphasis">
                Digite apenas números. Exemplo: (11) 99999-9999
              </span>
            </div>
          </div>

          <!-- Verification Code Step -->
          <div v-if="currentStep === 'verification'" class="verification-step">
            <div class="text-center mb-4">
              <v-icon color="success" size="48" class="mb-2"
                >mdi-message-text</v-icon
              >
              <p class="text-body-2 text-medium-emphasis">
                Enviamos um código de verificação para<br />
                <strong>{{ formatPhone(phoneNumber) }}</strong>
              </p>
            </div>

            <v-otp-input
              v-model="verificationCode"
              :length="5"
              variant="outlined"
              :disabled="isLoading"
              :error="!!codeError"
              @finish="verifyCode"
            />

            <v-alert
              v-if="codeError"
              type="error"
              variant="tonal"
              class="mt-3"
              text
            >
              {{ codeError }}
            </v-alert>

            <div class="resend-section mt-4 text-center">
              <p class="text-caption text-medium-emphasis mb-2">
                Não recebeu o código?
              </p>
              <v-btn
                color="primary"
                variant="text"
                size="small"
                :disabled="isLoading || resendCooldown > 0"
                @click="resendCode"
              >
                <v-icon start size="16">mdi-refresh</v-icon>
                {{
                  resendCooldown > 0
                    ? `Reenviar em ${resendCooldown}s`
                    : 'Reenviar código'
                }}
              </v-btn>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-btn
            variant="text"
            :disabled="isLoading"
            @click="cancelWhatsAppSetup"
          >
            Cancelar
          </v-btn>

          <v-spacer />

          <v-btn
            v-if="currentStep === 'phone'"
            color="success"
            variant="flat"
            :disabled="!isPhoneValid || isLoading"
            :loading="isLoading"
            @click="sendVerificationCode"
          >
            Enviar código
          </v-btn>

          <v-btn
            v-if="currentStep === 'verification'"
            color="success"
            variant="flat"
            :disabled="verificationCode.length !== 5 || isLoading"
            :loading="isLoading"
            @click="verifyCode"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
  type Step = 'phone' | 'verification'

  // Estados principais
  const whatsappEnabled = ref(false)
  const showWhatsAppModal = ref(false)
  const isLoading = ref(false)

  // Estados do modal
  const currentStep = ref<Step>('phone')
  const phoneNumber = ref('')
  const verificationCode = ref('')
  const phoneError = ref('')
  const codeError = ref('')
  const verifiedPhone = ref('')

  // Resend cooldown
  const resendCooldown = ref(0)
  let resendTimer: NodeJS.Timeout | null = null

  // Validações
  const phoneRules = [
    (v: string) => !!v || 'Número é obrigatório',
    (v: string) => {
      const cleanPhone = v.replace(/\D/g, '')
      return cleanPhone.length >= 10 || 'Número deve ter pelo menos 10 dígitos'
    },
    (v: string) => {
      const cleanPhone = v.replace(/\D/g, '')
      return cleanPhone.length <= 11 || 'Número deve ter no máximo 11 dígitos'
    },
  ]

  const isPhoneValid = computed(() => {
    const cleanPhone = phoneNumber.value.replace(/\D/g, '')
    return (
      cleanPhone.length >= 10 && cleanPhone.length <= 11 && !phoneError.value
    )
  })

  // Formatação do telefone para exibição
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')

    if (cleaned.length <= 10) {
      // Telefone fixo: (11) 1234-5678
      return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
    } else {
      // Celular: (11) 99999-9999
      return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
    }
  }

  // Máscara para input do telefone
  const formatPhoneInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    let value = target.value.replace(/\D/g, '') // Remove tudo que não é dígito

    // Limita a 11 dígitos
    if (value.length > 11) {
      value = value.slice(0, 11)
    }

    // Aplica a máscara
    if (value.length <= 2) {
      phoneNumber.value = value
    } else if (value.length <= 6) {
      phoneNumber.value = `(${value.slice(0, 2)}) ${value.slice(2)}`
    } else if (value.length <= 10) {
      phoneNumber.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`
    } else {
      phoneNumber.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`
    }

    clearPhoneError()
  }

  // Handlers principais
  const handleWhatsAppToggle = (enabled: boolean) => {
    if (enabled && !verifiedPhone.value) {
      showWhatsAppModal.value = true
      resetModal()
    } else if (!enabled) {
      console.log('API: Desabilitar alertas WhatsApp')
      verifiedPhone.value = ''
    }
  }

  const sendVerificationCode = async () => {
    if (!isPhoneValid.value) return

    isLoading.value = true
    phoneError.value = ''

    try {
      const cleanPhone = phoneNumber.value.replace(/\D/g, '')
      const { data, error } = await useSanctumFetch(`/api/otp/send`, {
        method: 'POST',
        body: {
          phone: `55${cleanPhone}`,
        },
      })
      currentStep.value = 'verification'
      startResendCooldown()
    } catch (error) {
      phoneError.value = 'Erro ao enviar código. Tente novamente.'
    } finally {
      isLoading.value = false
    }
  }

  const verifyCode = async () => {
    if (verificationCode.value.length !== 5) return

    isLoading.value = true
    codeError.value = ''

    try {
      // Simular chamada da API
      const cleanPhone = phoneNumber.value.replace(/\D/g, '')
      console.log(
        'API: Verificar código:',
        verificationCode.value,
        'para telefone:',
        `+55${cleanPhone}`
      )

      const { data, error } = await useSanctumFetch(`/api/otp/validate`, {
        method: 'POST',
        body: {
          phone: `55${cleanPhone}`,
          token: verificationCode.value,
        },
      })

      // Sucesso
      verifiedPhone.value = phoneNumber.value
      whatsappEnabled.value = true
      showWhatsAppModal.value = false

      console.log('API: Habilitar alertas WhatsApp para:', `+55${cleanPhone}`)
    } catch (error) {
      codeError.value = 'Código inválido. Tente novamente.'
    } finally {
      isLoading.value = false
    }
  }

  const resendCode = async () => {
    if (resendCooldown.value > 0) return

    isLoading.value = true
    codeError.value = ''

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const cleanPhone = phoneNumber.value.replace(/\D/g, '')
      console.log(
        'API: Reenviar código de verificação para:',
        `+55${cleanPhone}`
      )

      startResendCooldown()
    } catch (error) {
      codeError.value = 'Erro ao reenviar código. Tente novamente.'
    } finally {
      isLoading.value = false
    }
  }

  const cancelWhatsAppSetup = () => {
    whatsappEnabled.value = false
    showWhatsAppModal.value = false
    resetModal()
  }

  // Utilitários
  const resetModal = () => {
    currentStep.value = 'phone'
    phoneNumber.value = ''
    verificationCode.value = ''
    phoneError.value = ''
    codeError.value = ''
    clearResendTimer()
  }

  const clearPhoneError = () => {
    phoneError.value = ''
  }

  const startResendCooldown = () => {
    resendCooldown.value = 60
    resendTimer = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0) {
        clearResendTimer()
      }
    }, 1000)
  }

  const clearResendTimer = () => {
    if (resendTimer) {
      clearInterval(resendTimer)
      resendTimer = null
    }
    resendCooldown.value = 0
  }

  // Cleanup
  onUnmounted(() => {
    clearResendTimer()
  })
</script>

<style scoped>
  .alert-settings {
    max-width: 600px;
    margin: 0 auto;
    padding: 16px;
  }

  .settings-header {
    text-align: center;
    padding: 16px 0;
  }

  .whatsapp-card {
    border-radius: 12px;
    border: 1px solid rgba(var(--v-theme-success), 0.1);
  }

  .whatsapp-card:hover {
    border-color: rgba(var(--v-theme-success), 0.2);
    transition: border-color 0.2s ease;
  }

  .whatsapp-info {
    min-height: 60px;
  }

  .phone-display {
    margin-top: 8px;
  }

  .whatsapp-modal {
    border-radius: 16px;
    overflow: hidden;
  }

  .phone-step,
  .verification-step {
    min-height: 120px;
  }

  .phone-help {
    display: flex;
    align-items: center;
    margin-top: 8px;
  }

  .resend-section {
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
    padding-top: 16px;
  }

  /* Mobile adjustments */
  @media (max-width: 600px) {
    .alert-settings {
      padding: 12px;
    }

    .whatsapp-card .v-card-text {
      padding: 16px !important;
    }

    .whatsapp-modal .v-card-title,
    .whatsapp-modal .v-card-text,
    .whatsapp-modal .v-card-actions {
      padding: 16px !important;
    }

    .whatsapp-info {
      margin-bottom: 16px;
    }

    .d-flex.align-center.justify-space-between {
      flex-direction: column;
      align-items: stretch;
    }
  }

  /* OTP Input customization */
  :deep(.v-otp-input) {
    justify-content: center;
  }

  :deep(.v-otp-input .v-field) {
    margin: 0 4px;
  }

  /* Switch customization */
  :deep(.v-switch .v-selection-control__input) {
    border-radius: 12px;
  }
</style>
