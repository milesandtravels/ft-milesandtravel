<template>
  <div
    v-if="hasMorePages"
    ref="loadMoreTrigger"
    class="text-center py-4"
  >
    <v-progress-circular
      v-if="loadingMore"
      indeterminate
      color="primary"
      size="32"
    ></v-progress-circular>
    <p v-else class="text-body-2 text-medium-emphasis">
      Carregando mais notificações...
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  hasMorePages: boolean
  loadingMore: boolean
}

defineProps<Props>()

const loadMoreTrigger = ref<HTMLElement | null>(null)

defineExpose({
  loadMoreTrigger
})
</script>