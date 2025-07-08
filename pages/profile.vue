<template>
  <v-container class="pa-6">
    <v-row justify="center">
      <v-col cols="12" lg="8">
        <div class="d-flex align-center mb-6">
          <v-btn icon variant="text" @click="goToHome" class="mr-3">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <div>
            <h1 class="text-h4 font-weight-bold">Editar Perfil</h1>
            <p class="text-body-1 text-medium-emphasis mt-1">
              Gerencie suas informações pessoais e preferências
            </p>
          </div>
        </div>

        <v-row>
          <v-col cols="12" md="4">
            <v-card class="elevation-2 rounded-lg mb-6">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-account-circle</v-icon>
                Foto de Perfil
              </v-card-title>
              <v-card-text class="text-center pa-6">
                <div class="d-flex flex-column align-center">
                  <v-avatar
                    class="avatar-preview mb-4"
                    :color="avatarUrl ? 'transparent' : 'primary'"
                    size="120"
                  >
                    <v-img
                      v-if="avatarUrl"
                      :src="avatarUrl"
                      :alt="user?.name"
                      cover
                      @error="onImageError"
                    />
                    <span v-else class="text-h4 font-weight-bold text-white">
                      {{ userInitials }}
                    </span>
                  </v-avatar>

                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    style="display: none"
                    @change="onFileChange"
                  />

                  <v-btn
                    color="primary"
                    variant="outlined"
                    :loading="avatarLoading"
                    @click="selectFile"
                    class="mb-2"
                  >
                    <v-icon class="mr-2">mdi-camera</v-icon>
                    Alterar Foto
                  </v-btn>

                  <p class="text-caption text-medium-emphasis mt-2">
                    PNG, JPEG ou JPG. Máximo 1MB.
                  </p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="8">
            <v-card class="elevation-2 rounded-lg">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-account-edit</v-icon>
                Informações Pessoais
              </v-card-title>
              <v-card-text class="pa-6">
                <v-form ref="profileForm" v-model="profileFormValid">
                  <v-text-field
                    v-model="profileData.name"
                    :rules="nameRules"
                    label="Nome Completo"
                    placeholder="Digite seu nome"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    class="mb-4"
                    required
                  />

                  <v-text-field
                    :model-value="user?.email"
                    label="Email"
                    prepend-inner-icon="mdi-email"
                    variant="outlined"
                    readonly
                    class="mb-4"
                    hint="O email não pode ser alterado"
                    persistent-hint
                  />

                  <div class="d-flex justify-end">
                    <v-btn
                      color="primary"
                      :loading="profileLoading"
                      :disabled="!profileFormValid || !hasProfileChanges"
                      @click="updateProfile"
                    >
                      <v-icon class="mr-2">mdi-content-save</v-icon>
                      Salvar Alterações
                    </v-btn>
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      location="top"
      timeout="3000"
    >
      {{ snackbarMessage }}
      <template #actions>
        <v-btn variant="text" @click="showSnackbar = false"> Fechar </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { useSnackbarStore } from '~/store/snackbar'

  const router = useRouter()
  const { user, refreshIdentity } = useSanctumAuth()

  interface User {
    id: string | number
    name: string
    email: string
    avatar_url?: string
  }

  interface ProfileResponse {
    message: string
  }

  const profileForm = ref()
  const fileInput = ref()

  const profileData = ref({
    name: '',
  })
  const profileFormValid = ref(false)

  const profileLoading = ref(false)
  const avatarLoading = ref(false)
  const avatarKey = ref(0)

  const showSnackbar = ref(false)
  const snackbarMessage = ref('')
  const snackbarColor = ref('success')

  const { nameRules } = useValidators()

  const snackbarStore = useSnackbarStore()

  const avatarUrl = computed(() => {
    if (!user.value?.avatar_url) return null

    const baseUrl = user.value.avatar_url
    const separator = baseUrl.includes('?') ? '&' : '?'
    const cacheBuster = `${separator}t=${avatarKey.value}`

    return baseUrl + cacheBuster
  })

  const userInitials = computed(() => {
    if (!user.value?.name) return 'US'
    const names = user.value.name.split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names.at(-1)[0]).toUpperCase()
    }
    return names[0].slice(0, 2).toUpperCase()
  })

  const hasProfileChanges = computed(() => {
    return profileData.value.name !== user.value?.name
  })

  const showNotification = (message: string, color = 'success') => {
    snackbarMessage.value = message
    snackbarColor.value = color
    showSnackbar.value = true
  }

  const goToHome = () => {
    router.push('/')
  }

  const onImageError = (event: Event) => {}

  const selectFile = () => {
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    fileInput.value?.click()
  }

  const onFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    if (file.size > 1000 * 1024) {
      const sizeInKB = Math.round(file.size / 1024)
      showNotification(
        `Arquivo muito grande (${sizeInKB}KB). Máximo permitido: 1000KB`,
        'error'
      )
      target.value = ''
      return
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      showNotification(
        `Tipo de arquivo não suportado: ${file.type}. Use PNG, JPEG ou JPG`,
        'error'
      )
      target.value = ''
      return
    }

    if (!file.type.startsWith('image/')) {
      showNotification(
        'Por favor, selecione apenas arquivos de imagem',
        'error'
      )
      target.value = ''
      return
    }

    if (file.size === 0) {
      showNotification('Arquivo está vazio ou corrompido', 'error')
      target.value = ''
      return
    }

    await uploadAvatar(file)

    target.value = ''
  }

  const uploadAvatar = async (file: File) => {
    avatarLoading.value = true

    try {
      const oldAvatarUrl = user.value?.avatar_url

      const formData = new FormData()
      formData.append('avatar', file)

      const uploadTime = Date.now()

      const response = await useSanctumFetch<ProfileResponse>(
        '/api/user/avatar',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        }
      )

      const { data, error } = response

      if (data.value) {
        showNotification('Avatar atualizado com sucesso!')

        for (let i = 0; i < 3; i++) {
          await new Promise(resolve => setTimeout(resolve, 300))
          await refreshIdentity()

          if (user.value?.avatar_url !== oldAvatarUrl) {
            break
          }
        }

        avatarKey.value = uploadTime
      }

      if (error.value) {
        const errorData = error.value?.data as any
        let errorMessage = 'Erro ao fazer upload do avatar'

        if (errorData?.message) {
          errorMessage = errorData.message
        } else if (errorData?.errors?.avatar) {
          errorMessage = errorData.errors.avatar[0]
        }

        showNotification(errorMessage, 'error')
      }
    } catch (err) {
      showNotification('Erro ao fazer upload do avatar', 'error')
    } finally {
      avatarLoading.value = false
    }
  }

  const updateProfile = async () => {
    if (!profileFormValid.value) return

    profileLoading.value = true

    try {
      const { data, error } = await useSanctumFetch<ProfileResponse>(
        '/api/user/',
        {
          method: 'PUT',
          body: {
            name: profileData.value.name,
          },
        }
      )

      if (data.value) {
        showNotification('Perfil atualizado com sucesso!')
        await refreshIdentity()
      } else if (error.value) {
        const errorMessage =
          (error.value?.data as any)?.message || 'Erro ao atualizar perfil'
        showNotification(errorMessage, 'error')
      }
    } catch (err) {
      showNotification('Erro ao atualizar perfil', 'error')
    } finally {
      profileLoading.value = false
    }
  }

  const initializeData = () => {
    if (user.value) {
      profileData.value.name = user.value.name || ''
      avatarKey.value = Date.now()
    }
  }

  watch(
    () => user.value?.avatar_url,
    (newAvatar, oldAvatar) => {
      if (newAvatar !== oldAvatar) {
        avatarKey.value = Date.now()
      }
    }
  )

  watch(
    user,
    () => {
      initializeData()
    },
    { immediate: true }
  )

  onMounted(() => {
    initializeData()
  })

  definePageMeta({
    auth: true,
    layout: 'default',
  })
</script>

<style scoped>
  .avatar-preview {
    border: 3px solid rgba(var(--v-theme-primary), 0.2);
    transition: all 0.3s ease;
  }

  .avatar-preview:hover {
    border-color: rgba(var(--v-theme-primary), 0.4);
    transform: scale(1.02);
  }

  .v-card {
    transition: all 0.3s ease;
  }

  .v-card:hover {
    transform: translateY(-2px);
  }

  .v-btn {
    text-transform: none;
  }

  input[type='file'] {
    display: none;
  }

  .v-btn {
    transition: all 0.3s ease;
  }

  .v-btn:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  .v-img {
    transition: opacity 0.3s ease;
  }

  @media (max-width: 960px) {
    .v-container {
      padding: 1rem !important;
    }
  }

  @media (max-width: 600px) {
    .text-h4 {
      font-size: 1.5rem !important;
    }

    .avatar-preview {
      width: 100px !important;
      height: 100px !important;
    }
  }
</style>
