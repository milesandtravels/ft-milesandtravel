<template>
  <div class="offers-container">
    <div class="offers-grid">
      <div
        v-for="offer in offers"
        :key="`${offer.ecommerce.id}-${offer.product.id}-${offer.program.id}`"
        class="grid-item"
      >
        <OfferCard
          :offer="offer"
          @view:product="handleViewProduct"
          @value-updated="handleValueUpdated"
        />
      </div>
    </div>

    <!-- Sentinela para scroll infinito -->
    <div ref="sentinel" class="sentinel" v-show="hasMoreData && !loading">
      <v-progress-circular
        v-if="loadingMore"
        indeterminate
        color="primary"
        size="32"
      />
    </div>

    <!-- Loading inicial -->
    <div v-if="loading" class="loading-container">
      <v-progress-circular indeterminate color="primary" size="48" />
      <p class="mt-4 text-center">Carregando ofertas...</p>
    </div>

    <!-- Mensagem quando não há mais dados -->
    <div v-if="!hasMoreData && offers.length > 0" class="no-more-data">
      <p class="text-center text-grey">Todas as ofertas foram carregadas</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { OfferItem } from '~/interfaces/offers'

  interface Props {
    offers: OfferItem[]
    loading?: boolean
    loadingMore?: boolean
    hasMoreData?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    loadingMore: false,
    hasMoreData: true,
  })

  defineOptions({
    name: 'OffersList',
  })

  const emit = defineEmits<{
    'view:product': [offer: OfferItem]
    'go:program': [offer: OfferItem]
    'load-more': []
    'value-updated': []
  }>()

  // Referência para a sentinela
  const sentinel = ref<HTMLElement>()

  const handleViewProduct = (offer: OfferItem): void => {
    emit('view:product', offer)
  }

  const handleValueUpdated = (): void => {
    emit('value-updated')
  }

  // IntersectionObserver para scroll infinito
  onMounted(() => {
    if (!sentinel.value) return

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        if (
          entry.isIntersecting &&
          props.hasMoreData &&
          !props.loading &&
          !props.loadingMore
        ) {
          emit('load-more')
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    )

    observer.observe(sentinel.value)

    // Cleanup
    onUnmounted(() => {
      observer.disconnect()
    })
  })
</script>

<style scoped>
  .offers-container {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .offers-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .grid-item {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .sentinel {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    min-height: 60px;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    min-height: 200px;
  }

  .no-more-data {
    padding: 40px 20px;
    text-align: center;
  }

  /* Responsividade */
  @media (max-width: 960px) {
    .offers-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
  }

  @media (max-width: 600px) {
    .offers-container {
      padding: 12px;
    }

    .offers-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .loading-container {
      padding: 20px;
      min-height: 150px;
    }

    .no-more-data {
      padding: 20px;
    }
  }

  @media (max-width: 768px) {
    .offers-container {
      padding: 16px;
    }
  }
</style>
