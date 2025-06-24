<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" lg="4" md="6" sm="8">
        <v-card class="elevation-8 rounded-lg">
          <v-card-title class="text-center pa-6">
            <div class="d-flex flex-column align-center">
              <img src="~/assets/logo.svg" width="100px" />
            </div>
          </v-card-title>

          <v-card-text class="pa-6">
            <!-- Success Message -->
            <div v-if="isSuccess" class="text-center">
              <v-icon class="mb-4" color="success" size="64"
                >mdi-email-check</v-icon
              >
              <h3 class="text-h6 mb-3">Cadastro realizado com sucesso!</h3>
              <p class="text-body-1 mb-3 text-medium-emphasis">
                Um email de confirmação foi enviado para:
              </p>
              <p class="text-body-1 font-weight-bold mb-4 text-primary">
                {{ registeredEmail }}
              </p>
              <p class="text-body-2 mb-6 text-medium-emphasis">
                Verifique sua caixa de entrada e spam. Clique no link para criar
                sua senha de acesso.
              </p>

              <v-btn
                block
                class="mb-4"
                color="primary"
                size="large"
                @click="goToLogin"
              >
                <v-icon class="mr-2" left>mdi-login</v-icon>
                Ir para Login
              </v-btn>

              <v-btn
                block
                class="text-none"
                size="large"
                variant="outlined"
                @click="resetForm"
              >
                <v-icon class="mr-2" left>mdi-account-plus</v-icon>
                Cadastrar outro usuário
              </v-btn>
            </div>

            <!-- Register Form -->
            <div v-else>
              <div class="text-center mb-6">
                <h3 class="text-h6 mb-2">Criar nova conta</h3>
                <p class="text-body-2 text-medium-emphasis">
                  Preencha os dados abaixo para começar
                </p>
              </div>

              <v-form
                ref="form"
                v-model="isFormValid"
                @submit.prevent="onSubmit"
              >
                <v-text-field
                  v-model="name"
                  class="mb-4"
                  clearable
                  label="Nome completo"
                  placeholder="Digite seu nome"
                  prepend-inner-icon="mdi-account"
                  required
                  :rules="nameRules"
                  variant="outlined"
                />

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
                  <v-icon class="mr-2" left>mdi-account-plus</v-icon>
                  {{ isLoading ? 'Criando conta...' : 'Criar Conta' }}
                </v-btn>
              </v-form>

              <v-divider class="my-4">
                <span class="text-body-2 px-3">OU</span>
              </v-divider>

              <v-btn
                block
                class="text-none mb-4"
                :loading="isGoogleLoading"
                prepend-icon="mdi-google"
                size="large"
                variant="outlined"
                @click="registerWithGoogle"
              >
                {{ isGoogleLoading ? 'Conectando...' : 'Continuar com Google' }}
              </v-btn>

              <!-- Back to Login Link -->
              <div class="text-center">
                <p class="text-body-2 mb-2">Já tem uma conta?</p>
                <v-btn
                  class="text-none"
                  color="primary"
                  size="small"
                  variant="text"
                  @click="goToLogin"
                >
                  Fazer Login
                </v-btn>
              </div>
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

  const router = useRouter()

  // Form data
  const form = ref()
  const name = ref('')
  const email = ref('')
  const isFormValid = ref(false)

  // States
  const isLoading = ref(false)
  const isGoogleLoading = ref(false)
  const isSuccess = ref(false)
  const registeredEmail = ref('')

  // Snackbar
  const showSnackbar = ref(false)
  const snackbarMessage = ref('')
  const snackbarColor = ref('error')

  // Validation rules
  const nameRules = [
    (v: string) => !!v || 'Nome é obrigatório',
    (v: string) => v.length >= 2 || 'Nome deve ter pelo menos 2 caracteres',
    (v: string) => v.length <= 50 || 'Nome muito longo',
  ]

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

  // Mock API call for user registration
  const mockRegister = async (name: string, email: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simula verificação de email já existente
        if (email === 'exists@test.com') {
          reject(new Error('Este email já está em uso'))
        } else if (name.length >= 2 && email.includes('@')) {
          resolve({
            success: true,
            message: 'Usuário cadastrado com sucesso',
            email: email,
          })
        } else {
          reject(new Error('Dados inválidos'))
        }
      }, 1500)
    })
  }

  // Mock Google registration
  const mockGoogleRegister = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Cadastro com Google realizado',
          user: {
            name: 'Usuário Google',
            email: 'user@gmail.com',
          },
        })
      }, 1200)
    })
  }

  // Submit handler
  const onSubmit = async () => {
    if (!isFormValid.value) return

    isLoading.value = true

    try {
      const result = await mockRegister(name.value, email.value)
      console.log('Register success:', result)

      // Show success state
      registeredEmail.value = email.value
      isSuccess.value = true
    } catch (error: any) {
      console.error('Register error:', error)
      showNotification(error.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      isLoading.value = false
    }
  }

  // Google register handler
  const registerWithGoogle = async () => {
    isGoogleLoading.value = true

    try {
      const result = await mockGoogleRegister()
      console.log('Google register success:', result)

      showNotification('Cadastro com Google realizado com sucesso!', 'success')

      // Simula redirecionamento direto (Google já tem email verificado)
      setTimeout(() => {
        console.log('Redirecting to dashboard...')
        // router.push('/dashboard')
      }, 1500)
    } catch (error) {
      console.error('Google register error:', error)
      showNotification('Erro ao cadastrar com Google. Tente novamente.')
    } finally {
      isGoogleLoading.value = false
    }
  }

  // Navigation functions
  const goToLogin = () => {
    navigateTo('/login')
  }

  const resetForm = () => {
    isSuccess.value = false
    name.value = ''
    email.value = ''
    registeredEmail.value = ''
    form.value?.reset()
  }

  // Log test info
  console.log('💡 Dicas para teste:')
  console.log('✅ Qualquer nome (2+ chars) e email válido funcionará')
  console.log('❌ Email "exists@test.com" simulará erro de email já existente')
</script>

<style scoped>
  .v-card {
    max-width: 100%;
  }

  .v-btn {
    text-transform: none;
  }

  /* Success state styling */
  .v-icon.mdi-email-check {
    animation: success-bounce 0.6s ease-out;
  }

  @keyframes success-bounce {
    0% {
      transform: scale(0) rotate(-45deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.1) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: scale(1) rotate(0deg);
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

  /* Email highlight */
  .text-primary {
    background: linear-gradient(45deg, #1976d2, #42a5f5);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
