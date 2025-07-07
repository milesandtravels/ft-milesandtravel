<template>
  <v-row justify="center">
    <v-col cols="12">
      <div class="d-flex justify-center align-center flex-wrap ga-2">
        <!-- First Page -->
        <v-btn
          :disabled="meta.current_page === 1 || pending"
          @click="$emit('go-to-page', 1)"
          variant="outlined"
          size="small"
          icon="mdi-page-first"
        ></v-btn>

        <!-- Previous Page -->
        <v-btn
          :disabled="meta.current_page === 1 || pending"
          @click="$emit('go-to-page', meta.current_page - 1)"
          variant="outlined"
          size="small"
          icon="mdi-chevron-left"
        ></v-btn>

        <!-- Page Numbers -->
        <template v-for="page in paginationPages" :key="page">
          <v-btn
            v-if="page !== '...'"
            :variant="page === meta.current_page ? 'flat' : 'outlined'"
            :color="page === meta.current_page ? 'primary' : 'default'"
            @click="$emit('go-to-page', page)"
            :disabled="pending"
            size="small"
            min-width="40"
          >
            {{ page }}
          </v-btn>
          <span v-else class="px-2 text-medium-emphasis">...</span>
        </template>

        <!-- Next Page -->
        <v-btn
          :disabled="meta.current_page === meta.last_page || pending"
          @click="$emit('go-to-page', meta.current_page + 1)"
          variant="outlined"
          size="small"
          icon="mdi-chevron-right"
        ></v-btn>

        <!-- Last Page -->
        <v-btn
          :disabled="meta.current_page === meta.last_page || pending"
          @click="$emit('go-to-page', meta.last_page)"
          variant="outlined"
          size="small"
          icon="mdi-page-last"
        ></v-btn>
      </div>

      <!-- Pagination Info -->
      <div class="text-center mt-4">
        <p class="text-body-2 text-medium-emphasis">
          Mostrando {{ meta.from }} a {{ meta.to }} de
          {{ meta.total }} resultados (Página {{ meta.current_page }} de
          {{ meta.last_page }})
        </p>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
  import type { PromotionMeta } from '~/interfaces/promotions'

  interface Props {
    meta: PromotionMeta
    pending: boolean
  }

  const props = defineProps<Props>()

  defineEmits<{
    'go-to-page': [page: number]
  }>()

  const paginationPages = computed(() => {
    const current = props.meta.current_page
    const last = props.meta.last_page
    const pages: (number | string)[] = []

    if (last <= 7) {
      for (let i = 1; i <= last; i++) {
        pages.push(i)
      }
      return pages
    }

    pages.push(1)

    if (current > 4) {
      pages.push('...')
    }

    const start = Math.max(2, current - 1)
    const end = Math.min(last - 1, current + 1)

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    if (current < last - 3) {
      pages.push('...')
    }

    if (!pages.includes(last)) {
      pages.push(last)
    }

    return pages
  })
</script>
