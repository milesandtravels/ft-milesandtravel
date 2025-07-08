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
              <!-- Change Password Form -->
              <div>
                <div class="text-center mb-6">
                  <h3 class="text-h6 mb-2">Alterar Senha</h3>
                  <p class="text-body-2 text-medium-emphasis">
                    Digite uma nova senha para sua conta
                  </p>
                </div>

                <v-form
                  ref="form"
                  v-model="isFormValid"
                  @submit.prevent="onSubmit"
                >
                  <v-text-field
                    v-model="password"
                    class="mb-4"
                    :append-inner-icon="
                      showPassword ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    label="Nova Senha"
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
                    label="Confirmar Nova Senha"
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

                  <!-- Password Requirements -->
                  <v-alert
                    class="mb-6"
                    type="info"
                    variant="tonal"
                    density="compact"
                  >
                    <div class="text-body-2">
                      <strong>Requisitos da senha:</strong>
                      <ul class="mt-2 ml-4">
                        <li>Mínimo de 8 caracteres</li>
                        <li>Pelo menos uma letra maiúscula</li>
                        <li>Pelo menos uma letra minúscula</li>
                        <li>Pelo menos um número</li>
                      </ul>
                    </div>
                  </v-alert>

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
                    {{ isLoading ? 'Alterando senha...' : 'Alterar Senha' }}
                  </v-btn>
                </v-form>

                <!-- Back to Dashboard Link -->
                <div class="text-center">
                  <v-btn
                    class="text-none"
                    color="primary"
                    size="small"
                    variant="text"
                    prepend-icon="mdi-arrow-left"
                    @click="goBack"
                  >
                    Voltar
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <!-- Success Dialog -->
    <v-dialog v-model="showSuccessDialog" max-width="400" persistent>
      <v-card>
        <v-card-text class="text-center pa-8">
          <v-icon class="mb-4 success-icon" color="success" size="64">
            mdi-check-circle
          </v-icon>
          <h3 class="text-h6 mb-2">Senha Alterada!</h3>
          <p class="text-body-2 text-medium-emphasis">
            Sua senha foi alterada com sucesso.
          </p>
        </v-card-text>
        <v-card-actions class="justify-center pb-6">
          <v-btn color="primary" variant="flat" @click="goToHome">
            Continuar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
import { useSnackbarStore } from '~/store/snackbar'

  const router = useRouter()

  interface ChangePasswordResponse {
    message: string
  }

  // Form data
  const form = ref()
  const password = ref('')
  const passwordConfirmation = ref('')
  const isFormValid = ref(false)

  // Password visibility
  const showPassword = ref(false)
  const showPasswordConfirmation = ref(false)

  // States
  const isLoading = ref(false)
  const showSuccessDialog = ref(false)

  // Use validators composable
  const { passwordRules, passwordConfirmationRules } = useValidators()

  const snackbarStore = useSnackbarStore()

  const onSubmit = async () => {
    if (!isFormValid.value) return

    isLoading.value = true

    const payload = {
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    }

    const { data, status, error } =
      await useSanctumFetch<ChangePasswordResponse>('/api/user/password', {
        method: 'PUT',
        body: payload,
      })

    if (data.value) {
      isLoading.value = false
      showSuccessDialog.value = true
    }

    if (error.value) {
      console.error('Change password error:', error)
      isLoading.value = false

      const errorMessage = (error.value?.data as any).message
      if (errorMessage) {
        snackbarStore.showError(errorMessage)
        return
      }

      snackbarStore.showError('Erro ao alterar senha. Tente novamente.')
    }
  }

  const goBack = () => {
    router.back()
  }

  const goToHome = () => {
    showSuccessDialog.value = false
    navigateTo('/')
  }

  // Set page meta
  definePageMeta({
    auth: true,
    layout: 'auth',
  })
</script>

<style scoped>
  .v-card {
    max-width: 100%;
  }

  .v-btn {
    text-transform: none;
  }

  /* Success state styling */
  .success-icon {
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

  /* Password field styling */
  .v-text-field :deep(.v-field__append-inner) {
    cursor: pointer;
  }

  /* Requirements list styling */
  .v-alert ul {
    list-style-type: disc;
  }

  .v-alert li {
    margin-bottom: 4px;
  }

  /* Responsive adjustments */
  @media (max-width: 600px) {
    .v-card-text {
      padding: 1rem !important;
    }

    .v-card-title {
      padding: 1rem !important;
    }
  }
</style>
