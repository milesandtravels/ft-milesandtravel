<template>
  <div>
    <!-- Botão para abrir o modal -->
    <v-btn color="primary" @click="openProductModal" prepend-icon="mdi-plus">
      Adicionar Produto Manual
    </v-btn>

    <!-- Modal Component -->
    <BonusPurchaseCreatedPersonalizateProduct
      ref="productModal"
      :search-id="searchId"
      :search-term="searchTerm"
      @product-created="handleProductCreated"
      @close="handleModalClose"
    />
  </div>
</template>

<script setup lang="ts">
  // Props que você pode receber do componente pai
  interface Props {
    searchId?: string | number
    searchTerm?: string
  }

  const props = defineProps<Props>()

  // Ref para acessar o modal
  const productModal = ref()

  // Métodos
  const openProductModal = () => {
    productModal.value?.openModal()
  }

  const handleProductCreated = (product: any) => {
    console.log('Produto criado:', product)
    // Aqui você pode fazer qualquer lógica adicional
    // como atualizar uma lista de produtos, mostrar notificação, etc.

    // Exemplo: mostrar notificação de sucesso
    // $toast.success('Produto criado com sucesso!')
  }

  const handleModalClose = () => {
    console.log('Modal fechado')
    // Lógica adicional quando o modal é fechado
  }
</script>
