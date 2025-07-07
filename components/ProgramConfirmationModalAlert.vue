<template>
  <v-alert
    color="warning"
    variant="tonal"
    icon="mdi-information-outline"
    class="mb-5"
    border="start"
    border-color="warning"
  >
    <div class="text-body-2">
      <strong>Importante:</strong> Você será redirecionado para o site oficial
      do programa {{ programName }}.
    </div>
  </v-alert>
</template>

<script setup lang="ts">
  interface Props {
    programName: string
  }

  defineProps<Props>()
</script>
