<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" lg="4" md="6" sm="8">
        <v-card class="elevation-8 rounded-lg">
          <v-card-title class="text-center pa-6">
            <div class="d-flex flex-column align-center">
              <img src="~/assets/logo.svg" width="140px" />
            </div>
          </v-card-title>

          <v-card-text class="pa-6">
            <!-- Success Message -->
            <div v-if="isSuccess" class="text-center">
              <v-icon class="mb-4" color="success" size="64"
                >mdi-check-circle</v-icon
              >
              <h3 class="text-h6 mb-3">Link enviado com sucesso!</h3>
              <p class="text-body-1 mb-6 text-medium-emphasis">
                Um link para recuperar sua senha foi enviado para seu email.
                Verifique sua caixa de entrada e spam.
              </p>

              <v-btn
                block
                class="mb-4"
                color="primary"
                size="large"
                @click="goBackToLogin"
              >
                <v-icon class="mr-2" left>mdi-arrow-left</v-icon>
                Voltar para Login
              </v-btn>
            </div>

            <!-- Forgot Password Form -->
            <div v-else>
              <div class="text-center mb-6">
                <h3 class="text-h6 mb-2">Esqueceu sua senha?</h3>
                <p class="text-body-2 text-medium-emphasis">
                  Digite seu email e enviaremos um link para redefinir sua senha
                </p>
              </div>

              <v-form
                ref="form"
                v-model="isFormValid"
                @submit.prevent="onSubmit"
              >
                <v-text-field
                  v-model="email"
                  class="mb-6"
                  clearable
                  label="Email"
                  placeholder="Digite seu email"
                  prepend-inner-icon="mdi-email"
                  required
                  :rules="emailRules"
                  type="email"
                  variant="outlined"
                />

                <v-btn
                  block
                  class="mb-4"
                  color="primary"
                  :loading="isLoading"
                  size="large"
                  type="submit"
                >
                  <v-icon class="mr-2" left>mdi-email-send</v-icon>
                  {{ isLoading ? 'Enviando...' : 'Recuperar Senha' }}
                </v-btn>

                <v-btn
                  block
                  class="text-none"
                  :disabled="isLoading"
                  size="large"
                  variant="outlined"
                  @click="goBackToLogin"
                >
                  <v-icon class="mr-2" left>mdi-arrow-left</v-icon>
                  Voltar para Login
                </v-btn>
              </v-form>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      timeout="4000"
      top
    >
      {{ snackbarMessage }}
      <template #actions>
        <v-btn variant="text" @click="showSnackbar = false"> Fechar </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  // Form data
  const form = ref()
  const email = ref('')
  const isFormValid = ref(false)

  // States
  const isLoading = ref(false)
  const isSuccess = ref(false)

  // Snackbar
  const showSnackbar = ref(false)
  const snackbarMessage = ref('')
  const snackbarColor = ref('error')

  // Validation rules
  const emailRules = [
    (v: string) => !!v || 'Email é obrigatório',
    (v: string) => /.+@.+\..+/.test(v) || 'Email deve ser válido',
  ]

  // Show notification
  const showNotification = (message: string, color = 'error') => {
    snackbarMessage.value = message
    snackbarColor.value = color
    showSnackbar.value = true
  }

  // Mock API call for password recovery
  const mockForgotPassword = async (email: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simula diferentes cenários
        if (email.includes('@')) {
          resolve({
            success: true,
            message: 'Link de recuperação enviado com sucesso',
          })
        } else {
          reject(new Error('Email não encontrado'))
        }
      }, 1200)
    })
  }

  // Submit handler
  const onSubmit = async () => {
    if (!isFormValid.value) return

    isLoading.value = true

    try {
      const result = await mockForgotPassword(email.value)
      console.log('Forgot password success:', result)

      // Show success state
      isSuccess.value = true
    } catch (error) {
      console.error('Forgot password error:', error)
      showNotification(
        'Erro ao enviar email. Verifique se o email está correto.'
      )
    } finally {
      isLoading.value = false
    }
  }

  const router = useRouter()
  // Go back to login
  const goBackToLogin = () => {
    console.log('Going back to login')
    // Em uma aplicação real:
    navigateTo('/login')

    // Para demo, reseta o formulário
    if (isSuccess.value) {
      isSuccess.value = false
      email.value = ''
      form.value?.reset()
    }
  }

  // Log test info
  console.log('💡 Qualquer email válido funcionará para teste')
</script>

<style scoped>
  .v-card {
    max-width: 100%;
  }

  .v-btn {
    text-transform: none;
  }

  /* Success state styling */
  .v-icon.mdi-check-circle {
    animation: success-bounce 0.6s ease-out;
  }

  @keyframes success-bounce {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* Smooth transitions */
  .v-btn {
    transition: all 0.3s ease;
  }

  .v-btn:hover {
    transform: translateY(-1px);
  }
</style>
