<template>
  <div class="mileiros-config-page">
    <v-container fluid class="pa-4 pa-md-6">
      <v-row>
        <v-col cols="12">
          <!-- Header -->
          <div class="d-flex align-center justify-space-between mb-6">
            <div class="d-flex align-center">
              <v-icon size="32" color="primary" class="me-3">
                mdi-currency-usd
              </v-icon>
              <div>
                <h1 class="text-h4 font-weight-bold text-primary">
                  Configurar Mileiros
                </h1>
                <p class="text-subtitle-1 text-medium-emphasis ma-0">
                  Gerencie os preços dos programas de pontos e milhas
                </p>
              </div>
            </div>

            <!-- Botão de retorno (aparece apenas quando há returnTo na URL) -->
            <v-btn
              v-if="returnUrl"
              color="primary"
              variant="outlined"
              @click="goBackToOffers"
              class="text-none"
            >
              <v-icon start size="18"> mdi-arrow-left </v-icon>
              Voltar às Ofertas
            </v-btn>
          </div>

          <!-- Loading State -->
          <v-row v-if="loading">
            <v-col cols="12" class="text-center">
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
              ></v-progress-circular>
              <p class="mt-4">Carregando programas...</p>
            </v-col>
          </v-row>

          <!-- Error State -->
          <v-row v-else-if="error">
            <v-col cols="12">
              <v-alert type="error" variant="tonal" class="mb-4">
                {{ error }}
              </v-alert>
              <v-btn color="primary" @click="loadPrograms" :loading="loading">
                Tentar Novamente
              </v-btn>
            </v-col>
          </v-row>

          <!-- Programs Grid -->
          <v-row v-else>
            <v-col
              v-for="program in programs"
              :key="program.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card class="program-card elevation-2 h-100" :ripple="false">
                <v-card-text class="pa-4">
                  <!-- Program Logo and Name -->
                  <div class="d-flex align-center mb-4">
                    <BaseLogoAvatar
                      :src="program.logo_url"
                      :alt="program.name"
                      size="md"
                      type="miles"
                      class="me-3"
                    />
                    <div class="flex-grow-1">
                      <h3
                        class="text-subtitle-1 font-weight-bold text-truncate"
                      >
                        {{ program.name }}
                      </h3>
                    </div>
                  </div>

                  <!-- Current Price -->
                  <div class="price-section mb-4">
                    <div class="d-flex align-center justify-space-between">
                      <span class="text-body-2 text-medium-emphasis">
                        Preço do mileiro:
                      </span>
                      <v-btn
                        icon="mdi-pencil"
                        size="small"
                        variant="text"
                        color="primary"
                        @click="openEditModal(program)"
                      />
                    </div>
                    <div class="price-display mt-1">
                      <span class="text-h6 font-weight-bold text-primary">
                        R$ {{ program.value_per_mile.toFixed(2) }}
                      </span>
                    </div>
                  </div>

                  <!-- Program Link -->
                  <v-btn
                    :href="program.link_url"
                    target="_blank"
                    variant="outlined"
                    color="primary"
                    size="small"
                    block
                    class="text-none"
                  >
                    <v-icon start size="16"> mdi-open-in-new </v-icon>
                    Visitar Programa
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Edit Price Modal -->
    <v-dialog v-model="editModal" max-width="400" persistent>
      <v-card>
        <v-card-title class="d-flex align-center pa-4">
          <BaseLogoAvatar
            :src="selectedProgram?.logo_url || ''"
            :alt="selectedProgram?.name || ''"
            size="xs"
            type="miles"
            class="me-3"
          />
          <div>
            <h3 class="text-h6 font-weight-bold">Editar Preço</h3>
            <p class="text-body-2 text-medium-emphasis ma-0">
              {{ selectedProgram?.name }}
            </p>
            <p class="text-body-2 text-medium-emphasis ma-0">
              Preço atual: R$ {{ selectedProgram?.value_per_mile.toFixed(2) }}
            </p>
          </div>
        </v-card-title>

        <v-card-text class="pa-4">
          <v-text-field
            v-model="editPrice"
            label="Preço do mileiro (R$)"
            type="number"
            step="0.01"
            min="0"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required, rules.positive]"
            prefix="R$"
            placeholder="0,00"
            @keyup.enter="savePrice"
          />
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="closeEditModal"> Cancelar </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :disabled="!isValidPrice"
            @click="savePrice"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
  import { useSnackbarStore } from '~/store/snackbar'

  // Interfaces
  interface Program {
    id: number
    name: string
    logo_url: string
    link_url: string
    value_per_mile: number
  }

  // Router e route
  const router = useRouter()
  const route = useRoute()

  // URL de retorno
  const returnUrl = computed(() => (route.query.returnTo as string) || null)

  // Função para voltar às ofertas
  const goBackToOffers = () => {
    if (returnUrl.value) {
      router.push(returnUrl.value)
    }
  }

  // Configurações da página
  definePageMeta({
    title: 'Configurar Mileiros',
    description: 'Configurações de preços dos programas de pontos e milhas',
    layout: 'default',
  })

  // SEO
  useHead({
    title: 'Configurar Mileiros - Miles and Travel',
    meta: [
      {
        name: 'description',
        content:
          'Configure os preços dos programas de pontos e milhas para otimizar suas buscas',
      },
    ],
  })

  // Estado dos dados
  const programs = ref<Program[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  // Função para carregar programas da API
  const loadPrograms = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: apiError } = await useSanctumFetch<Program[]>(
        `/api/program-users`,
        {
          method: 'GET',
        }
      )

      if (apiError.value) {
        throw new Error(apiError.value.message || 'Erro ao carregar programas')
      }

      programs.value = data.value || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido'
      console.error('Erro ao carregar programas:', err)
    } finally {
      loading.value = false
    }
  }

  // Carregar programas ao montar o componente
  onMounted(() => {
    loadPrograms()
  })

  // Estado da modal de edição
  const editModal = ref(false)
  const selectedProgram = ref<Program | null>(null)
  const editPrice = ref('')

  // Regras de validação
  const rules = {
    required: (value: string) => !!value || 'Campo obrigatório',
    positive: (value: string) => {
      const num = parseFloat(value)
      return num > 0 || 'O valor deve ser maior que zero'
    },
  }

  // Computed para validar o preço
  const isValidPrice = computed(() => {
    if (!editPrice.value) return false
    const num = parseFloat(editPrice.value)
    return num > 0
  })

  // Função para abrir modal de edição
  const openEditModal = (program: Program) => {
    selectedProgram.value = program
    editPrice.value = program.value_per_mile.toFixed(2)
    editModal.value = true
  }

  // Função para fechar modal de edição
  const closeEditModal = () => {
    editModal.value = false
    selectedProgram.value = null
    editPrice.value = ''
  }

  // Função para salvar preço
  const savePrice = async () => {
    if (!selectedProgram.value || !isValidPrice.value) return

    try {
      const { error: apiError } = await useSanctumFetch(`/api/program-users`, {
        method: 'POST',
        body: {
          program_id: selectedProgram.value.id,
          custom_value_per_mile: parseFloat(editPrice.value),
        },
      })

      if (apiError.value) {
        throw new Error(apiError.value.message || 'Erro ao salvar preço')
      }

      // Atualizar o programa local
      const newPrice = parseFloat(editPrice.value)
      const programIndex = programs.value.findIndex(
        p => p.id === selectedProgram.value!.id
      )

      if (programIndex !== -1) {
        programs.value[programIndex].value_per_mile = newPrice
      }

      // Mostrar notificação de sucesso
      const snackbarStore = useSnackbarStore()
      snackbarStore.showSuccess(
        `Preço do ${selectedProgram.value.name} atualizado com sucesso! As ofertas serão recalculadas com o novo valor.`
      )

      closeEditModal()

      // Se há URL de retorno, mostrar opção de voltar
      if (returnUrl.value) {
        setTimeout(() => {
          const shouldReturn = confirm(
            'Deseja voltar às ofertas para ver os resultados atualizados?'
          )
          if (shouldReturn) {
            goBackToOffers()
          }
        }, 1500)
      }
    } catch (err) {
      console.error('Erro ao salvar preço:', err)
      // Aqui você pode adicionar uma notificação de erro para o usuário
      alert('Erro ao salvar o preço. Tente novamente.')
    }
  }
</script>

<style scoped>
  .mileiros-config-page {
    min-height: 100vh;
  }

  .program-card {
    border-radius: 12px;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    cursor: default;
  }

  .program-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }

  .price-section {
    background-color: rgba(var(--v-theme-primary), 0.05);
    border-radius: 8px;
    padding: 12px;
  }

  .price-display {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 32px;
  }

  .text-primary {
    color: rgb(var(--v-theme-primary)) !important;
  }

  /* Mobile optimizations */
  @media (max-width: 600px) {
    .program-card {
      margin-bottom: 16px;
    }

    .price-section {
      padding: 8px;
    }

    .text-h6 {
      font-size: 1.1rem !important;
    }
  }

  /* Modal responsiveness */
  @media (max-width: 400px) {
    .v-dialog {
      margin: 16px;
    }

    .v-dialog .v-card {
      max-width: calc(100vw - 32px) !important;
    }
  }

  /* Button improvements */
  .v-btn.v-btn--size-small {
    min-height: 32px;
  }

  /* Grid spacing adjustments */
  @media (min-width: 960px) {
    .v-col-lg-3 {
      max-width: 300px;
    }
  }
</style>
