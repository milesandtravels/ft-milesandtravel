<template>
  <v-container fluid class="offers-page">
    <!-- Header da página -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">Ofertas Encontradas</h1>
            <p class="text-body-1 text-medium-emphasis">
              {{ offers.length }} ofertas disponíveis com cashback, pontos e
              milhas
            </p>
          </div>

          <!-- Filtros -->
          <div class="d-flex align-center gap-2 flex-wrap">
            <v-chip-group
              v-model="selectedProgramType"
              color="primary"
              filter
              multiple
            >
              <v-chip value="cashback" filter>
                <v-icon icon="mdi-cash" size="16" class="me-1" />
                Cashback
              </v-chip>
              <v-chip value="points" filter>
                <v-icon icon="mdi-star" size="16" class="me-1" />
                Pontos
              </v-chip>
            </v-chip-group>

            <v-btn
              v-if="selectedOffers.length > 0"
              color="success"
              variant="flat"
              @click="processSelectedOffers"
            >
              Processar {{ selectedOffers.length }} Selecionadas
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="text-body-1 mt-4">Carregando ofertas...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredOffers.length === 0" class="text-center py-8">
      <v-icon icon="mdi-package-variant" size="64" color="grey-lighten-1" />
      <h2 class="text-h6 mt-4 mb-2">Nenhuma oferta encontrada</h2>
      <p class="text-body-2 text-medium-emphasis">
        Tente ajustar os filtros ou fazer uma nova busca
      </p>
    </div>

    <!-- Cards de ofertas -->
    <OffersList
      v-else
      :offers="filteredOffers"
      @update:selection="handleOfferSelection"
    />

    <!-- Snackbar de feedback -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false"> Fechar </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
  import OffersList from '~/components/OffersList.vue'
  import type { OfferItem, ProgramType } from '~/interfaces/offers'

  // Estados reativo
  const loading = ref<boolean>(false)
  const route = useRoute()
  const offers = ref<OfferItem[]>([])
  const selectedProgramType = ref<ProgramType[]>([])
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
  })

  // Computed
  const selectedOffers = computed<OfferItem[]>(() =>
    offers.value.filter(offer => offer.selected)
  )

  const filteredOffers = computed<OfferItem[]>(() => {
    if (selectedProgramType.value.length === 0) {
      return offers.value
    }

    return offers.value.filter(offer =>
      selectedProgramType.value.includes(offer.program_type)
    )
  })

  // Métodos
  const fetchOffers = async (): Promise<void> => {
    try {
      loading.value = true
      const { data, refresh } = await useSanctumFetch<any>(
        `/api/searches/${route.query.searchId}/offers`,
        {
          method: 'GET',
        }
      )

      console.log('data', data.value.data)
      offers.value = data.value.data.map((offer: any) => {
        return {
          ...offer,
          selected: false,
        }
      })

      showSnackbar('Ofertas carregadas com sucesso!', 'success')
      loading.value = false
      await Promise.resolve()
    } catch (error) {
      console.error('Erro ao buscar ofertas:', error)
      showSnackbar('Erro ao carregar ofertas. Tente novamente.', 'error')
    } finally {
      loading.value = false
    }
  }

  const handleOfferSelection = (updatedOffer: OfferItem): void => {
    const index = offers.value.findIndex(
      offer =>
        offer.ecommerce.id === updatedOffer.ecommerce.id &&
        offer.product.id === updatedOffer.product.id &&
        offer.program.id === updatedOffer.program.id
    )

    if (index !== -1) {
      offers.value[index] = { ...updatedOffer }

      const action = updatedOffer.selected ? 'selecionada' : 'removida'
      showSnackbar(`Oferta ${action}!`, 'info')
    }
  }

  const processSelectedOffers = (): void => {
    if (selectedOffers.value.length === 0) {
      showSnackbar('Selecione pelo menos uma oferta', 'warning')
      return
    }

    // Aqui você implementaria a lógica de processamento das ofertas selecionadas
    console.log('Ofertas selecionadas:', selectedOffers.value)

    showSnackbar(
      `${selectedOffers.value.length} ofertas processadas com sucesso!`,
      'success'
    )

    // Reset das seleções após processamento
    offers.value.forEach(offer => {
      offer.selected = false
    })
  }

  const showSnackbar = (message: string, color: string = 'success'): void => {
    snackbar.value = {
      show: true,
      message,
      color,
    }
  }

  // Lifecycle
  onMounted(() => {
    fetchOffers()
  })

  // Meta tags para SEO
  useSeoMeta({
    title: 'Ofertas com Cashback, Pontos e Milhas',
    ogTitle: 'Ofertas com Cashback, Pontos e Milhas',
    description:
      'Encontre as melhores ofertas com cashback, pontos e milhas dos principais e-commerces',
    ogDescription:
      'Encontre as melhores ofertas com cashback, pontos e milhas dos principais e-commerces',
    ogImage: '/images/og-offers.jpg',
  })
</script>

<style scoped>
  .offers-page {
    min-height: 100vh;
    background-color: rgb(var(--v-theme-surface));
  }

  @media (max-width: 960px) {
    .offers-page {
      padding: 8px;
    }
  }

  @media (max-width: 600px) {
    .d-flex.justify-space-between {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .gap-2 {
      gap: 8px;
    }
  }
</style>
