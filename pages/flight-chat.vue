<template>
  <v-container fluid class="pa-0 fill-height">
    <v-row no-gutters class="fill-height">
      <v-col cols="12">
        <v-card elevation="0" class="fill-height">
          <v-card-title class="d-flex align-center bg-primary">
            <v-btn icon variant="text" color="white" @click="navigateTo('/')">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <span class="ml-2 text-white">Busca de Voos com IA</span>
          </v-card-title>

          <FlightChatBox :chat-id="chatId" @chat-created="handleChatCreated" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'sanctum:auth',
})

useSeoMeta({
  title: 'Busca de Voos com IA - Miles & Travel',
  ogTitle: 'Busca de Voos com IA - Miles & Travel',
  description: 'Encontre os melhores voos usando nossa assistente com inteligência artificial',
  ogDescription: 'Encontre os melhores voos usando nossa assistente com inteligência artificial',
})

const route = useRoute()
const router = useRouter()

const chatId = computed(() => {
  const id = route.query.chat_id
  return id ? Number(id) : undefined
})

const handleChatCreated = (newChatId: number) => {
  router.push({
    query: {
      chat_id: newChatId,
    },
  })
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
