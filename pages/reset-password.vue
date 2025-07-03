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
              <!-- Reset Password Form -->
              <div>
                <div class="text-center mb-6">
                  <h3 class="text-h6 mb-2">Redefinir senha</h3>
                  <p class="text-body-2 text-medium-emphasis">
                    Digite sua nova senha para redefinir o acesso
                  </p>
                </div>

                <v-form
                  ref="form"
                  v-model="isFormValid"
                  @submit.prevent="onSubmit"
                >
                  <v-text-field
                    v-model="email"
                    class="mb-4"
                    label="Email"
                    placeholder="Digite seu email"
                    prepend-inner-icon="mdi-email"
                    required
                    :rules="emailRules"
                    type="email"
                    variant="outlined"
                    readonly
                    bg-color="grey-lighten-4"
                  />

                  <v-text-field
                    v-model="password"
                    class="mb-4"
                    :append-inner-icon="
                      showPassword ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    label="Nova senha"
                    placeholder="Digite sua nova senha"
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
                    label="Confirmar nova senha"
                    placeholder="Confirme sua nova senha"
                    prepend-inner-icon="mdi-lock-check"
                    required
                    :rules="passwordConfirmationRules(password)"
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
                    <v-icon class="mr-2" left>mdi-lock-reset</v-icon>
                    {{ isLoading ? 'Redefinindo senha...' : 'Redefinir Senha' }}
                  </v-btn>
                </v-form>

                <!-- Back to Login Link -->
                <div class="text-center">
                  <p class="text-body-2 mb-2">Lembrou da senha?</p>
                  <v-btn
                    class="text-none"
                    color="primary"
                    size="small"
                    variant="text"
                    @click="goToLogin"
                  >
                    Voltar para Login
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
const route = useRoute()

interface ResetPasswordResponse {
  message: string
}

// Form data
const form = ref()
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const isFormValid = ref(false)
const token = ref('')

// Password visibility
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

// States
const isLoading = ref(false)

// Use validators composable
const { passwordRules, passwordConfirmationRules, emailRules } = useValidators()

const snackbarStore = useSnackbarStore()

// Initialize email and token from query params
onMounted(() => {
  email.value = (route.query.email as string) || ''
  
  // Decode token from query params
  const encodedToken = route.query.token as string
  if (encodedToken) {
    token.value = decodeURIComponent(encodedToken)
  }
})

const onSubmit = async () => {
  if (!isFormValid.value) return

  isLoading.value = true

  const payload = {
    email: email.value,
    password: password.value,
    password_confirmation: passwordConfirmation.value,
    token: token.value,
  }

  const { data, status, error } = await useSanctumFetch<ResetPasswordResponse>(
    '/api/reset-password',
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
    snackbarStore.showSuccess('Senha redefinida com sucesso!')
    isLoading.value = false

    // Redirect to login page after successful password reset
    await navigateTo('/login')
  }

  if (error.value) {
    console.error('Reset password error:', error)
    isLoading.value = false

    const errorMessage = (error.value?.data as any).message
    if (errorMessage) {
      snackbarStore.showError(errorMessage)
      return
    }

    snackbarStore.showError('Erro ao redefinir senha. Tente novamente.')
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
.v-icon.mdi-lock-reset {
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