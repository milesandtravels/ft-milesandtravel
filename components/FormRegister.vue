<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12">
        <div class="d-flex justify-center">
          <v-card
            class="elevation-8 rounded-lg"
            :width="$vuetify.display.mobile ? '100%' : 700"
          >
            <v-card-title class="text-center pa-6">
              <div class="d-flex flex-column align-center">
                <img src="~/assets/logo.svg" width="100px" />
              </div>
            </v-card-title>

            <v-card-text class="pa-6">
              <!-- Register Form -->
              <div>
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
                    class="mb-4"
                    clearable
                    label="Email"
                    placeholder="Digite seu email"
                    prepend-inner-icon="mdi-email"
                    required
                    :rules="emailRules"
                    type="email"
                    variant="outlined"
                  />

                  <v-text-field
                    v-model="password"
                    class="mb-4"
                    :append-inner-icon="
                      showPassword ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    label="Senha"
                    placeholder="Digite sua senha"
                    prepend-inner-icon="mdi-lock"
                    required
                    :rules="passwordRules"
                    :type="showPassword ? 'text' : 'password'"
                    variant="outlined"
                    @click:append-inner="showPassword = !showPassword"
                  />

                  <v-text-field
                    v-model="passwordConfirmation"
                    class="mb-6"
                    :append-inner-icon="
                      showPasswordConfirmation ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    label="Confirmar senha"
                    placeholder="Confirme sua senha"
                    prepend-inner-icon="mdi-lock-check"
                    required
                    :rules="passwordConfirmationRules"
                    :type="showPasswordConfirmation ? 'text' : 'password'"
                    variant="outlined"
                    @click:append-inner="
                      showPasswordConfirmation = !showPasswordConfirmation
                    "
                  />

                  <v-btn
                    block
                    class="mb-4"
                    color="primary"
                    :loading="isLoading"
                    size="large"
                    type="submit"
                    :disabled="!isFormValid"
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
                  @click="loginWithGoogle"
                >
                  {{
                    isGoogleLoading ? 'Conectando...' : 'Continuar com Google'
                  }}
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
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
import { useSnackbarStore } from '~/store/snackbar'
  const router = useRouter()
  interface RegisterResponse {
    token: string
  }
  // Form data
  const form = ref()
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const passwordConfirmation = ref('')
  const isFormValid = ref(false)

  // Password visibility
  const showPassword = ref(false)
  const showPasswordConfirmation = ref(false)

  // States
  const isLoading = ref(false)

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

  const passwordRules = [
    (v: string) => !!v || 'Senha é obrigatória',
    (v: string) => v.length >= 8 || 'Senha deve ter pelo menos 8 caracteres',
    (v: string) =>
      /(?=.*[a-z])/.test(v) ||
      'Senha deve conter pelo menos uma letra minúscula',
    (v: string) =>
      /(?=.*[A-Z])/.test(v) ||
      'Senha deve conter pelo menos uma letra maiúscula',
    (v: string) =>
      /(?=.*\d)/.test(v) || 'Senha deve conter pelo menos um número',
  ]

  const passwordConfirmationRules = [
    (v: string) => !!v || 'Confirmação de senha é obrigatória',
    (v: string) => v === password.value || 'As senhas não coincidem',
  ]

  const snackbarStore = useSnackbarStore()

  const { loginWithGoogle, isGoogleLoading } = useAuthGoogle()

  const onSubmit = async () => {
    if (!isFormValid.value) return

    isLoading.value = true

    const payload = {
      name: name.value,
      email: email.value,
      password: password.value,
      confirm_password: passwordConfirmation.value,
    }

    const { data, status, error } = await useSanctumFetch<RegisterResponse>(
      '/api/register',
      {
        method: 'POST',
        body: payload,
        query: {
          device_name: navigator.userAgent,
          redirect_url: window.location.href,
        },
      }
    )

    if (data.value) {
      snackbarStore.showSuccess('Cadastro realizado, confirmar e-mail.')
      isLoading.value = false

      useCookie('sanctum.token.cookie').value = data.value?.token
      const { refreshIdentity } = useSanctumAuth()
      await refreshIdentity()

      router.push({
        path: '/confirmation-email',
        query: {
          email: email.value,
        },
      })
    }

    if (error.value) {
      console.error('Register error:', error)
      isLoading.value = false

      const errorMessage = (error.value?.data as any).message
      if (errorMessage) {
        snackbarStore.showError(errorMessage)
        return
      }

      snackbarStore.showError('Erro ao criar conta. Tente novamente.')
    }
  }

  const goToLogin = () => {
    navigateTo('/login')
  }
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

  .v-btn:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  /* Email highlight */
  .text-primary {
    background: linear-gradient(45deg, #1976d2, #42a5f5);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* Password field styling */
  .v-text-field :deep(.v-field__append-inner) {
    cursor: pointer;
  }
</style>
