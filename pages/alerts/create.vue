<template>
  <v-container class="create-alert-page" fluid>
    <!-- Header with Back Button -->
    <div class="page-header mb-6">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        color="primary"
        class="back-btn"
        @click="navigateTo('/alerts/view')"
      />

      <div class="header-content flex-grow-1 ml-3">
        <h1 class="text-h5 font-weight-bold mb-2">Criar Alerta</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          Receba notificações das melhores ofertas em 3 passos simples
        </p>
      </div>
    </div>

    <!-- Banner de Configuração do WhatsApp -->
    <WhatsAppBanner
      :is-whats-app-configured="isWhatsAppConfigured"
      :show-banner="showWhatsAppBanner"
      @close="showWhatsAppBanner = false"
      @configure="navigateTo('/alerts/view?tab=channels')"
    />

    <!-- Progress Indicator -->
    <div class="progress-section mb-6">
      <v-stepper
        v-model="currentStep"
        :items="steps"
        hide-actions
        flat
        color="primary"
        class="elevation-0"
      />
    </div>

    <v-form ref="alertForm" @submit.prevent="handleCreateAlert">
      <!-- Step Content -->
      <v-window v-model="currentStep" class="step-window">
        <!-- Step 1: Tipo de benefício -->
        <v-window-item :value="1">
          <v-card class="step-card" elevation="2">
            <v-card-title class="step-title">
              <v-icon color="success" size="28" class="mr-3">mdi-gift</v-icon>
              Que tipo de benefício você quer?
            </v-card-title>

            <v-card-text class="pa-6">
              <p class="step-description mb-6">
                Selecione o tipo de benefício que você quer receber
              </p>

              <!-- Benefit Types -->
              <div class="benefit-types mb-6">
                <v-card
                  :class="[
                    'benefit-card',
                    'cashback',
                    { selected: selectedBenefitType === 'cashback' },
                  ]"
                  @click="selectBenefitType('cashback')"
                  role="button"
                  tabindex="0"
                  @keydown.enter="selectBenefitType('cashback')"
                  @keydown.space="selectBenefitType('cashback')"
                  ripple
                >
                  <v-card-text class="benefit-content">
                    <v-icon size="32" color="success">mdi-cash-multiple</v-icon>
                    <h4>Cashback</h4>
                    <p>Dinheiro de volta</p>
                  </v-card-text>
                </v-card>

                <v-card
                  :class="[
                    'benefit-card',
                    'points',
                    { selected: selectedBenefitType === 'points' },
                  ]"
                  @click="selectBenefitType('points')"
                  role="button"
                  tabindex="0"
                  @keydown.enter="selectBenefitType('points')"
                  @keydown.space="selectBenefitType('points')"
                  ripple
                >
                  <v-card-text class="benefit-content">
                    <v-icon size="32" color="info">mdi-star</v-icon>
                    <h4>Pontos</h4>
                    <p>Programas de fidelidade</p>
                  </v-card-text>
                </v-card>

                <v-card
                  :class="[
                    'benefit-card',
                    'miles',
                    { selected: selectedBenefitType === 'miles' },
                  ]"
                  @click="selectBenefitType('miles')"
                  role="button"
                  tabindex="0"
                  @keydown.enter="selectBenefitType('miles')"
                  @keydown.space="selectBenefitType('miles')"
                  ripple
                >
                  <v-card-text class="benefit-content">
                    <v-icon size="32" color="purple">mdi-airplane</v-icon>
                    <h4>Milhas</h4>
                    <p>Viagens e upgrades</p>
                  </v-card-text>
                </v-card>
              </div>

              <!-- Program Selection -->
              <div v-if="selectedBenefitType" class="mt-6">
                <h5 class="mb-4">
                  Escolha o programa de {{ getBenefitTypeName }}:
                </h5>

                <ProgramAutocomplete
                  v-model="selectedProgram"
                  :filter-by-type="selectedBenefitType"
                  :multiple="false"
                  :label="`Selecione um programa de ${getBenefitTypeName}`"
                  :placeholder="`Busque por um programa de ${getBenefitTypeName}...`"
                  @program-selected="handleProgramSelected"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-window-item>

        <!-- Step 2: Onde receber alertas -->
        <v-window-item :value="2">
          <v-card class="step-card" elevation="2">
            <v-card-title class="step-title">
              <v-icon color="primary" size="28" class="mr-3"
                >mdi-storefront</v-icon
              >
              Onde você quer receber alertas?
            </v-card-title>

            <v-card-text class="pa-6">
              <p class="step-description mb-6">
                Escolha receber alertas de uma loja ou de todas as lojas de uma
                categoria
              </p>

              <!-- Store Options -->
              <div class="options-container">
                <v-card
                  :class="[
                    'option-card',
                    { selected: storeSelectionType === 'specific' },
                  ]"
                  @click="storeSelectionType = 'specific'"
                  role="button"
                  tabindex="0"
                  @keydown.enter="storeSelectionType = 'specific'"
                  @keydown.space="storeSelectionType = 'specific'"
                  ripple
                >
                  <v-card-text class="option-content">
                    <div class="option-header">
                      <v-icon color="primary" size="24">mdi-store</v-icon>
                      <h4>Uma loja específica</h4>
                    </div>
                    <p class="option-description">
                      Ex: Amazon, Americanas, Magazine Luiza
                    </p>
                  </v-card-text>
                </v-card>

                <v-card
                  :class="[
                    'option-card',
                    { selected: storeSelectionType === 'category' },
                  ]"
                  @click="storeSelectionType = 'category'"
                  role="button"
                  tabindex="0"
                  @keydown.enter="storeSelectionType = 'category'"
                  @keydown.space="storeSelectionType = 'category'"
                  ripple
                >
                  <v-card-text class="option-content">
                    <div class="option-header">
                      <v-icon color="primary" size="24"
                        >mdi-tag-multiple</v-icon
                      >
                      <h4>Categoria de lojas</h4>
                    </div>
                    <p class="option-description">
                      Ex: E-commerce, Supermercados, Farmácias
                    </p>
                  </v-card-text>
                </v-card>
              </div>

              <!-- Store Selection -->
              <div v-if="storeSelectionType" class="mt-6">
                <EcommerceAutocomplete
                  v-if="storeSelectionType === 'specific'"
                  v-model="selectedStore"
                  :multiple="false"
                  label="Buscar loja"
                  placeholder="Digite o nome da loja..."
                  :benefit-type="selectedBenefitType"
                  @ecommerce-selected="handleEcommerceSelected"
                />

                <v-select
                  v-if="storeSelectionType === 'category'"
                  v-model="selectedCategory"
                  :items="categories"
                  item-title="name"
                  item-value="id"
                  label="Escolha a categoria"
                  placeholder="Selecione uma categoria"
                  variant="outlined"
                  prepend-inner-icon="mdi-tag"
                  :rules="categoryRules"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-window-item>

        <!-- Step 3: Valor mínimo -->
        <v-window-item :value="3">
          <v-card class="step-card" elevation="2">
            <v-card-title class="step-title">
              <v-icon color="warning" size="28" class="mr-3"
                >mdi-calculator</v-icon
              >
              {{ getStepTitle }}
            </v-card-title>

            <v-card-text class="pa-6">
              <p class="step-description mb-6">
                {{ getThresholdDescription }}
              </p>

              <v-text-field
                v-model="threshold"
                :label="getThresholdLabel"
                :placeholder="getThresholdPlaceholder"
                variant="outlined"
                :prepend-inner-icon="getThresholdIcon"
                :suffix="getThresholdSuffix"
                :rules="thresholdRules"
                density="comfortable"
                type="number"
                :step="isCashbackType ? '0.01' : '1'"
                min="0"
                @input="formatThreshold"
              />

              <div class="threshold-help mt-4">
                <v-icon size="18" color="info" class="mr-2"
                  >mdi-information</v-icon
                >
                <span class="text-body-2 text-medium-emphasis">
                  {{ getThresholdHelp }}
                </span>
              </div>

              <!-- Preview Card -->
              <v-card
                v-if="isFormValid"
                class="preview-card mt-6"
                variant="tonal"
                color="primary"
              >
                <v-card-text class="pa-4">
                  <div class="preview-header mb-3">
                    <v-icon color="primary" class="mr-2">mdi-eye</v-icon>
                    <h5>Resumo do seu alerta:</h5>
                  </div>

                  <div class="preview-content">
                    <div class="preview-item">
                      <span class="preview-label">Benefício:</span>
                      <span class="preview-value">{{ getSummaryProgram }}</span>
                    </div>

                    <div class="preview-item">
                      <span class="preview-label">{{
                        storeSelectionType === 'specific'
                          ? 'Loja:'
                          : 'Categoria:'
                      }}</span>
                      <span class="preview-value">{{ getSummaryStore }}</span>
                    </div>

                    <div class="preview-item">
                      <span class="preview-label">Valor mínimo:</span>
                      <span class="preview-value"
                        >{{ threshold }}{{ getThresholdSuffix }}</span
                      >
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </v-window-item>
      </v-window>

      <!-- Navigation Buttons -->
      <div class="navigation-buttons mt-8">
        <div class="d-flex justify-space-between align-center">
          <v-btn
            v-if="currentStep > 1"
            variant="outlined"
            size="large"
            @click="previousStep"
            prepend-icon="mdi-chevron-left"
          >
            Voltar
          </v-btn>

          <div v-else></div>

          <v-btn
            v-if="currentStep < 3"
            color="primary"
            size="large"
            variant="flat"
            :disabled="!isCurrentStepValid"
            @click="nextStep"
            append-icon="mdi-chevron-right"
          >
            Continuar
          </v-btn>

          <v-btn
            v-else
            color="primary"
            size="large"
            variant="flat"
            :disabled="!isFormValid"
            :loading="isCreating"
            type="submit"
            prepend-icon="mdi-bell-plus"
          >
            Criar Alerta
          </v-btn>
        </div>
      </div>
    </v-form>
  </v-container>
</template>

<script lang="ts" setup>
  import type { User } from '~/types/user'

  // Stepper
  const currentStep = ref(1)
  const steps = [
    { title: 'Benefício', value: 1 },
    { title: 'Onde', value: 2 },
    { title: 'Valor', value: 3 },
  ]

  // Estados do formulário
  const storeSelectionType = ref<'specific' | 'category'>('specific')
  const selectedBenefitType = ref<'cashback' | 'points' | 'miles' | null>(null)
  const selectedProgram = ref<number | null>(null)
  const selectedProgramData = ref<any>(null)

  const selectedStore = ref<number | null>(null)
  const selectedEcommerce = ref<any>(null)
  const selectedCategory = ref('')

  // Estados para configuração do WhatsApp
  const { user } = useSanctumAuth<User>()
  const isWhatsAppConfigured = computed(
    () => user.value?.whatsapp_notification_enabled || false
  )
  const showWhatsAppBanner = ref(true)
  const threshold = ref('')

  const isCreating = ref(false)
  const alertForm = ref()

  const categories = ref<any>([])

  const fetchCategories = async () => {
    const { data, error, status } = await useSanctumFetch(`/api/categories`, {
      method: 'GET',
    })

    categories.value = data.value
  }

  onMounted(() => {
    fetchCategories()
  })

  definePageMeta({
    middleware: ['sanctum:auth'],
  })
  // Computeds para threshold baseado no tipo de benefício
  const isCashbackType = computed(() => {
    return selectedBenefitType.value === 'cashback'
  })

  const isPointsType = computed(() => {
    return selectedBenefitType.value === 'points'
  })

  const isMilesType = computed(() => {
    return selectedBenefitType.value === 'miles'
  })

  const getThresholdLabel = computed(() => {
    if (isCashbackType.value) return 'Cashback mínimo (%)'
    if (isPointsType.value) return 'Pontos mínimos'
    if (isMilesType.value) return 'Milhas mínimas'
    return 'Valor mínimo'
  })

  const getThresholdPlaceholder = computed(() => {
    if (isCashbackType.value) return 'Ex: 2.5'
    if (isPointsType.value) return 'Ex: 1000'
    if (isMilesType.value) return 'Ex: 500'
    return 'Ex: 5'
  })

  const getThresholdIcon = computed(() => {
    if (isCashbackType.value) return 'mdi-percent'
    if (isPointsType.value) return 'mdi-star'
    if (isMilesType.value) return 'mdi-airplane'
    return 'mdi-numeric'
  })

  const getThresholdSuffix = computed(() => {
    if (isCashbackType.value) return '%'
    if (isPointsType.value) return ' pts'
    if (isMilesType.value) return ' milhas'
    return ''
  })

  const getThresholdDescription = computed(() => {
    if (isCashbackType.value) {
      return 'Só receba alertas quando o cashback for pelo menos:'
    }
    if (isPointsType.value) {
      return 'Só receba alertas quando os pontos forem pelo menos:'
    }
    if (isMilesType.value) {
      return 'Só receba alertas quando as milhas forem pelo menos:'
    }
    return 'Só receba alertas quando o valor for pelo menos:'
  })

  const getThresholdHelp = computed(() => {
    if (isCashbackType.value) {
      return 'Exemplo: digite 2.5 para receber alertas de cashback de 2,5% ou mais'
    }
    if (isPointsType.value) {
      return 'Exemplo: digite 1000 para receber alertas de 1.000 pontos ou mais'
    }
    if (isMilesType.value) {
      return 'Exemplo: digite 500 para receber alertas de 500 milhas ou mais'
    }
    return 'Digite 0 para receber todos os alertas'
  })

  // Validações
  const categoryRules = [(v: string) => !!v || 'Selecione uma categoria']

  const thresholdRules = computed(() => {
    const baseRules: Array<(v: string) => true | string> = [
      (v: string) => !!v || 'Informe o valor mínimo',
      (v: string) => {
        const num = parseFloat(v)
        return (!isNaN(num) && num >= 0) || 'Valor deve ser maior ou igual a 0'
      },
    ]

    if (isCashbackType.value) {
      baseRules.push((v: string) => {
        const decimals = v.includes('.') ? v.split('.')[1]?.length || 0 : 0
        return decimals <= 2 || 'Máximo 2 casas decimais para cashback'
      })
    } else {
      baseRules.push((v: string) => {
        return (
          Number.isInteger(parseFloat(v)) ||
          'Apenas números inteiros são permitidos'
        )
      })
    }

    return baseRules
  })

  // Computeds
  const isFormValid = computed(() => {
    const hasBenefit = !!selectedBenefitType.value
    const hasProgram = !!selectedProgram.value
    const hasStore =
      storeSelectionType.value === 'specific'
        ? !!selectedStore.value
        : !!selectedCategory.value

    let hasValidThreshold = false
    if (threshold.value) {
      const num = parseFloat(threshold.value)
      if (isCashbackType.value) {
        hasValidThreshold = !isNaN(num) && num >= 0
      } else {
        hasValidThreshold = !isNaN(num) && num >= 0 && Number.isInteger(num)
      }
    }

    return hasBenefit && hasProgram && hasStore && hasValidThreshold
  })

  const showSummary = computed(() => {
    return isFormValid.value
  })

  const getSummaryStore = computed(() => {
    if (storeSelectionType.value === 'specific') {
      return selectedEcommerce.value?.name || 'Loja não selecionada'
    } else {
      const category = categories.value.find(
        (c: any) => c.id === selectedCategory.value
      )
      return category?.name || 'Categoria não selecionada'
    }
  })

  const getSummaryProgram = computed(() => {
    return selectedProgramData.value?.name || 'Programa não selecionado'
  })

  // Navigation Methods
  const nextStep = () => {
    if (currentStep.value < 3) {
      currentStep.value++
    }
  }

  const previousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  // Benefit Type Selection
  const selectBenefitType = (type: 'cashback' | 'points' | 'miles') => {
    selectedBenefitType.value = type
  }

  const getBenefitTypeName = computed(() => {
    const names = {
      cashback: 'cashback',
      points: 'pontos',
      miles: 'milhas',
    }
    return selectedBenefitType.value ? names[selectedBenefitType.value] : ''
  })

  const getStepTitle = computed(() => {
    if (isCashbackType.value) {
      return 'Qual o cashback mínimo?'
    }
    if (isPointsType.value) {
      return 'Quantos pontos no mínimo?'
    }
    if (isMilesType.value) {
      return 'Quantas milhas no mínimo?'
    }
    return 'Qual o valor mínimo?'
  })

  // Validation for each step
  const isCurrentStepValid = computed(() => {
    switch (currentStep.value) {
      case 1:
        return !!selectedBenefitType.value && !!selectedProgram.value
      case 2:
        return storeSelectionType.value === 'specific'
          ? !!selectedStore.value
          : !!selectedCategory.value
      case 3:
        return !!threshold.value && parseFloat(threshold.value) >= 0
      default:
        return false
    }
  })

  const handleEcommerceSelected = (ecommerce: any) => {
    selectedEcommerce.value = ecommerce
  }

  const handleProgramSelected = (program: any) => {
    selectedProgramData.value = program
  }

  const formatThreshold = (event: Event) => {
    const target = event.target as HTMLInputElement
    let value = target.value

    if (isCashbackType.value) {
      value = value.replace(/[^0-9.]/g, '')

      const parts = value.split('.')
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('')
      }

      if (parts[1] && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].slice(0, 2)
      }
    } else {
      value = value.replace(/[^0-9]/g, '')
    }

    threshold.value = value
  }

  const router = useRouter()

  const handleCreateAlert = async () => {
    const { valid } = await alertForm.value.validate()
    if (!valid) return

    isCreating.value = true

    try {
      const payload: any = {
        threshold: isCashbackType.value
          ? parseFloat(threshold.value)
          : parseInt(threshold.value),
        program_id: selectedProgram.value,
      }

      if (storeSelectionType.value === 'specific') {
        payload.ecommerce_id = selectedStore.value
      } else {
        payload.ecommerce_category = selectedCategory.value
      }

      console.log('API: Criar alerta com payload:', payload)
      const { data, error, status } = await useSanctumFetch(
        `/api/promotional-alerts`,
        {
          method: 'POST',
          body: payload,
        }
      )

      router.push('/alerts/view')
    } catch (error) {
      console.error('Erro ao criar alerta:', error)
    } finally {
      isCreating.value = false
    }
  }

  // Watchers
  watch(storeSelectionType, () => {
    selectedStore.value = null
    selectedEcommerce.value = null
    selectedCategory.value = ''
  })

  watch(selectedBenefitType, () => {
    selectedProgram.value = null
    selectedProgramData.value = null
    threshold.value = ''
  })
</script>

<style scoped>
  .create-alert-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 16px;
  }

  .page-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 24px;
  }

  .back-btn {
    margin-top: 4px;
    flex-shrink: 0;
  }

  .header-content {
    min-height: 48px;
  }

  .header-content h1 {
    font-size: 1.5rem;
    line-height: 1.3;
    margin-bottom: 8px;
    color: rgba(var(--v-theme-on-surface), 0.95);
  }

  .header-content p {
    font-size: 1rem;
    line-height: 1.4;
    color: rgba(var(--v-theme-on-surface), 0.7);
  }

  /* Progress Section */
  .progress-section {
    margin-bottom: 32px;
  }

  /* Step Window */
  .step-window {
    min-height: 400px;
  }

  .step-card {
    border-radius: 16px;
    overflow: hidden;
  }

  .step-title {
    padding: 24px 24px 16px;
    font-size: 1.25rem;
    font-weight: 600;
    color: rgba(var(--v-theme-on-surface), 0.9);
  }

  .step-description {
    font-size: 1rem;
    color: rgba(var(--v-theme-on-surface), 0.7);
    line-height: 1.5;
  }

  /* Options Container */
  .options-container {
    display: grid;
    gap: 12px;
    margin-bottom: 24px;
  }

  .option-card {
    border: 2px solid rgba(var(--v-theme-on-surface), 0.12);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .option-card:hover {
    border-color: rgba(var(--v-theme-primary), 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
  }

  .option-card.selected {
    border-color: rgb(var(--v-theme-primary));
    background-color: rgba(var(--v-theme-primary), 0.05);
  }

  .option-content {
    padding: 20px;
  }

  .option-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .option-header h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    color: rgba(var(--v-theme-on-surface), 0.9);
  }

  .option-description {
    font-size: 0.9rem;
    color: rgba(var(--v-theme-on-surface), 0.6);
    margin: 0;
    line-height: 1.3;
  }

  /* Benefit Types */
  .benefit-types {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
  }

  .benefit-card {
    border: 2px solid rgba(var(--v-theme-on-surface), 0.12);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    aspect-ratio: 1;
  }

  .benefit-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .benefit-card.selected {
    border-color: rgb(var(--v-theme-primary));
    background-color: rgba(var(--v-theme-primary), 0.05);
  }

  .benefit-card.cashback.selected {
    border-color: rgb(var(--v-theme-success));
    background-color: rgba(var(--v-theme-success), 0.05);
  }

  .benefit-card.points.selected {
    border-color: rgb(var(--v-theme-info));
    background-color: rgba(var(--v-theme-info), 0.05);
  }

  .benefit-card.miles.selected {
    border-color: rgb(var(--v-theme-purple));
    background-color: rgba(var(--v-theme-purple), 0.05);
  }

  .benefit-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
    padding: 20px;
  }

  .benefit-content h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 12px 0 4px;
    color: rgba(var(--v-theme-on-surface), 0.9);
  }

  .benefit-content p {
    font-size: 0.85rem;
    color: rgba(var(--v-theme-on-surface), 0.6);
    margin: 0;
    line-height: 1.2;
  }

  /* Threshold Help */
  .threshold-help {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 16px;
    background-color: rgba(var(--v-theme-info), 0.05);
    border-radius: 8px;
    border-left: 4px solid rgb(var(--v-theme-info));
  }

  /* Preview Card */
  .preview-card {
    border-radius: 12px;
  }

  .preview-header {
    display: flex;
    align-items: center;
  }

  .preview-header h5 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    color: rgb(var(--v-theme-primary));
  }

  .preview-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .preview-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .preview-label {
    font-weight: 500;
    color: rgba(var(--v-theme-on-surface), 0.8);
  }

  .preview-value {
    font-weight: 600;
    color: rgba(var(--v-theme-on-surface), 0.95);
  }

  /* Navigation Buttons */
  .navigation-buttons {
    margin-top: 32px;
    padding-bottom: 24px;
  }

  /* Mobile Adjustments */
  @media (max-width: 600px) {
    .create-alert-page {
      padding: 12px;
    }

    .header-content h1 {
      font-size: 1.25rem;
    }

    .header-content p {
      font-size: 0.9rem;
    }

    .progress-section {
      margin-bottom: 24px;
    }

    .step-title {
      padding: 20px 20px 12px;
      font-size: 1.1rem;
    }

    .step-card .v-card-text {
      padding: 20px;
    }

    .benefit-types {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .benefit-card {
      aspect-ratio: 3/1;
    }

    .benefit-content {
      flex-direction: row;
      text-align: left;
    }

    .benefit-content h4 {
      margin: 0 0 0 12px;
    }

    .benefit-content p {
      margin: 4px 0 0 12px;
    }
  }

  /* Vuetify Overrides */
  :deep(.v-stepper-header) {
    padding: 0;
    border-radius: 12px;
    background-color: rgba(var(--v-theme-surface), 0.5);
  }

  :deep(.v-stepper-item) {
    padding: 16px 20px;
  }

  :deep(.v-stepper-item--selected .v-stepper-item__title) {
    color: rgb(var(--v-theme-primary));
    font-weight: 600;
  }

  :deep(.v-text-field .v-field) {
    border-radius: 12px;
  }

  :deep(.v-select .v-field) {
    border-radius: 12px;
  }

  :deep(.v-radio-group .v-selection-control) {
    min-height: auto;
  }

  :deep(.v-radio .v-selection-control__wrapper) {
    align-self: flex-start;
    margin-top: 2px;
  }
</style>
