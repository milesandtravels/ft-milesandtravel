<template>
  <h3 class="product-name text-body-1 font-weight-medium">
    {{ name }}
  </h3>
</template>

<script setup lang="ts">
  // Props
  interface Props {
    name: string
  }

  defineProps<Props>()
</script>

<style scoped>
  .product-name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
    height: 2.8em;
    margin: 0;
  }
</style>
