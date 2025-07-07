<template>
  <div class="d-flex align-center">
    <v-rating
      :model-value="parseFloat(rating)"
      color="amber"
      density="compact"
      size="small"
      readonly
      half-increments
    />
    <span class="text-caption text-medium-emphasis ms-1">
      ({{ formatReviews(reviews) }})
    </span>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    rating: string
    reviews: number
  }

  defineProps<Props>()

  const formatReviews = (reviews: number): string => {
    if (reviews >= 1000) {
      return `${Math.floor(reviews / 1000)}k`
    }
    return reviews.toString()
  }
</script>
