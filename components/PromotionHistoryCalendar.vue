<template>
  <div class="promotion-calendar">
    <!-- Calendar Controls -->
    <div class="calendar-controls my-6">
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            :model-value="selectedProgram"
            @update:model-value="$emit('update:selectedProgram', $event)"
            :items="programOptions"
            item-title="name"
            item-value="id"
            label="Programa"
            variant="outlined"
            density="comfortable"
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps">
                <template #prepend>
                  <v-avatar size="24" rounded="lg">
                    <v-img :src="item.raw.logo_url" :alt="item.raw.name" />
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
            <template #selection="{ item }">
              <div class="d-flex align-center ga-2">
                <v-avatar size="20" rounded="lg">
                  <v-img :src="item.raw.logo_url" :alt="item.raw.name" />
                </v-avatar>
                <span>{{ item.raw.name }}</span>
              </div>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" md="6">
          <div class="d-flex align-center ga-2">
            <v-btn
              icon="mdi-chevron-left"
              variant="outlined"
              size="small"
              @click="previousMonth"
            />
            <div class="text-h6 font-weight-bold flex-grow-1 text-center">
              {{ formatMonthYear(currentDate) }}
            </div>
            <v-btn
              icon="mdi-chevron-right"
              variant="outlined"
              size="small"
              @click="nextMonth"
            />
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Calendar Grid -->
    <div class="calendar-grid">
      <div v-if="!selectedProgram" class="text-center py-12">
        <v-icon
          icon="mdi-calendar-outline"
          size="64"
          color="grey-lighten-1"
          class="mb-4"
        />
        <p class="text-body-1 text-medium-emphasis">
          Selecione um programa para visualizar o calendário
        </p>
      </div>

      <div v-else class="calendar-container">
        <!-- Calendar Header -->
        <div class="calendar-header">
          <div v-for="day in weekDays" :key="day" class="calendar-header-day">
            {{ day }}
          </div>
        </div>

        <!-- Calendar Body -->
        <div class="calendar-body">
          <div
            v-for="(week, weekIndex) in calendarWeeks"
            :key="weekIndex"
            class="calendar-week"
          >
            <div
              v-for="(day, dayIndex) in week"
              :key="dayIndex"
              class="calendar-day"
              :class="{
                'calendar-day--other-month': !day.isCurrentMonth,
                'calendar-day--today': day.isToday,
                'calendar-day--has-data': day.hasData,
              }"
            >
              <div class="calendar-day-number">
                {{ day.date.getDate() }}
              </div>

              <div v-if="day.hasData" class="calendar-day-content">
                <div
                  v-for="entry in day.entries"
                  :key="entry.id"
                  class="calendar-entry"
                  :class="getEntryClass(entry)"
                  @click="showEntryDetails(entry)"
                >
                  <div class="entry-value">
                    {{ formatValue(entry.current_value, entry.program.type) }}
                  </div>
                  <div class="entry-change">
                    <v-icon
                      :icon="getChangeIcon(entry)"
                      :color="getChangeColor(entry)"
                      size="12"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="calendar-legend mt-6">
      <div class="d-flex flex-wrap align-center justify-center ga-4">
        <div class="legend-item d-flex align-center ga-2">
          <div class="legend-indicator legend-indicator--increase" />
          <span class="text-caption">Aumento</span>
        </div>
        <div class="legend-item d-flex align-center ga-2">
          <div class="legend-indicator legend-indicator--decrease" />
          <span class="text-caption">Diminuição</span>
        </div>
        <div class="legend-item d-flex align-center ga-2">
          <div class="legend-indicator legend-indicator--no-change" />
          <span class="text-caption">Sem alteração</span>
        </div>
      </div>
    </div>

    <!-- Entry Details Dialog -->
    <v-dialog v-model="showDetailsDialog" max-width="500px">
      <v-card v-if="selectedEntry">
        <v-card-title class="d-flex align-center ga-3">
          <v-avatar size="32" rounded="lg">
            <v-img
              :src="selectedEntry.program.logo_url"
              :alt="selectedEntry.program.name"
            />
          </v-avatar>
          <div>
            <div class="text-h6">{{ selectedEntry.program.name }}</div>
            <div class="text-caption text-medium-emphasis">
              {{ formatDateTime(selectedEntry.created_at) }}
            </div>
          </div>
        </v-card-title>

        <v-card-text>
          <div class="entry-details">
            <div class="detail-row">
              <span class="detail-label">Valor Anterior:</span>
              <span class="detail-value">
                {{
                  formatValue(
                    selectedEntry.previous_value,
                    selectedEntry.program.type
                  )
                }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Valor Atual:</span>
              <span class="detail-value text-primary font-weight-bold">
                {{
                  formatValue(
                    selectedEntry.current_value,
                    selectedEntry.program.type
                  )
                }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Variação:</span>
              <span
                class="detail-value"
                :class="`text-${getChangeColor(selectedEntry)}`"
              >
                <v-icon :icon="getChangeIcon(selectedEntry)" size="16" start />
                {{ getChangeText(selectedEntry) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">ID:</span>
              <span class="detail-value">#{{ selectedEntry.id }}</span>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            variant="text"
            @click="showDetailsDialog = false"
          >
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
import type { Program } from '~/interfaces/program'
import type {
  PromotionHistory,
  PromotionHistoryResponse,
} from '~/interfaces/promotions'

  interface Props {
    historyData: PromotionHistoryResponse
    selectedProgram: string | null
  }

  interface CalendarDay {
    date: Date
    isCurrentMonth: boolean
    isToday: boolean
    hasData: boolean
    entries: PromotionHistory[]
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    'update:selectedProgram': [value: string | null]
  }>()

  // State
  const currentDate = ref(new Date())
  const showDetailsDialog = ref(false)
  const selectedEntry = ref<PromotionHistory | null>(null)

  // Constants
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  // Computed
  const programOptions = computed(() => {
    const programs: Program[] = []
    const programsMap = new Map<number, Program>()

    Object.values(props.historyData).forEach(histories => {
      histories.forEach(history => {
        if (!programsMap.has(history.program.id)) {
          programsMap.set(history.program.id, history.program)
        }
      })
    })

    return Array.from(programsMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  })

  const selectedProgramData = computed(() => {
    if (!props.selectedProgram) return []
    return props.historyData[props.selectedProgram] || []
  })

  const calendarWeeks = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()

    // Get first day of month and calculate start of calendar
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const weeks: CalendarDay[][] = []
    const today = new Date()

    for (let week = 0; week < 6; week++) {
      const weekDays: CalendarDay[] = []

      for (let day = 0; day < 7; day++) {
        const currentDay = new Date(startDate)
        currentDay.setDate(startDate.getDate() + week * 7 + day)

        const isCurrentMonth = currentDay.getMonth() === month
        const isToday = currentDay.toDateString() === today.toDateString()

        // Find entries for this day
        const dayEntries = selectedProgramData.value.filter(entry => {
          const entryDate = new Date(entry.created_at)
          return entryDate.toDateString() === currentDay.toDateString()
        })

        weekDays.push({
          date: currentDay,
          isCurrentMonth,
          isToday,
          hasData: dayEntries.length > 0,
          entries: dayEntries,
        })
      }

      weeks.push(weekDays)
    }

    return weeks
  })

  // Methods
  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    })
  }

  const formatValue = (value: string, programType: string): string => {
    const numValue = parseFloat(value)

    if (programType === 'cashback') {
      return `${numValue.toFixed(1)}%`
    }

    return `${numValue.toFixed(1)} pts`
  }

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getChangeIcon = (entry: PromotionHistory): string => {
    const current = parseFloat(entry.current_value)
    const previous = parseFloat(entry.previous_value)

    if (current > previous) return 'mdi-trending-up'
    if (current < previous) return 'mdi-trending-down'
    return 'mdi-minus'
  }

  const getChangeColor = (entry: PromotionHistory): string => {
    const current = parseFloat(entry.current_value)
    const previous = parseFloat(entry.previous_value)

    if (current > previous) return 'success'
    if (current < previous) return 'error'
    return 'info'
  }

  const getChangeText = (entry: PromotionHistory): string => {
    const current = parseFloat(entry.current_value)
    const previous = parseFloat(entry.previous_value)
    const diff = current - previous

    if (diff > 0) return `+${diff.toFixed(1)}%`
    if (diff < 0) return `${diff.toFixed(1)}%`
    return 'Sem alteração'
  }

  const getEntryClass = (entry: PromotionHistory): string => {
    const current = parseFloat(entry.current_value)
    const previous = parseFloat(entry.previous_value)

    if (current > previous) return 'calendar-entry--increase'
    if (current < previous) return 'calendar-entry--decrease'
    return 'calendar-entry--no-change'
  }

  const previousMonth = (): void => {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() - 1)
    currentDate.value = newDate
  }

  const nextMonth = (): void => {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() + 1)
    currentDate.value = newDate
  }

  const showEntryDetails = (entry: PromotionHistory): void => {
    selectedEntry.value = entry
    showDetailsDialog.value = true
  }
</script>

<style scoped>
  .promotion-calendar {
    width: 100%;
  }

  .calendar-container {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 12px;
    padding: 16px;
    overflow: hidden;
  }

  .v-theme--dark .calendar-container {
    background: rgba(255, 255, 255, 0.05);
  }

  .calendar-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    margin-bottom: 8px;
  }

  .calendar-header-day {
    text-align: center;
    font-weight: bold;
    padding: 12px 8px;
    background: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.7);
  }

  .v-theme--dark .calendar-header-day {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
  }

  .calendar-body {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .calendar-week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
  }

  .calendar-day {
    min-height: 80px;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.08);
    padding: 4px;
    position: relative;
    transition: all 0.3s ease;
  }

  .v-theme--dark .calendar-day {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.12);
  }

  .calendar-day--other-month {
    opacity: 0.3;
  }

  .calendar-day--today {
    background: rgba(15, 43, 70, 0.1);
    border-color: rgb(15, 43, 70);
  }

  .calendar-day--has-data {
    cursor: pointer;
  }

  .calendar-day--has-data:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .calendar-day-number {
    font-weight: bold;
    font-size: 12px;
    margin-bottom: 4px;
    color: rgba(0, 0, 0, 0.7);
  }

  .v-theme--dark .calendar-day-number {
    color: rgba(255, 255, 255, 0.8);
  }

  .calendar-day-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .calendar-entry {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    padding: 2px 4px;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .calendar-entry:hover {
    transform: scale(1.05);
  }

  .calendar-entry--increase {
    background: rgba(76, 175, 80, 0.1);
    border-left: 3px solid #4caf50;
  }

  .calendar-entry--decrease {
    background: rgba(244, 67, 54, 0.1);
    border-left: 3px solid #f44336;
  }

  .calendar-entry--no-change {
    background: rgba(33, 150, 243, 0.1);
    border-left: 3px solid #2196f3;
  }

  .entry-value {
    font-weight: bold;
    flex: 1;
  }

  .entry-change {
    margin-left: 4px;
  }

  .calendar-legend {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 8px;
    padding: 16px;
  }

  .v-theme--dark .calendar-legend {
    background: rgba(255, 255, 255, 0.05);
  }

  .legend-item {
    padding: 4px 8px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.8);
  }

  .v-theme--dark .legend-item {
    background: rgba(255, 255, 255, 0.1);
  }

  .legend-indicator {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  .legend-indicator--increase {
    background: #4caf50;
  }

  .legend-indicator--decrease {
    background: #f44336;
  }

  .legend-indicator--no-change {
    background: #2196f3;
  }

  .entry-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }

  .v-theme--dark .detail-row {
    border-bottom-color: rgba(255, 255, 255, 0.12);
  }

  .detail-row:last-child {
    border-bottom: none;
  }

  .detail-label {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.7);
  }

  .v-theme--dark .detail-label {
    color: rgba(255, 255, 255, 0.8);
  }

  .detail-value {
    font-weight: bold;
  }
</style>
