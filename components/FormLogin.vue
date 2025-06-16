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
            <v-form ref="form" v-model="isFormValid" @submit.prevent="onSubmit">
              <v-text-field
                v-model="email"
                class="mb-4"
                clearable
                label="Email"
                prepend-inner-icon="mdi-email"
                required
                :rules="emailRules"
                type="email"
                variant="outlined"
              />

              <v-text-field
                v-model="password"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                class="mb-4"
                label="Senha"
                prepend-inner-icon="mdi-lock"
                required
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="showPassword = !showPassword"
              />

              <v-btn
                block
                class="mb-4"
                color="primary"
                :loading="isLoading"
                size="large"
                type="submit"
              >
                Entrar
              </v-btn>
            </v-form>

            <!-- Forgot Password Link -->
            <div class="text-center mb-4">
              <v-btn
                class="text-none"
                color="primary"
                size="small"
                variant="text"
                @click="handleForgotPassword"
              >
                Esqueceu sua senha?
              </v-btn>
            </div>

            <v-divider class="my-4">
              <span class="text-body-2 px-3">OU</span>
            </v-divider>

            <v-btn
              block
              class="text-none"
              :loading="isGoogleLoading"
              prepend-icon="mdi-google"
              size="large"
              variant="outlined"
              @click="loginWithGoogle"
            >
              Continuar com Google
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      timeout="3000"
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
  const { login } = useSanctumAuth()
  // Form data
  const form = ref()
  const email = ref('')
  const password = ref('')
  const showPassword = ref(false)
  const isFormValid = ref(false)

  // Loading states
  const isLoading = ref(false)
  const isGoogleLoading = ref(false)

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

  // Mock API call
  const mockLogin = async (email: string, password: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Test credentials
        if (email === 'admin@test.com' && password === 'admin123') {
          resolve({
            success: true,
            token: 'mock-token',
            user: { name: 'Admin', email },
          })
        } else {
          reject(new Error('Credenciais inválidas'))
        }
      }, 1000)
    })
  }

  // Submit handler
  const onSubmit = async () => {
    if (!isFormValid.value) return

    isLoading.value = true
    // get device name
    const deviceName = navigator.userAgent

    try {
      await login({
        email: email.value,
        password: password.value,
        device_name: deviceName
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

  const router = useRouter()

  // Google login handler
  const loginWithGoogle = async () => {
    isGoogleLoading.value = true

    try {
      // Mock Google login
      await new Promise(resolve => setTimeout(resolve, 1500))

      showNotification('Login com Google realizado com sucesso!', 'success')
      console.log('Google login success')
    } catch (error) {
      console.error('Google login error:', error)
      showNotification('Falha ao conectar com Google.')
    } finally {
      isGoogleLoading.value = false
    }
  }

  // Forgot password handler
  const handleForgotPassword = () => {
    router.push('/forgot-password')
  }
</script>

<style scoped>
  .v-card {
    max-width: 100%;
  }

  .v-btn {
    text-transform: none;
  }
</style>
