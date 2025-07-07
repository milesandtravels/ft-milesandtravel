<template>
  <v-card-title class="pa-0">
    <div class="modal-header">
      <div class="d-flex align-center pa-6 pb-4">
        <div class="warning-icon-container mr-4">
          <v-icon color="warning" size="24">mdi-alert-circle</v-icon>
        </div>
        <div class="flex-grow-1">
          <h2 class="text-h6 font-weight-bold mb-1">
            Atenção - Regras do Programa
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Leia as orientações antes de prosseguir
          </p>
        </div>
      </div>
      <v-divider />
    </div>
  </v-card-title>
</template>

<style scoped>
  .warning-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background-color: rgba(var(--v-theme-warning), 0.1);
    border-radius: 50%;
  }

  .modal-header {
    width: 100%;
  }
</style>
