<template>
  <v-card-item class="pa-3">
    <div class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-avatar v-if="offer.ecommerce.logo_url" size="32" class="me-2">
          <v-img :src="offer.ecommerce.logo_url" :alt="offer.ecommerce.name" />
        </v-avatar>
        <span class="text-body-2 font-weight-medium">
          {{ offer.ecommerce.name }}
        </span>
      </div>

      <div class="d-flex align-center gap-2">
        <v-btn
          :icon="isFavorited ? 'mdi-heart' : 'mdi-heart-outline'"
          :color="isFavorited ? 'red' : 'grey'"
          variant="text"
          size="small"
          :loading="isLoading"
          @click="toggleFavorite"
        />
        <ProgramTypeChip
          :type="offer.program.type"
          variant="flat"
          class="text-white"
        />
      </div>
    </div>
  </v-card-item>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { OfferItem } from '~/interfaces/offers'
  import { useSnackbarStore } from '~/store/snackbar'
  const snackbarStore = useSnackbarStore()
  interface Props {
    offer: OfferItem
  }

  interface Emits {
    'favorite-updated': [{ selected: boolean }]
  }

  const props = defineProps<Props>()

  const emit = defineEmits<Emits>()

  const isLoading = ref(false)
  const isFavorited = ref(props.offer.selected)

  const route = useRoute()
  const toggleFavorite = async () => {
    if (isLoading.value) return

    isLoading.value = true
    const newFavoriteState = !isFavorited.value

    const { data, error } = await useSanctumFetch<any>(
      `/api/searches/${route.query.searchId}/offers/${props.offer.id}`,
      {
        method: 'PUT',
        body: {
          selected: newFavoriteState,
        },
      }
    )

    if (data.value) {
      isFavorited.value = newFavoriteState
      emit('favorite-updated', {
        selected: newFavoriteState,
      })
      snackbarStore.showSuccess('Oferta favoritada com sucesso!!')
      isLoading.value = false
    }

    if (error.value) {
      snackbarStore.showError('Erro ao favoritar oferta. Tente novamente.')
      isLoading.value = false
    }
  }
</script>
