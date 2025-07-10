<template>
  <v-card-title class="pa-4 pa-md-6 bg-primary text-white d-flex align-center">
    <v-icon icon="mdi-filter-variant" class="me-3" />
    <span class="text-h6 font-weight-medium">{{ title }}</span>
    <v-spacer />
    <v-btn
      icon="mdi-close"
      variant="text"
      color="white"
      size="small"
      @click="$emit('close')"
    />
  </v-card-title>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()

defineEmits<{
  close: []
}>()
</script>