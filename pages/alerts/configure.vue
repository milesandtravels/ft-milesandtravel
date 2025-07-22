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
        <div class="whatsapp-content">
          <div class="whatsapp-info">
            <div class="d-flex align-center mb-2">
              <v-icon color="success" size="24" class="me-2"
                >mdi-whatsapp</v-icon
              >
              <h3 class="text-subtitle-1 font-weight-medium">
                Alertas via WhatsApp
              </h3>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-2">
              Receba notificações instantâneas sobre as melhores ofertas e
              cashbacks diretamente no seu WhatsApp
            </p>
            <div v-if="whatsappEnabled && user?.phone" class="phone-display">
              <v-chip size="small" color="success" variant="tonal">
                <v-icon start size="16">mdi-check-circle</v-icon>
                {{ formatPhone(user.phone) }}
              </v-chip>
            </div>
          </div>

          <div class="switch-container">
            <v-switch
              v-model="whatsappEnabled"
              color="success"
              density="compact"
              hide-details
              :disabled="isLoading"
              @update:model-value="(value: boolean | null) => handleWhatsAppToggle(value ?? false)"
            />
          </div>
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
          <!-- Contact Step -->
          <div v-if="currentStep === 'contact'" class="contact-step">
            <div class="text-center mb-4">
              <v-icon color="success" size="64" class="mb-3"
                >mdi-whatsapp</v-icon
              >
              <h3 class="text-h6 mb-2">Entre em contato conosco</h3>
              <p class="text-body-2 text-medium-emphasis mb-4">
                Para começar a receber alertas, você precisa primeiro entrar em
                contato conosco pelo WhatsApp. Clique no botão abaixo para
                iniciar uma conversa.
              </p>
            </div>

            <div class="contact-info mb-4">
              <v-alert type="info" variant="tonal" class="mb-3" text>
                <div class="d-flex align-start">
                  <div>
                    <strong>Importante:</strong> Após entrar em contato, retorne
                    aqui para configurar seus alertas.
                  </div>
                </div>
              </v-alert>

              <div class="whatsapp-number-display">
                <v-card variant="outlined" class="pa-3">
                  <div class="d-flex align-center justify-center">
                    <v-icon color="success" size="20" class="me-2"
                      >mdi-whatsapp</v-icon
                    >
                    <span class="text-h6">{{ whatsappBusinessNumber }}</span>
                  </div>
                </v-card>
              </div>
            </div>
          </div>

          <!-- Phone Input Step -->
          <div v-if="currentStep === 'phone'" class="phone-step">
            <div class="step-indicator mb-4">
              <v-chip size="small" color="success" variant="tonal">
                <v-icon start size="14">mdi-check</v-icon>
                Contato realizado
              </v-chip>
            </div>

            <p class="text-body-2 text-medium-emphasis mb-4">
              Agora digite seu número de WhatsApp para receber um código de
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
                Use o mesmo número que utilizou para nos contatar
              </span>
            </div>
          </div>

          <!-- Verification Code Step -->
          <div v-if="currentStep === 'verification'" class="verification-step">
            <div class="step-indicator mb-3">
              <v-chip size="small" color="success" variant="tonal" class="me-2">
                <v-icon start size="14">mdi-check</v-icon>
                Contato realizado
              </v-chip>
              <v-chip size="small" color="success" variant="tonal">
                <v-icon start size="14">mdi-check</v-icon>
                Telefone adicionado
              </v-chip>
            </div>

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

        <v-card-actions class="pa-4 pt-0 flex-column">
          <!-- Contact Step Actions -->
          <template v-if="currentStep === 'contact'">
            <v-btn
              color="success"
              variant="flat"
              :disabled="isLoading"
              :loading="isLoading"
              block
              class="mb-2"
              @click="openWhatsAppContact"
            >
              <v-icon start>mdi-whatsapp</v-icon>
              Entrar em contato
            </v-btn>

            <v-btn
              color="primary"
              variant="outlined"
              block
              class="mb-2"
              @click="proceedToPhoneStep"
            >
              Já entrei em contato
            </v-btn>
          </template>

          <!-- Phone Step Actions -->
          <v-btn
            v-if="currentStep === 'phone'"
            color="success"
            variant="flat"
            :disabled="!isPhoneValid || isLoading"
            :loading="isLoading"
            block
            class="mb-2"
            @click="sendVerificationCode"
          >
            Enviar código
          </v-btn>

          <!-- Verification Step Actions -->
          <v-btn
            v-if="currentStep === 'verification'"
            color="success"
            variant="flat"
            :disabled="verificationCode.length !== 5 || isLoading"
            :loading="isLoading"
            block
            class="mb-2"
            @click="verifyCode"
          >
            Confirmar
          </v-btn>

          <!-- Cancel Button -->
          <v-btn
            variant="text"
            :disabled="isLoading"
            size="small"
            @click="cancelWhatsAppSetup"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Contact Required Dialog -->
    <v-dialog v-model="showContactRequiredDialog" max-width="400" persistent>
      <v-card class="contact-required-modal">
        <v-card-title class="d-flex align-center pa-4 pb-2">
          <v-icon color="warning" size="28" class="me-2"
            >mdi-alert-circle</v-icon
          >
          <span class="text-h6">Contato necessário</span>
        </v-card-title>

        <v-card-text class="pa-4">
          <div class="text-center">
            <v-icon color="warning" size="64" class="mb-3">mdi-whatsapp</v-icon>
            <h3 class="text-h6 mb-3">Número não encontrado</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              O número {{ formatPhone(phoneNumber) }} ainda não entrou em
              contato conosco pelo WhatsApp.
            </p>
            <p class="text-body-2 mb-4">
              <strong
                >Para receber o código de verificação, você precisa primeiro
                iniciar uma conversa conosco.</strong
              >
            </p>

            <div class="whatsapp-contact-info">
              <v-card variant="outlined" class="pa-3 mb-3">
                <div class="d-flex align-center justify-center">
                  <v-icon color="success" size="20" class="me-2"
                    >mdi-whatsapp</v-icon
                  >
                  <span class="text-subtitle-1 font-weight-medium">{{
                    whatsappBusinessNumber
                  }}</span>
                </div>
              </v-card>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0 flex-column">
          <v-btn
            color="success"
            variant="flat"
            block
            class="mb-2"
            @click="openWhatsAppFromDialog"
          >
            <v-icon start>mdi-whatsapp</v-icon>
            Entrar em contato agora
          </v-btn>

          <v-btn
            variant="text"
            size="small"
            @click="closeContactRequiredDialog"
          >
            Voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de confirmação para desabilitar WhatsApp -->
    <v-dialog v-model="showDisableConfirmModal" max-width="400" persistent>
      <v-card class="disable-confirm-modal">
        <v-card-title class="d-flex align-center pa-4 pb-2">
          <v-icon color="warning" size="28" class="me-2"
            >mdi-alert-circle</v-icon
          >
          <span class="text-h6">Desabilitar WhatsApp</span>
        </v-card-title>

        <v-card-text class="pa-4">
          <div class="text-center">
            <v-icon color="warning" size="64" class="mb-3"
              >mdi-whatsapp-off</v-icon
            >
            <h3 class="text-h6 mb-3">Tem certeza?</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Ao desabilitar as notificações do WhatsApp:
            </p>
            <v-list class="text-start mb-4" density="compact">
              <v-list-item>
                <template #prepend>
                  <v-icon color="error" size="16">mdi-close-circle</v-icon>
                </template>
                <v-list-item-title class="text-body-2">
                  Todos os alertas configurados vão parar de funcionar
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon color="error" size="16">mdi-close-circle</v-icon>
                </template>
                <v-list-item-title class="text-body-2">
                  Você precisará refazer todo o processo de configuração
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <p class="text-body-2 font-weight-medium">
              Deseja realmente continuar?
            </p>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0 flex-column">
          <v-btn
            color="error"
            variant="flat"
            :loading="isLoading"
            :disabled="isLoading"
            block
            class="mb-2"
            @click="confirmDisableWhatsApp"
          >
            <v-icon start>mdi-whatsapp-off</v-icon>
            Sim, desabilitar
          </v-btn>

          <v-btn
            variant="text"
            :disabled="isLoading"
            size="small"
            @click="cancelDisableWhatsApp"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
  import type { User } from '~/types/user'

  type Step = 'contact' | 'phone' | 'verification'
  const { user } = useSanctumAuth<User>()

  definePageMeta({
    middleware: ['sanctum:auth'],
  })

  // Estados principais
  const whatsappEnabled = ref<boolean>(
    user.value?.whatsapp_notification_enabled || false
  )
  const showWhatsAppModal = ref(false)
  const showDisableConfirmModal = ref(false)
  const isLoading = ref(false)

  // Estados do modal
  const currentStep = ref<Step>('contact')
  const phoneNumber = ref('')
  const verificationCode = ref('')
  const phoneError = ref('')
  const codeError = ref('')
  const verifiedPhone = ref('')
  const showContactRequiredDialog = ref(false)

  // Configurações do WhatsApp Business
  const whatsappBusinessNumber = '+55 (41) 3790-0172'
  const whatsappBusinessLink =
    'https://wa.me/554137900172?text=Olá,%20gostaria%20de%20receber%20alertas%20de%20ofertas%20e%20cashbacks'

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
    if (enabled && !user.value?.whatsapp_notification_enabled) {
      showWhatsAppModal.value = true
      resetModal()
    } else if (!enabled && user.value?.whatsapp_notification_enabled) {
      // Mostrar modal de confirmação antes de desabilitar
      showDisableConfirmModal.value = true
      // Reverter o toggle temporariamente
      whatsappEnabled.value = true
    }
  }

  const openWhatsAppContact = () => {
    // Abre o WhatsApp em uma nova aba/janela
    window.open(whatsappBusinessLink, '_blank')

    // Opcional: adicionar um pequeno delay e sugerir que o usuário já entrou em contato
    setTimeout(() => {
      // Você pode mostrar uma mensagem ou automaticamente avançar para o próximo passo
      // currentStep.value = 'phone'
    }, 3000)
  }

  const proceedToPhoneStep = () => {
    currentStep.value = 'phone'
  }

  const openWhatsAppFromDialog = () => {
    // Abre o WhatsApp com uma mensagem específica indicando que é para verificação
    const message = `Olá, gostaria de receber alertas de ofertas e cashbacks. Meu número é ${formatPhone(phoneNumber.value)}`
    const linkWithMessage = `https://wa.me/554137900172?text=${encodeURIComponent(message)}`
    window.open(linkWithMessage, '_blank')
  }

  const retryAfterContact = () => {
    showContactRequiredDialog.value = false
    // Tenta enviar o código novamente
    sendVerificationCode()
  }

  const closeContactRequiredDialog = () => {
    showContactRequiredDialog.value = false
  }

  const sendVerificationCode = async () => {
    if (!isPhoneValid.value) return

    isLoading.value = true
    phoneError.value = ''

    try {
      const cleanPhone = phoneNumber.value.replace(/\D/g, '')
      const { data, error, status } = await useSanctumFetch(`/api/otp/send`, {
        method: 'POST',
        body: {
          phone: `55${cleanPhone}`,
        },
      })

      // Verifica se a resposta indica sucesso
      if (error.value?.statusCode === 404) {
        showContactRequiredDialog.value = true
      } else if (data && data.value) {
        // Sucesso - avança para verificação
        currentStep.value = 'verification'
        startResendCooldown()
      } else {
        // Resposta inesperada
        phoneError.value = 'Erro inesperado. Tente novamente.'
      }
    } catch (error: any) {
      // Erros de rede ou outros erros HTTP
      phoneError.value =
        error.data?.message || 'Erro de conexão. Tente novamente.'
    } finally {
      isLoading.value = false
    }
  }

  const verifyCode = async () => {
    if (verificationCode.value.length !== 5) return

    isLoading.value = true
    codeError.value = ''

    try {
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

      // Sucesso - habilitar WhatsApp
      await enableWhatsAppNotifications(true)
      verifiedPhone.value = phoneNumber.value
      whatsappEnabled.value = true
      showWhatsAppModal.value = false
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
    whatsappEnabled.value = user.value?.whatsapp_notification_enabled || false
    showWhatsAppModal.value = false
    resetModal()
  }

  // Confirmar desabilitação do WhatsApp
  const confirmDisableWhatsApp = async () => {
    isLoading.value = true

    try {
      console.log('API: Desabilitar notificações WhatsApp')
      
      // Chamada para a API
      await useSanctumFetch('/api/user/notification-settings', {
        method: 'PUT',
        body: { 
          whatsapp_notification_enabled: false 
        }
      })

      // Atualizar estado local
      whatsappEnabled.value = false
      if (user.value) {
        user.value.whatsapp_notification_enabled = false
      }

      showDisableConfirmModal.value = false
    } catch (error) {
      console.error('Erro ao desabilitar WhatsApp:', error)
      // Em caso de erro, reverter o estado
      whatsappEnabled.value = true
    } finally {
      isLoading.value = false
    }
  }

  // Cancelar desabilitação
  const cancelDisableWhatsApp = () => {
    showDisableConfirmModal.value = false
    whatsappEnabled.value = true
  }

  // API para habilitar/desabilitar WhatsApp
  const enableWhatsAppNotifications = async (enable: boolean) => {
    const { data, error } = await useSanctumFetch('/api/user/notification-settings', {
      method: 'PUT',
      body: {
        whatsapp_notification_enabled: enable,
      },
    })

    if (error.value) {
      throw new Error('Erro ao atualizar configurações do WhatsApp')
    }

    // Atualizar estado local
    if (user.value) {
      user.value.whatsapp_notification_enabled = enable
    }

    return data.value
  }

  // Utilitários
  const resetModal = () => {
    currentStep.value = 'contact'
    phoneNumber.value = ''
    verificationCode.value = ''
    phoneError.value = ''
    codeError.value = ''
    showContactRequiredDialog.value = false
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
  /* Base styles - mobile first */
  .alert-settings {
    max-width: 600px;
    margin: 0 auto;
    padding: 12px;
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

  /* WhatsApp content layout - mobile first */
  .whatsapp-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .whatsapp-info {
    flex: 1;
  }

  .switch-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .phone-display {
    margin-top: 8px;
  }

  .whatsapp-modal {
    border-radius: 16px;
    overflow: hidden;
  }

  .contact-step,
  .phone-step,
  .verification-step {
    min-height: 120px;
  }

  .contact-info {
    text-align: center;
  }

  /* Contact required modal */
  .contact-required-modal {
    border-radius: 16px;
    overflow: hidden;
  }

  .whatsapp-contact-info {
    margin: 16px 0;
  }

  .step-indicator {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-bottom: 16px;
  }

  .phone-help {
    display: flex;
    align-items: flex-start;
    margin-top: 8px;
    gap: 4px;
  }

  .resend-section {
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
    padding-top: 16px;
  }

  /* Contact actions layout */
  .contact-actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* Card actions layout fix */
  .v-card-actions.flex-column {
    flex-direction: column !important;
    align-items: stretch;
    gap: 0;
  }

  .v-card-actions.flex-column .v-btn {
    width: 100%;
  }

  /* OTP Input customization */
  :deep(.v-otp-input) {
    justify-content: center;
    gap: 8px;
  }

  :deep(.v-otp-input .v-field) {
    min-width: 40px;
    max-width: 50px;
  }

  /* Switch customization */
  :deep(.v-switch .v-selection-control__input) {
    border-radius: 12px;
  }

  /* Tablet and desktop adjustments */
  @media (min-width: 768px) {
    .alert-settings {
      padding: 16px;
    }

    /* Desktop layout for WhatsApp card */
    .whatsapp-content {
      flex-direction: row;
      align-items: flex-start;
      gap: 24px;
    }

    .switch-container {
      justify-content: flex-end;
      min-width: auto;
    }

    /* Desktop layout for contact actions */
    .contact-actions {
      flex-direction: row;
      gap: 12px;
    }

    .contact-actions .v-btn {
      flex: 1;
    }

    .whatsapp-modal .v-card-actions {
      flex-direction: row;
    }

    :deep(.v-otp-input .v-field) {
      min-width: 48px;
      max-width: 56px;
    }
  }

  @media (min-width: 1024px) {
    .step-indicator {
      justify-content: flex-start;
    }
  }
</style>
