<template>
  <div class="image-container">
    <v-img :alt="name" class="product-image" cover height="200" :src="image">
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular color="grey-lighten-4" indeterminate />
        </div>
      </template>

      <template #error>
        <div
          class="d-flex align-center justify-center fill-height bg-grey-lighten-2"
        >
          <v-icon color="grey-darken-1" size="48"
            >mdi-image-broken-variant</v-icon
          >
        </div>
      </template>
    </v-img>

    <!-- Action Buttons Overlay -->
    <ProductActions @edit="$emit('edit')" @remove="$emit('remove')" />
  </div>
</template>

<script setup lang="ts">
  import ProductActions from './ProductActions.vue'

  // Props
  interface Props {
    image: string
    name: string
  }

  // Emits
  interface Emits {
    edit: []
    remove: []
  }

  defineProps<Props>()
  defineEmits<Emits>()
</script>

<style scoped>
  .image-container {
    position: relative;
    overflow: hidden;
  }

  .product-image {
    transition: transform 0.3s ease;
  }

  /* Scale image on parent card hover */
  :deep(.product-card:hover) .product-image {
    transform: scale(1.05);
  }
</style>
