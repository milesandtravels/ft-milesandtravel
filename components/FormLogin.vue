<template>
  <div class="login-container">
    <v-container fluid class="pa-0">
      <v-row no-gutters class="fill-height">
        <v-col cols="12" class="d-flex align-center justify-center">
          <div class="login-wrapper">
            <v-card class="login-card" elevation="0">
              <!-- Logo Section -->
              <div class="logo-section">
                <img src="~/assets/logo.svg" alt="Miles&Travels" class="logo" />
              </div>

              <!-- Form Section -->
              <v-card-text class="form-section">
                <v-form
                  ref="form"
                  v-model="isFormValid"
                  @submit.prevent="onSubmit"
                >
                  <v-text-field
                    v-model="email"
                    class="input-field"
                    clearable
                    label="Email"
                    prepend-inner-icon="mdi-email"
                    required
                    :rules="emailRules"
                    type="email"
                    variant="outlined"
                    density="comfortable"
                  />

                  <v-text-field
                    v-model="password"
                    :append-inner-icon="
                      showPassword ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    class="input-field"
                    label="Senha"
                    prepend-inner-icon="mdi-lock"
                    required
                    :rules="passwordRules"
                    :type="showPassword ? 'text' : 'password'"
                    variant="outlined"
                    density="comfortable"
                    @click:append-inner="showPassword = !showPassword"
                  />

                  <v-btn
                    block
                    class="login-btn"
                    color="primary"
                    :loading="isLoading"
                    size="large"
                    type="submit"
                  >
                    Entrar
                  </v-btn>
                </v-form>

                <!-- Forgot Password -->
                <div class="forgot-password-section">
                  <v-btn
                    class="forgot-btn"
                    color="primary"
                    size="small"
                    variant="text"
                    @click="handleForgotPassword"
                  >
                    Esqueceu sua senha?
                  </v-btn>
                </div>

                <!-- Divider -->
                <div class="divider-section">
                  <v-divider />
                  <span class="divider-text">OU</span>
                  <v-divider />
                </div>

                <!-- Google Login -->
                <v-btn
                  block
                  class="google-btn"
                  :loading="isGoogleLoading"
                  prepend-icon="mdi-google"
                  size="large"
                  variant="outlined"
                  @click="loginWithGoogle('google')"
                >
                  Continuar com Google
                </v-btn>

                <!-- Support Section -->
                <div class="support-section">
                  <div class="support-divider" />

                  <div class="support-content">
                    <v-chip
                      class="support-chip"
                      color="primary"
                      variant="outlined"
                      size="small"
                      prepend-icon="mdi-information"
                      @click="navigateTo('register')"
                    >
                      Cadastre-se aqui
                    </v-chip>

                    <p class="support-text">
                      Não sabe como funciona? Acesse nossa central de ajuda
                    </p>

                    <v-btn
                      class="support-btn"
                      color="primary"
                      prepend-icon="mdi-help-circle"
                      variant="outlined"
                      @click="goToSupport"
                    >
                      Como funciona
                    </v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Snackbar -->
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      timeout="3000"
      location="top"
    >
      {{ snackbarMessage }}
      <template #actions>
        <v-btn variant="text" @click="showSnackbar = false"> Fechar </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  const { login } = useSanctumAuth()

  // Form data
  const form = ref()
  const email = ref('')
  const password = ref('')
  const showPassword = ref(false)
  const isFormValid = ref(false)

  // Loading states
  const isLoading = ref(false)

  // Snackbar
  const showSnackbar = ref(false)
  const snackbarMessage = ref('')
  const snackbarColor = ref('error')

  // Validation rules
  const emailRules = [
    (v: string) => !!v || 'Email é obrigatório',
    (v: string) => /.+@.+\..+/.test(v) || 'Email deve ser válido',
  ]

  const passwordRules = [
    (v: string) => !!v || 'Senha é obrigatória',
    (v: string) => v.length >= 6 || 'Senha deve ter pelo menos 6 caracteres',
  ]

  // Show notification
  const showNotification = (message: string, color = 'error') => {
    snackbarMessage.value = message
    snackbarColor.value = color
    showSnackbar.value = true
  }

  // Submit handler
  const onSubmit = async () => {
    if (!isFormValid.value) return

    isLoading.value = true
    const deviceName = navigator.userAgent

    try {
      await login({
        email: email.value,
        password: password.value,
        device_name: deviceName,
      })

      showNotification('Login realizado com sucesso!', 'success')

      // Reset form
      email.value = ''
      password.value = ''
      form.value?.reset()
    } catch (error) {
      console.error('Login error:', error)
      showNotification('Falha ao realizar login. Verifique suas credenciais.')
    } finally {
      isLoading.value = false
    }
  }

  const { loginWithGoogle, isGoogleLoading } = useAuthGoogle()

  // Forgot password handler
  const handleForgotPassword = () => {
    navigateTo('/forgot-password')
  }

  // Support handler
  const goToSupport = () => {
    navigateTo('/faq')
  }
</script>

<style scoped>
  .login-container {
    min-height: 100vh;
    min-height: 100dvh; /* For mobile browsers */
    background: #fafbfc;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .login-wrapper {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  .login-card {
    background: white;
    border-radius: 16px;
    box-shadow:
      0 4px 6px rgba(0, 0, 0, 0.05),
      0 10px 25px rgba(0, 0, 0, 0.04);
    border: 1px solid #f1f5f9;
    overflow: hidden;
  }

  /* Logo Section */
  .logo-section {
    padding: 2rem 1.5rem 1rem;
    text-align: center;
    background: white;
  }

  .logo {
    width: 120px;
    height: auto;
    max-width: 100%;
  }

  /* Form Section */
  .form-section {
    padding: 1rem 1.5rem 2rem !important;
  }

  .input-field {
    margin-bottom: 1rem;
  }

  .input-field :deep(.v-field) {
    border-radius: 12px;
  }

  .login-btn {
    margin-bottom: 1.5rem;
    border-radius: 12px !important;
    font-weight: 600;
    text-transform: none;
    height: 48px;
    font-size: 1rem;
  }

  /* Forgot Password */
  .forgot-password-section {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .forgot-btn {
    text-transform: none;
    font-size: 0.875rem;
    font-weight: 500;
  }

  /* Divider */
  .divider-section {
    display: flex;
    align-items: center;
    margin: 1.5rem 0;
    gap: 1rem;
  }

  .divider-text {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
    white-space: nowrap;
  }

  /* Google Button */
  .google-btn {
    margin-bottom: 1.5rem;
    border-radius: 12px !important;
    text-transform: none;
    font-weight: 500;
    height: 48px;
    border: 1.5px solid #e5e7eb;
  }

  .google-btn:hover {
    border-color: rgb(var(--v-theme-primary));
    background: rgba(var(--v-theme-primary), 0.04);
  }

  /* Support Section */
  .support-section {
    margin-top: 1.5rem;
  }

  .support-divider {
    height: 1px;
    background: #f1f5f9;
    margin-bottom: 1.5rem;
  }

  .support-content {
    text-align: center;
  }

  .support-chip {
    margin-bottom: 0.75rem;
    font-size: 0.75rem;
  }

  .support-text {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .support-btn {
    border-radius: 12px !important;
    text-transform: none;
    font-weight: 500;
    font-size: 0.875rem;
    height: 40px;
  }

  /* Responsive Design */
  @media (max-width: 480px) {
    .login-container {
      padding: 0.75rem;
    }

    .logo {
      width: 100px;
    }

    .form-section {
      padding: 0.75rem 1rem 1.5rem !important;
    }

    .logo-section {
      padding: 1.5rem 1rem 0.75rem;
    }

    .support-text {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 360px) {
    .login-container {
      padding: 0.5rem;
    }

    .form-section {
      padding: 0.5rem 0.75rem 1rem !important;
    }

    .logo-section {
      padding: 1rem 0.75rem 0.5rem;
    }
  }

  /* Landscape mobile */
  @media (max-height: 600px) and (orientation: landscape) {
    .login-container {
      padding: 0.5rem;
      align-items: flex-start;
      padding-top: 1rem;
    }

    .logo-section {
      padding: 1rem 1.5rem 0.5rem;
    }

    .logo {
      width: 80px;
    }
  }

  /* Tablet */
  @media (min-width: 768px) {
    .login-wrapper {
      max-width: 420px;
    }

    .form-section {
      padding: 1.5rem 2rem 2.5rem !important;
    }

    .logo-section {
      padding: 2.5rem 2rem 1.5rem;
    }

    .logo {
      width: 140px;
    }
  }

  /* Desktop */
  @media (min-width: 1024px) {
    .login-wrapper {
      max-width: 440px;
    }
  }

  /* High DPI displays */
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .logo {
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
    }
  }

  /* Dark theme */
  :deep(.v-theme--dark) {
    .login-container {
      background: #121212;
    }

    .login-card {
      background: rgb(var(--v-theme-surface));
      border-color: rgba(255, 255, 255, 0.12);
    }

    .logo-section {
      background: rgb(var(--v-theme-surface));
    }

    .support-divider {
      background: rgba(255, 255, 255, 0.12);
    }

    .divider-text {
      color: rgba(255, 255, 255, 0.7);
    }

    .support-text {
      color: rgba(255, 255, 255, 0.7);
    }

    .google-btn {
      border-color: rgba(255, 255, 255, 0.23);
    }
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .login-card {
      border: 2px solid rgb(var(--v-theme-primary));
    }

    .google-btn {
      border-width: 2px;
    }
  }

  /* Print styles */
  @media print {
    .floating-support {
      display: none;
    }
  }
</style>
