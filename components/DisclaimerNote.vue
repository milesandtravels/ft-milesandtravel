<template>
  <div class="disclaimer mt-4 pa-3">
    <v-icon class="mr-2" color="grey" size="16">
      mdi-shield-alert-outline
    </v-icon>
    <span class="text-body-2 text-medium-emphasis">
      O Miles&Travels não se responsabiliza por alterações nas regras ou valores
      dos programas de fidelidade.
    </span>
  </div>
</template>

<script setup lang="ts">
  // Componente puramente de apresentação
</script>

<style scoped>
  .disclaimer {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    background-color: rgba(var(--v-theme-surface-variant), 0.3);
    border-radius: 8px;
    border-left: 3px solid rgba(var(--v-theme-warning), 0.5);
  }
</style>
