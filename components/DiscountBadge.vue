<template>
  <v-chip
    class="text-white font-weight-bold"
    color="error"
    size="small"
    variant="flat"
  >
    {{ formatDiscount(discount) }}%
  </v-chip>
</template>

<script setup lang="ts">
  interface Props {
    discount: string
  }

  defineProps<Props>()

  const formatDiscount = (discount: string): string => {
    const discountNum = parseFloat(discount)
    return discountNum % 1 === 0
      ? discountNum.toString()
      : discountNum.toFixed(1)
  }
</script>
