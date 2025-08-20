<template>
  <div class="alert-status-section mb-3">
    <div class="status-row">
      <v-chip
        :color="alert.active ? 'success' : 'grey'"
        size="small"
        variant="tonal"
      >
        <v-icon start size="12">
          {{ alert.active ? 'mdi-check-circle' : 'mdi-pause-circle' }}
        </v-icon>
        {{ alert.active ? 'Ativo' : 'Inativo' }}
      </v-chip>

      <v-switch
        :model-value="alert.active"
        @update:model-value="$emit('toggle', alert)"
        color="primary"
        hide-details
        density="compact"
      />
    </div>

    <div class="alert-actions">
      <v-btn
        icon="mdi-pencil"
        size="small"
        variant="text"
        color="primary"
        @click="$emit('edit', alert)"
      />
      <v-btn
        icon="mdi-delete"
        size="small"
        variant="text"
        color="error"
        @click="$emit('delete', alert)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProgramType } from '~/interfaces/program'

interface Program {
  id: number
  name: string
  logo_url: string
  link_url: string
  type: string
  value_per_mile: string
}

interface Ecommerce {
  id: number
  name: string
  logo_url: string
  category: string
}

interface Alert {
  id: number
  user_id: number
  program: Program | null
  ecommerce: Ecommerce | null
  ecommerce_category: string | null
  program_type: ProgramType
  active: boolean
  threshold: string
  created_at: string
  updated_at: string
}

interface Props {
  alert: Alert
}

interface Emits {
  toggle: [alert: Alert]
  edit: [alert: Alert]
  delete: [alert: Alert]
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.alert-status-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.alert-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}
</style>