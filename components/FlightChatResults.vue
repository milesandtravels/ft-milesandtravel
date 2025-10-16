<template>
  <div class="flight-chat-results">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-2">
      <h3 class="text-h6 mb-0">Resultados da Busca</h3>
      <div class="d-flex align-center ga-2">
        <v-chip
          v-if="isPolling"
          color="success"
          variant="tonal"
          size="small"
          prepend-icon="mdi-autorenew"
        >
          Atualizando
        </v-chip>
        <v-btn
          size="small"
          variant="outlined"
          prepend-icon="mdi-refresh"
          :loading="loading"
          @click="fetchFlights"
        >
          Atualizar
        </v-btn>
      </div>
    </div>

    <!-- Loading / Error / Empty States -->
    <div v-if="loading" class="text-center py-6">
      <v-progress-circular indeterminate color="primary" size="32" />
      <p class="text-body-2 text-medium-emphasis mt-2 mb-0">Carregando voos...</p>
    </div>

    <div v-else-if="error" class="pa-4">
      <v-alert type="error" variant="tonal" border="start" border-color="error">
        {{ error }}
      </v-alert>
    </div>

    <div v-else>
      <!-- Outbound (Ida) -->
      <div class="mb-4">
        <div class="d-flex align-center mb-2">
          <v-icon class="mr-2" color="primary">mdi-airplane-takeoff</v-icon>
          <h4 class="text-subtitle-1 mb-0">Voos de ida</h4>
          <span class="text-caption text-medium-emphasis ml-2">{{ outboundFlights.length }} resultado(s)</span>
        </div>
        <v-sheet class="pa-2" color="transparent">
          <v-slide-group show-arrows>
            <v-slide-group-item
              v-for="(flight, idx) in outboundFlights"
              :key="flight.id"
            >
              <v-card :class="['result-card', 'mr-3', 'mb-2', idx === 0 ? 'best-value' : '']" :elevation="idx === 0 ? 4 : 2" rounded="lg">
                <v-card-text class="pa-4">
                  <div v-if="idx === 0" class="best-ribbon">
                    <v-chip color="success" size="x-small" variant="elevated" prepend-icon="mdi-star">Melhor valor</v-chip>
                  </div>
                  <div class="d-flex align-start justify-space-between">
                    <!-- Left info -->
                    <div class="flex-grow-1 mr-4">
                      <div class="d-flex align-center mb-2">
                        <v-chip
                          size="small"
                          color="primary"
                          variant="tonal"
                          class="mr-2"
                        >
                          {{ stopsLabel(flight.stops) }}
                        </v-chip>
                        <v-chip size="small" variant="outlined" class="mr-2">
                          {{ flight.origin }} → {{ flight.destination }}
                        </v-chip>
                        <v-chip size="small" variant="outlined">
                          {{ cabinLabel(flight.cabin) }}
                        </v-chip>
                      </div>

                      <div class="d-flex align-center mb-2">
                        <div class="text-center mr-4">
                          <p class="text-body-1 font-weight-bold mb-0">{{ formatDateTime(flight.departure_datetime) }}</p>
                          <p class="text-caption text-medium-emphasis mb-0">Partida</p>
                        </div>
                        <div class="flex-grow-1 mx-3">
                          <v-divider></v-divider>
                        </div>
                        <div class="text-center ml-4">
                          <p class="text-body-1 font-weight-bold mb-0">{{ formatDateTime(flight.arrival_datetime) }}</p>
                          <p class="text-caption text-medium-emphasis mb-0">Chegada</p>
                        </div>
                      </div>

                      <p class="text-caption text-medium-emphasis mb-0">
                        Companhia aérea: <strong>{{ flight.airline }}</strong>
                      </p>

                      <div class="d-flex align-center mt-2">
                        <v-avatar size="24" class="mr-2">
                          <v-img :src="flight.program_logo" :alt="`Logo ${flight.program_name}`" contain>
                            <template #error>
                              <v-icon icon="mdi-airplane" color="primary" size="18"></v-icon>
                            </template>
                          </v-img>
                        </v-avatar>
                        <span class="text-caption">Programa emissor: <strong>{{ flight.program_name }}</strong></span>
                      </div>

                      <p class="text-caption text-medium-emphasis mt-2 mb-0">
                        Última atualização: {{ formatDateTime(flight.last_update) }}
                      </p>
                    </div>

                    <!-- Right price and action -->
                    <div class="text-right min-price-width">
                      <div class="mb-3">
                        <p class="text-h6 font-weight-bold text-primary mb-1">
                          {{ priceLabel(flight) }}
                        </p>
                        <p v-if="flight.price_type !== 'currency'" class="text-caption text-medium-emphasis mb-0">
                          Convertido: {{ formatCurrency(flight.final_price) }}
                        </p>
                      </div>

                      <v-btn
                        color="primary"
                        variant="flat"
                        size="small"
                        :href="sanitizeUrl(flight.link_url)"
                        target="_blank"
                        rel="noopener noreferrer"
                        prepend-icon="mdi-open-in-new"
                      >
                        Comprar
                      </v-btn>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-sheet>
      </div>

      <!-- Inbound (Volta) -->
      <div>
        <div class="d-flex align-center mb-2">
          <v-icon class="mr-2" color="primary">mdi-airplane-landing</v-icon>
          <h4 class="text-subtitle-1 mb-0">Voos de volta</h4>
          <span class="text-caption text-medium-emphasis ml-2">{{ inboundFlights.length }} resultado(s)</span>
        </div>
        <v-sheet class="pa-2" color="transparent">
          <v-slide-group show-arrows>
            <v-slide-group-item
              v-for="(flight, idx) in inboundFlights"
              :key="flight.id"
            >
              <v-card :class="['result-card', 'mr-3', 'mb-2', idx === 0 ? 'best-value' : '']" :elevation="idx === 0 ? 4 : 2" rounded="lg">
                <v-card-text class="pa-4">
                  <div v-if="idx === 0" class="best-ribbon">
                    <v-chip color="success" size="x-small" variant="elevated" prepend-icon="mdi-star">Melhor valor</v-chip>
                  </div>
                  <div class="d-flex align-start justify-space-between">
                    <!-- Left info -->
                    <div class="flex-grow-1 mr-4">
                      <div class="d-flex align-center mb-2">
                        <v-chip
                          size="small"
                          color="primary"
                          variant="tonal"
                          class="mr-2"
                        >
                          {{ stopsLabel(flight.stops) }}
                        </v-chip>
                        <v-chip size="small" variant="outlined" class="mr-2">
                          {{ flight.origin }} → {{ flight.destination }}
                        </v-chip>
                        <v-chip size="small" variant="outlined">
                          {{ cabinLabel(flight.cabin) }}
                        </v-chip>
                      </div>

                      <div class="d-flex align-center mb-2">
                        <div class="text-center mr-4">
                          <p class="text-body-1 font-weight-bold mb-0">{{ formatDateTime(flight.departure_datetime) }}</p>
                          <p class="text-caption text-medium-emphasis mb-0">Partida</p>
                        </div>
                        <div class="flex-grow-1 mx-3">
                          <v-divider></v-divider>
                        </div>
                        <div class="text-center ml-4">
                          <p class="text-body-1 font-weight-bold mb-0">{{ formatDateTime(flight.arrival_datetime) }}</p>
                          <p class="text-caption text-medium-emphasis mb-0">Chegada</p>
                        </div>
                      </div>

                      <p class="text-caption text-medium-emphasis mb-0">
                        Companhia aérea: <strong>{{ flight.airline }}</strong>
                      </p>

                      <div class="d-flex align-center mt-2">
                        <v-avatar size="24" class="mr-2">
                          <v-img :src="flight.program_logo" :alt="`Logo ${flight.program_name}`" contain>
                            <template #error>
                              <v-icon icon="mdi-airplane" color="primary" size="18"></v-icon>
                            </template>
                          </v-img>
                        </v-avatar>
                        <span class="text-caption">Programa emissor: <strong>{{ flight.program_name }}</strong></span>
                      </div>

                      <p class="text-caption text-medium-emphasis mt-2 mb-0">
                        Última atualização: {{ formatDateTime(flight.last_update) }}
                      </p>
                    </div>

                    <!-- Right price and action -->
                    <div class="text-right min-price-width">
                      <div class="mb-3">
                        <p class="text-h6 font-weight-bold text-primary mb-1">
                          {{ priceLabel(flight) }}
                        </p>
                        <p v-if="flight.price_type !== 'currency'" class="text-caption text-medium-emphasis mb-0">
                          Convertido: {{ formatCurrency(flight.final_price) }}
                        </p>
                      </div>

                      <v-btn
                        color="primary"
                        variant="flat"
                        size="small"
                        :href="sanitizeUrl(flight.link_url)"
                        target="_blank"
                        rel="noopener noreferrer"
                        prepend-icon="mdi-open-in-new"
                      >
                        Comprar
                      </v-btn>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-sheet>
      </div>
    
    <!-- Mini calendários com menor preço por dia (ida/volta) usando v-calendar do Vuetify -->
    <div class="mt-6">
      <div class="d-flex flex-column flex-md-row ga-4">
        <!-- Calendário Ida -->
        <v-card variant="outlined" class="pa-3 flex-grow-1">
          <div class="d-flex align-center mb-2">
            <v-icon class="mr-2" color="primary">mdi-calendar</v-icon>
            <h4 class="text-subtitle-2 mb-0">Calendário de preços (Ida)</h4>
          </div>
          <v-calendar
            type="month"
            :events="outboundEvents"
            :model-value="calendarStartDate"
            color="primary"
            class="mini-calendar"
          />
        </v-card>

        <!-- Calendário Volta -->
        <v-card variant="outlined" class="pa-3 flex-grow-1">
          <div class="d-flex align-center mb-2">
            <v-icon class="mr-2" color="primary">mdi-calendar</v-icon>
            <h4 class="text-subtitle-2 mb-0">Calendário de preços (Volta)</h4>
          </div>
          <v-calendar
            type="month"
            :events="inboundEvents"
            :model-value="calendarStartDate"
            color="primary"
            class="mini-calendar"
          />
        </v-card>
      </div>
    </div>
  </div>
  </div>
  
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { VCalendar } from 'vuetify/labs/VCalendar'
defineOptions({ components: { VCalendar } })

interface ChatFlightItem {
  id: number
  flight_search_id: number
  program_id: number
  stops: number
  departure_datetime: string
  arrival_datetime: string
  airline: string
  price: string
  created_at: string
  updated_at: string
  price_type: 'currency' | 'miles'
  cabin: 'economy' | 'premium' | 'bussiness' | 'first' | string
  link_url: string
  origin: string
  destination: string
  departure_date: string
  last_update: string
  value_per_mile: string
  type: 'outbound' | 'inbound' | string
  program_name: string
  program_logo: string
  final_price: string
}

interface ChatFlightsResponse {
  data?: ChatFlightItem[]
}

const props = defineProps<{ chatId?: number }>()

const flights = ref<ChatFlightItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const poller = ref<ReturnType<typeof setTimeout> | null>(null)
const isPolling = ref(false)

// Helpers para preço e ordenação
const toNumber = (v: string | number | undefined): number => {
  if (v === undefined) return Number.NaN
  const n = typeof v === 'string' ? Number(v.replace(/[^0-9.,-]/g, '').replace(',', '.')) : Number(v)
  return isNaN(n) ? Number(v) : n
}
const effectivePrice = (f: ChatFlightItem) => toNumber(f.final_price)
const sortByBestValue = (arr: ChatFlightItem[]) => arr.slice().sort((a, b) => effectivePrice(a) - effectivePrice(b))

const outboundFlights = computed(() => sortByBestValue(flights.value.filter(f => f.type === 'outbound')))
const inboundFlights = computed(() => sortByBestValue(flights.value.filter(f => f.type === 'inbound')))

// Calendários: menor preço por dia
const getDateStr = (f: ChatFlightItem) => {
  if (f.departure_date) return f.departure_date
  if (f.departure_datetime) return f.departure_datetime.split(' ')[0]
  return ''
}
const groupCheapestByDay = (arr: ChatFlightItem[]) => {
  const map = new Map<string, number>()
  arr.forEach(f => {
    const d = getDateStr(f)
    if (!d) return
    const price = effectivePrice(f)
    if (!map.has(d) || price < (map.get(d) as number)) {
      map.set(d, price)
    }
  })
  return Array.from(map.entries())
    .map(([date, price]) => ({ date, price }))
    .sort((a, b) => a.date.localeCompare(b.date))
}
const outboundCalendar = computed(() => groupCheapestByDay(outboundFlights.value))
const inboundCalendar = computed(() => groupCheapestByDay(inboundFlights.value))

// Eventos para v-calendar
// v-calendar requer Date para comparação interna; converter 'YYYY-MM-DD' para Date
const toJsDate = (dateStr: string) => {
  if (!dateStr) return new Date()
  // Garantir formato ISO para evitar timezone inconsistências
  return new Date(`${dateStr}T00:00:00`)
}

const outboundEvents = computed(() =>
  outboundCalendar.value.map(item => ({
    title: formatCurrency(item.price),
    start: toJsDate(item.date),
    end: toJsDate(item.date),
    color: 'success',
    allDay: true,
  }))
)

const inboundEvents = computed(() =>
  inboundCalendar.value.map(item => ({
    title: formatCurrency(item.price),
    start: toJsDate(item.date),
    end: toJsDate(item.date),
    color: 'success',
    allDay: true,
  }))
)

// Definir mês inicial dos calendários com base no primeiro resultado
const firstResultDateStr = computed(() => {
  const dates = flights.value
    .map(getDateStr)
    .filter(d => !!d)
    .sort()
  return dates.length > 0 ? dates[0] : null
})

const calendarStartDate = computed(() => {
  return firstResultDateStr.value ? toJsDate(firstResultDateStr.value) : new Date()
})

const fetchFlights = async () => {
  if (!props.chatId) return
  loading.value = true
  error.value = null
  try {
    const { data, error: fetchError } = await useSanctumFetch<ChatFlightsResponse>(`/api/flights/chats/${props.chatId}`)
    if (fetchError.value) {
      throw fetchError.value
    }
    const response = data.value
    if (Array.isArray(response)) {
      flights.value = response as unknown as ChatFlightItem[]
    } else if (response?.data && Array.isArray(response.data)) {
      flights.value = response.data
    } else {
      flights.value = []
    }
  } catch (e: any) {
    console.error('Erro ao carregar voos do chat:', e)
    error.value = e?.data?.message || 'Erro ao carregar voos'
  } finally {
    loading.value = false
  }
}

const startPolling = () => {
  if (poller.value) clearTimeout(poller.value)
  isPolling.value = true
  const run = async () => {
    await fetchFlights()
    poller.value = setTimeout(run, 20000)
  }
  poller.value = setTimeout(run, 0)
}

const stopPolling = () => {
  isPolling.value = false
  if (poller.value) {
    clearTimeout(poller.value)
    poller.value = null
  }
}

watch(() => props.chatId, (newId) => {
  stopPolling()
  flights.value = []
  if (newId) startPolling()
})

onMounted(() => {
  if (props.chatId) startPolling()
})

onBeforeUnmount(() => {
  stopPolling()
})

const stopsLabel = (stops: number) => {
  return stops === 0 ? 'Voo direto' : `${stops} parada${stops > 1 ? 's' : ''}`
}

const cabinLabel = (cabin: string) => {
  switch (cabin) {
    case 'economy':
      return 'Econômica'
    case 'premium':
      return 'Premium'
    case 'bussiness':
    case 'business':
      return 'Bussiness'
    case 'first':
      return 'Primeira classe'
    default:
      return cabin
  }
}

const formatDateTime = (dt: string) => {
  // Accept both 'YYYY-MM-DD HH:mm:ss' and ISO strings
  const normalized = dt.replace(' ', 'T')
  const date = new Date(normalized)
  if (isNaN(date.getTime())) return dt
  return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatCurrency = (value: string | number) => {
  const num = typeof value === 'string' ? Number(value) : value
  if (isNaN(num)) return `R$ ${value}`
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num)
}

const priceLabel = (flight: ChatFlightItem) => {
  if (flight.price_type === 'currency') {
    return formatCurrency(flight.final_price)
  }
  // miles
  const miles = Number(flight.price)
  const milesText = isNaN(miles) ? `${flight.price} milhas` : `${miles.toLocaleString('pt-BR')} milhas`
  return `${milesText}`
}

const sanitizeUrl = (url: string) => {
  // Remove backticks and extra spaces that might come from backend formatting
  return (url || '').replace(/`/g, '').trim()
}

const formatDate = (dateStr: string) => {
  // dateStr esperado: 'YYYY-MM-DD'
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`
  }
  const d = new Date(dateStr)
  return isNaN(d.getTime())
    ? dateStr
    : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}
</script>

<style scoped>
.result-card {
  width: 100%;
  max-width: 640px;
}

.best-value {
  border: 2px solid rgba(var(--v-theme-success), 0.6);
  position: relative;
}

.best-ribbon {
  position: absolute;
  top: 8px;
  right: 8px;
}

.min-price-width {
  min-width: 160px;
}

@media (max-width: 960px) {
  .result-card {
    max-width: 90vw;
  }
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 8px;
}

.calendar-cell {
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 8px;
  padding: 8px;
}

.mini-calendar :deep(.v-calendar-month__weekdays) {
  font-size: 0.75rem;
}
.mini-calendar {
  max-height: 360px;
}
</style>