<template>
  <v-container fluid class="chat-container pa-0">
    <v-card class="chat-card d-flex flex-column" elevation="0">
      <!-- Chat Messages Area -->
      <v-card-text ref="messagesContainer" class="messages-area flex-grow-1 overflow-y-auto">
        <div v-if="messages.length === 0" class="text-center text-medium-emphasis pa-8">
          <v-icon size="64" class="mb-4">mdi-chat-outline</v-icon>
          <div class="text-h6">Olá! Como posso ajudar com sua busca de voos?</div>
          <div class="text-body-2 mt-2">
            Descreva sua viagem, incluindo origem, destino, datas e número de passageiros
          </div>
        </div>

        <div v-for="message in messages" :key="message.id" class="message-wrapper mb-4">
          <div :class="['message-bubble', message.role === 'user' ? 'user-message' : 'assistant-message']">
            <div class="message-header d-flex align-center mb-1">
              <v-icon size="20" class="mr-2">
                {{ message.role === 'user' ? 'mdi-account-circle' : 'mdi-robot' }}
              </v-icon>
              <span class="text-caption font-weight-medium">
                {{ message.role === 'user' ? 'Você' : 'Assistente' }}
              </span>
            </div>
            <div class="message-content">{{ message.content }}</div>
            <div class="message-time text-caption text-medium-emphasis mt-1">
              {{ formatTime(message.created_at) }}
            </div>
          </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="isLoading" class="message-wrapper mb-4">
          <div class="message-bubble assistant-message">
            <div class="message-header d-flex align-center mb-1">
              <v-icon size="20" class="mr-2">mdi-robot</v-icon>
              <span class="text-caption font-weight-medium">Assistente</span>
            </div>
            <div class="d-flex align-center">
              <v-progress-circular indeterminate size="20" width="2" class="mr-2" />
              <span class="text-body-2">Processando sua solicitação...</span>
            </div>
          </div>
        </div>
      </v-card-text>

      <!-- Input Area -->
      <v-divider />
      <v-card-actions class="input-area pa-4">
        <v-textarea
          v-model="newMessage"
          placeholder="Digite sua mensagem..."
          rows="2"
          auto-grow
          variant="outlined"
          hide-details
          class="flex-grow-1"
          @keydown.enter.exact.prevent="sendMessage"
          :disabled="isLoading"
        />
        <v-btn
          icon="mdi-send"
          color="primary"
          class="ml-2"
          :disabled="!newMessage.trim() || isLoading"
          @click="sendMessage"
        />
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import type { ChatMessage, FlightChatResponse } from '~/interfaces/FlightChat';

const props = defineProps<{
  chatId?: number
}>()

const emit = defineEmits<{
  chatCreated: [chatId: number]
}>()

const messagesContainer = ref<HTMLElement | null>(null)
const newMessage = ref('')
const messages = ref<ChatMessage[]>([])
const isLoading = ref(false)
const currentChatId = ref<number | undefined>(props.chatId)
const pollInterval = ref<NodeJS.Timeout | null>(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const createNewChat = async (message: string) => {
  try {
    isLoading.value = true
    console.log('[CHAT] Criando novo chat com mensagem:', message)

    const { data } = await useSanctumFetch<FlightChatResponse>('/api/flight-searches/chats', {
      method: 'POST',
      body: {
        message,
      },
    })

    console.log('[CHAT] Resposta do POST:', data.value)

    if (data.value?.data) {
      currentChatId.value = data.value.data.id
      console.log('[CHAT] Chat criado com ID:', currentChatId.value)
      emit('chatCreated', data.value.data.id)

      // Fazer primeira busca imediata
      await fetchChatMessages()

      // Iniciar polling
      startPolling()
      console.log('[CHAT] Polling iniciado')
    }
  } catch (error) {
    console.error('[CHAT] Erro ao criar chat:', error)
    isLoading.value = false
  } finally {
    isLoading.value = false
  }
}

const addMessage = async (message: string) => {
  if (!currentChatId.value) return

  try {
    isLoading.value = true
    console.log('[CHAT] Adicionando mensagem ao chat', currentChatId.value, ':', message)

    await useSanctumFetch(`/api/flight-searches/chats/${currentChatId.value}/messages`, {
      method: 'POST',
      body: {
        message,
      },
    })

    console.log('[CHAT] Mensagem adicionada, buscando atualizações...')

    // Fazer busca imediata após adicionar mensagem
    await fetchChatMessages()
  } catch (error) {
    console.error('[CHAT] Erro ao adicionar mensagem:', error)
    isLoading.value = false
  } finally {
    isLoading.value = false
  }
}

const fetchChatMessages = async () => {
  if (!currentChatId.value) {
    console.log('[CHAT] fetchChatMessages: currentChatId está vazio')
    return
  }

  try {
    console.log('[CHAT] Buscando mensagens do chat:', currentChatId.value)

    const { data } = await useSanctumFetch<FlightChatResponse>(
      `/api/flight-searches/chats/${currentChatId.value}`
    )

    console.log('[CHAT] Resposta do GET:', data.value)

    if (data.value?.data) {
      const previousLength = messages.value.length
      messages.value = data.value.data.messages

      console.log('[CHAT] Mensagens atualizadas. Anterior:', previousLength, 'Atual:', messages.value.length)
      console.log('[CHAT] Status:', data.value.data.status)

      if (messages.value.length > previousLength) {
        scrollToBottom()
      }

      if (data.value.data.status === 'completed' || data.value.data.status === 'failed') {
        console.log('[CHAT] Chat finalizado, parando loading')
        isLoading.value = false
      }
    }
  } catch (error) {
    console.error('[CHAT] Erro ao buscar mensagens:', error)
  }
}

const startPolling = () => {
  console.log('[CHAT] Iniciando polling...')

  if (pollInterval.value) {
    console.log('[CHAT] Limpando polling anterior')
    clearInterval(pollInterval.value)
  }

  pollInterval.value = setInterval(() => {
    console.log('[CHAT] Polling tick - buscando mensagens...')
    fetchChatMessages()
  }, 2000)

  console.log('[CHAT] Polling configurado com intervalo de 2000ms')
}

const stopPolling = () => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
    pollInterval.value = null
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value) return

  const messageText = newMessage.value.trim()
  newMessage.value = ''

  messages.value.push({
    id: Date.now(),
    content: messageText,
    role: 'user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  scrollToBottom()

  if (!currentChatId.value) {
    await createNewChat(messageText)
  } else {
    await addMessage(messageText)
  }
}

watch(
  () => props.chatId,
  (newChatId) => {
    if (newChatId) {
      currentChatId.value = newChatId
      fetchChatMessages()
      startPolling()
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (currentChatId.value) {
    fetchChatMessages()
    startPolling()
  }
})

onUnmounted(() => {
  stopPolling()
})
</script>

<style scoped>
.chat-container {
  height: 100%;
  max-height: 100vh;
}

.chat-card {
  height: 100%;
  max-height: 100vh;
}

.messages-area {
  max-height: calc(100vh - 180px);
  min-height: 400px;
}

.message-wrapper {
  display: flex;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
}

.user-message {
  margin-left: auto;
  background-color: rgb(var(--v-theme-primary));
  color: white;
}

.assistant-message {
  margin-right: auto;
  background-color: rgb(var(--v-theme-success));
}

.user-message .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.input-area {
  background-color: rgb(var(--v-theme-surface));
}

@media (max-width: 600px) {
  .messages-area {
    max-height: calc(100vh - 200px);
  }

  .message-bubble {
    max-width: 85%;
  }
}
</style>
