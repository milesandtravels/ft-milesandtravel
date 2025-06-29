<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" lg="6" md="8" sm="8">
        <v-card class="elevation-8 rounded-lg">
          <v-card-text class="pa-6">
            <div class="text-center">
              <v-icon class="mb-4" color="success" size="64">
                mdi-email-check
              </v-icon>
              <h3 class="text-h6 mb-3">Cadastro realizado com sucesso!</h3>
              <p class="text-body-1 mb-3 text-medium-emphasis">
                Um email de confirmação foi enviado para:
              </p>
              <p class="text-body-1 font-weight-bold mb-4 text-primary">
                {{ emailDisplay }}
              </p>
              <p class="text-body-2 mb-6 text-medium-emphasis">
                Verifique sua caixa de entrada e spam. Clique no link para
                confirmar sua conta.
              </p>

              <!-- Alerta se não há email -->
              <v-alert
                v-if="!hasEmail"
                type="warning"
                class="mb-4"
                text="Email não informado na URL"
              />

              <!-- Timer para reenvio -->
              <v-card
                v-if="hasEmail && showResendOption"
                variant="outlined"
                class="mb-4 pa-3"
              >
                <p class="text-body-2 mb-2">Não recebeu o email?</p>
                <v-btn
                  :disabled="isResending || resendCooldown > 0"
                  :loading="isResending"
                  color="secondary"
                  size="small"
                  variant="outlined"
                  @click="resendConfirmationEmail"
                >
                  <template v-if="resendCooldown > 0">
                    Reenviar em {{ resendCooldown }}s
                  </template>
                  <template v-else> Reenviar Email </template>
                </v-btn>
              </v-card>

              <v-btn
                block
                class="mb-4"
                color="primary"
                size="large"
                @click="goToLogin"
              >
                <v-icon class="mr-2">mdi-login</v-icon>
                Ir para Login
              </v-btn>

              <v-btn
                block
                class="text-none"
                size="large"
                variant="outlined"
                @click="resetForm"
              >
                <v-icon class="mr-2">mdi-account-plus</v-icon>
                Cadastrar outro usuário
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { useSnackbarStore } from '../store/snackbar'

  const route = useRoute()
  const router = useRouter()
  const snackbarStore = useSnackbarStore()

  // Estados reativos
  const isResending = ref(false)
  const resendCooldown = ref(0)
  const showResendOption = ref(true)

  // Computed properties
  const emailDisplay = computed(() => {
    const email = route.query.email
    return typeof email === 'string' ? email : 'Não informado'
  })

  const hasEmail = computed(() => {
    return typeof route.query.email === 'string' && route.query.email.length > 0
  })

  // Função para ir para a página de login
  const goToLogin = (): void => {
    router.push('/login')
  }

  // Função para voltar ao formulário de cadastro
  const resetForm = (): void => {
    router.push('/register')
  }

  // Função para reenviar email de confirmação
  const resendConfirmationEmail = async (): Promise<void> => {
    if (!hasEmail.value) return

    isResending.value = true

    try {
      await useSanctumFetch('/api/email/verification-notification', {
        method: 'POST',
        body: {
          email: route.query.email,
        },
      })

      snackbarStore.showSuccess('Email de confirmação reenviado!')

      // Iniciar cooldown de 60 segundos
      startResendCooldown()
    } catch (error: any) {
      console.error('Resend error:', error)
      snackbarStore.showError('Erro ao reenviar email. Tente novamente.')
    } finally {
      isResending.value = false
    }
  }

  // Função para iniciar o cooldown do reenvio
  const startResendCooldown = (): void => {
    resendCooldown.value = 60

    const interval = setInterval(() => {
      resendCooldown.value--

      if (resendCooldown.value <= 0) {
        clearInterval(interval)
      }
    }, 1000)
  }

  // Verificar se há email na URL ao montar o componente
  onMounted(() => {
    if (!hasEmail.value) {
      snackbarStore.showWarning('Email não encontrado na URL')
    }
  })

  // Meta tags para SEO
  useSeoMeta({
    title: 'Confirmação de Email - Cadastro Realizado',
    description:
      'Cadastro realizado com sucesso. Verifique seu email para confirmar a conta.',
  })

  // Middleware para verificar se veio da página correta (opcional)
  definePageMeta({
    layout: 'auth', // se você tiver um layout específico para auth
  })
</script>
