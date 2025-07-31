<template>
  <div>
    <!-- Conteúdo específico por tipo de notificação -->
    <div v-if="notification.type === 'alert-offer-price-change'">
      <!-- Alerta de mudança de preço -->
      <div class="d-flex flex-column gap-4">
        <!-- Imagem do produto -->
        <div v-if="notification.data.product_image" class="text-center">
          <v-img
            :src="notification.data.product_image"
            :alt="notification.data.product_name"
            max-height="200"
            contain
            class="mx-auto"
          ></v-img>
        </div>

        <!-- Nome do produto -->
        <div>
          <h3 class="text-h6 mb-2">Produto</h3>
          <p class="text-body-1">
            {{ notification.data.product_name }}
          </p>
        </div>

        <!-- Informações de preço -->
        <div>
          <h3 class="text-h6 mb-2">Alteração de Preço</h3>
          <div class="d-flex gap-4">
            <div>
              <p class="text-caption text-medium-emphasis">Preço Anterior</p>
              <p class="text-h6 text-decoration-line-through text-error">
                R$
                {{ formatPrice(notification.data.old_price || 0) }}
              </p>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis">Preço Atual</p>
              <p class="text-h6 text-success">
                R$
                {{ formatPrice(notification.data.new_price || 0) }}
              </p>
            </div>
          </div>

          <!-- Diferença de preço -->
          <div
            class="mt-2"
            v-if="notification.data.old_price && notification.data.new_price"
          >
            <v-chip
              :color="
                getPriceChangeColor(
                  notification.data.old_price || 0,
                  notification.data.new_price || 0
                )
              "
              size="small"
            >
              {{
                getPriceChangeText(
                  notification.data.old_price || 0,
                  notification.data.new_price || 0
                )
              }}
            </v-chip>
          </div>
        </div>

        <!-- ID da busca -->
        <div v-if="notification.data.search_id">
          <h3 class="text-h6 mb-2">Busca Relacionada</h3>
          <p class="text-body-2">ID: {{ notification.data.search_id }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="notification.type === 'promotional-alert'">
      <!-- Alerta promocional -->
      <div class="d-flex flex-column gap-4">
        <!-- Informações do programa -->
        <div>
          <h3 class="text-h6 mb-2">Programa de Fidelidade</h3>
          <div class="d-flex flex-wrap gap-2 mb-2">
            <v-chip color="primary" size="large">
              {{ notification.data.program_name }}
            </v-chip>
            <v-chip
              :color="
                notification.data.program_type === 'points' ? 'success' : 'info'
              "
              variant="outlined"
            >
              {{
                notification.data.program_type === 'points'
                  ? 'Pontos'
                  : 'Milhas'
              }}
            </v-chip>
          </div>
        </div>

        <!-- Informações do e-commerce -->
        <div>
          <h3 class="text-h6 mb-2">Loja</h3>
          <p class="text-body-1 mb-2">
            {{ notification.data.ecommerce_name }}
          </p>
          <v-chip color="secondary" variant="outlined" size="small">
            {{ notification.data.ecommerce_category }}
          </v-chip>
        </div>

        <!-- Valor atual -->
        <div>
          <h3 class="text-h6 mb-2">Valor da Promoção</h3>
          <p class="text-h5 text-primary font-weight-bold">
            {{ notification.data.current_value }}
            {{
              notification.data.program_type === 'points' ? 'pontos' : 'milhas'
            }}
          </p>
        </div>

        <!-- Descrição completa -->
        <div>
          <h3 class="text-h6 mb-2">Detalhes</h3>
          <p class="text-body-1">
            Nova promoção disponível no programa
            <strong>{{ notification.data.program_name }}</strong>
            da loja
            <strong>{{ notification.data.ecommerce_name }}</strong
            >. Você pode ganhar
            <strong
              >{{ notification.data.current_value }}
              {{
                notification.data.program_type === 'points'
                  ? 'pontos'
                  : 'milhas'
              }}</strong
            >
            fazendo compras nesta loja.
          </p>
        </div>
      </div>
    </div>

    <!-- Tipo de notificação genérica -->
    <div v-else>
      <div class="d-flex flex-column gap-4">
        <div>
          <h3 class="text-h6 mb-2">Detalhes da Notificação</h3>
          <p class="text-body-1">
            {{ getNotificationMessage(notification) }}
          </p>
        </div>

        <!-- Dados brutos para tipos desconhecidos -->
        <div v-if="Object.keys(notification.data).length > 0">
          <h3 class="text-h6 mb-2">Informações Adicionais</h3>
          <div class="d-flex flex-wrap gap-2">
            <v-chip
              v-for="(value, key) in notification.data"
              :key="key"
              size="small"
              variant="outlined"
            >
              {{ key }}: {{ value }}
            </v-chip>
          </div>
        </div>
      </div>
    </div>

    <!-- Informações de data e status -->
    <v-divider class="my-4"></v-divider>

    <div class="d-flex justify-space-between align-center">
      <div>
        <p class="text-caption text-medium-emphasis mb-1">Data de criação</p>
        <p class="text-body-2">
          {{ formatFullDate(notification.created_at) }}
        </p>
      </div>

      <div class="text-right">
        <v-chip
          :color="notification.read_at ? 'success' : 'warning'"
          size="small"
        >
          {{ notification.read_at ? 'Lida' : 'Não lida' }}
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Notification } from '~/types/notification'

  interface Props {
    notification: Notification
  }

  defineProps<Props>()

  const formatPrice = (price: number): string => {
    return price.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const getPriceChangeColor = (oldPrice: number, newPrice: number): string => {
    if (newPrice < oldPrice) {
      return 'success'
    } else if (newPrice > oldPrice) {
      return 'error'
    }
    return 'info'
  }

  const getPriceChangeText = (oldPrice: number, newPrice: number): string => {
    if (oldPrice === 0) return 'Preço inicial'

    const difference = newPrice - oldPrice
    const percentage = ((difference / oldPrice) * 100).toFixed(1)

    if (difference < 0) {
      return `Desconto de R$ ${Math.abs(difference).toFixed(2)} (${Math.abs(parseFloat(percentage))}%)`
    } else if (difference > 0) {
      return `Aumento de R$ ${difference.toFixed(2)} (${percentage}%)`
    }
    return 'Sem alteração'
  }

  const getNotificationMessage = (notification: Notification): string => {
    switch (notification.type) {
      case 'promotional-alert':
        const { program_name, ecommerce_name, current_value } =
          notification.data
        return `Nova promoção disponível no programa ${program_name} da ${ecommerce_name}. Valor atual: ${current_value}.`
      case 'alert-offer-price-change':
        const { product_name, old_price, new_price } = notification.data
        const priceChange =
          new_price && old_price
            ? new_price < old_price
              ? 'diminuiu'
              : 'aumentou'
            : 'foi alterado'
        return `O preço do produto "${product_name}" ${priceChange}. Confira os detalhes.`
      default:
        return 'Você tem uma nova notificação.'
    }
  }

  const formatFullDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
</script>

<style scoped>
  .gap-2 {
    gap: 8px;
  }

  .gap-4 {
    gap: 16px;
  }
</style>
