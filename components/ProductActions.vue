<template>
  <div class="action-overlay">
    <v-btn
      class="action-btn"
      color="primary"
      icon
      size="small"
      variant="flat"
      @click="$emit('edit')"
    >
      <v-icon>mdi-pencil</v-icon>
      <v-tooltip activator="parent" location="top"> Editar produto </v-tooltip>
    </v-btn>

    <v-btn
      class="action-btn ml-2"
      color="error"
      icon
      size="small"
      variant="flat"
      @click="$emit('remove')"
    >
      <v-icon>mdi-delete</v-icon>
      <v-tooltip activator="parent" location="top"> Remover produto </v-tooltip>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
  // Emits
  interface Emits {
    edit: []
    remove: []
  }

  defineEmits<Emits>()
</script>

<style scoped>
  .action-overlay {
    position: absolute;
    top: 12px;
    right: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .action-btn {
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  /* Show actions on parent hover */
  :deep(.product-card:hover) .action-overlay {
    opacity: 1;
  }

  /* Responsive adjustments */
  @media (max-width: 600px) {
    .action-overlay {
      top: 8px;
      right: 8px;
      opacity: 1; /* Always visible on mobile */
    }

    .action-btn {
      width: 32px;
      height: 32px;
    }
  }

  /* Dark theme support */
  .v-theme--dark .action-btn {
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.6);
  }
</style>
