<template>
  <div class="guidelines-list">
    <div
      v-for="(guideline, index) in guidelines"
      :key="index"
      class="guideline-item"
    >
      <div class="guideline-bullet">
        <v-icon color="primary" size="14">mdi-check-circle</v-icon>
      </div>
      <span class="guideline-text">{{ guideline }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    guidelines: string[]
  }

  defineProps<Props>()
</script>

<style scoped>
  .guidelines-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .guideline-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 8px 0;
  }

  .guideline-bullet {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    margin-top: 2px;
  }

  .guideline-text {
    flex: 1;
    font-size: 0.875rem;
    line-height: 1.4;
    color: rgba(var(--v-theme-on-surface), 0.87);
  }
</style>
