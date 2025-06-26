<template>
  <div class="callback-container">
    <v-container class="text-center pa-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        class="mb-4"
      ></v-progress-circular>
      <h2 class="text-h6 mb-2">Processando login...</h2>
      <p class="text-body-2 text-medium-emphasis">
        Aguarde enquanto finalizamos seu login com Google.
      </p>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: false,
    middleware: ['sanctum:guest'],
  })

  const route = useRoute()

  onMounted(async () => {
    try {
      // Verifica se há parâmetros de erro
      if (route.query.error) {
        throw new Error(
          (route.query.error_description as string) ||
            'Erro no login com Google'
        )
      }

      // Verifica se há código de autorização
      if (!route.query.code) {
        throw new Error('Código de autorização não encontrado')
      }

      // Envia o código para o backend processar
      const response = await $fetch('/api/auth/google/callback', {
        method: 'POST',
        body: {
          code: route.query.code,
          state: route.query.state,
        },
      })

      // Se chegou até aqui, o login foi bem-sucedido
      // Envia mensagem de sucesso para a janela pai
      const targetWindow = window.opener || window.parent
      if (targetWindow) {
        targetWindow.postMessage(
          {
            type: 'GOOGLE_LOGIN_SUCCESS',
            data: response,
          },
          '*'
        )
      }

      // Fecha o popup
      window.close()
    } catch (error: any) {
      console.error('Google callback error:', error)

      // Envia mensagem de erro para a janela pai
      const targetWindow = window.opener || window.parent
      if (targetWindow) {
        targetWindow.postMessage(
          {
            type: 'GOOGLE_LOGIN_ERROR',
            message: error.message || 'Erro no login com Google',
          },
          '*'
        )
      }

      // Fecha o popup após um breve delay
      setTimeout(() => {
        window.close()
      }, 2000)
    }
  })
</script>

<style scoped>
  .callback-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fafbfc;
  }
</style>
