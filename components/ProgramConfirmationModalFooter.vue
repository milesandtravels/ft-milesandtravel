<template>
  <v-card-actions class="pa-0">
    <div class="modal-footer w-100">
      <v-divider />
      <div class="pa-6 pt-4">
        <v-row no-gutters class="w-100">
          <v-col cols="5">
            <v-btn
              variant="outlined"
              color="grey-darken-1"
              size="large"
              block
              @click="$emit('cancel')"
              class="text-body-2"
            >
              Cancelar
            </v-btn>
          </v-col>
          <v-col cols="7" class="ps-3">
            <v-btn
              color="primary"
              size="large"
              block
              @click="$emit('confirm')"
              class="text-body-2 font-weight-bold"
              elevation="0"
            >
              <v-icon start size="18">mdi-open-in-new</v-icon>
              Ir para Programa
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-card-actions>
</template>

<script setup lang="ts">
  defineEmits<{
    cancel: []
    confirm: []
  }>()
</script>

<style scoped>
  .modal-footer {
    background-color: rgba(var(--v-theme-surface-variant), 0.1);
  }
</style>
