<template>
  <v-container class="create-alert-page" fluid>
    <!-- Header with Back Button -->
    <div class="page-header mb-6">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        color="primary"
        class="back-btn"
        @click="goBack"
      />
      
      <div class="header-content flex-grow-1 ml-3">
        <h1 class="text-h5 font-weight-bold mb-2">
          Criar Novo Alerta
        </h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          Configure um alerta personalizado para receber notificações sobre ofertas e cashbacks
        </p>
      </div>
    </div>

    <v-form ref="alertForm" @submit.prevent="handleCreateAlert">
      <!-- Store Selection Card -->
      <v-card class="selection-card mb-4" elevation="1">
        <v-card-text class="pa-4">
          <div class="section-header mb-4">
            <v-icon color="primary" size="24" class="mr-2">mdi-storefront</v-icon>
            <h3 class="text-subtitle-1 font-weight-medium">
              Onde você quer receber alertas?
            </h3>
          </div>

          <p class="text-body-2 text-medium-emphasis mb-4">
            Escolha se deseja receber alertas de uma loja específica ou de toda uma categoria de lojas
          </p>

          <!-- Store Type Selection -->
          <div class="option-group mb-4">
            <v-radio-group 
              v-model="storeSelectionType" 
              density="comfortable"
              color="primary"
              hide-details
            >
              <v-radio value="specific" class="mb-2">
                <template #label>
                  <div class="radio-content">
                    <div class="radio-title">Loja específica</div>
                    <div class="radio-subtitle">Receber alertas apenas de uma loja escolhida</div>
                  </div>
                </template>
              </v-radio>
              
              <v-radio value="category">
                <template #label>
                  <div class="radio-content">
                    <div class="radio-title">Categoria de lojas</div>
                    <div class="radio-subtitle">Receber alertas de todas as lojas de uma categoria</div>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </div>

          <!-- Store Selection -->
          <EcommerceAutocomplete
            v-if="storeSelectionType === 'specific'"
            v-model="selectedStore"
            :multiple="false"
            class="mt-4"
            @ecommerce-selected="handleEcommerceSelected"
          />

          <v-select
            v-if="storeSelectionType === 'category'"
            v-model="selectedCategory"
            :items="categories"
            item-title="name"
            item-value="id"
            label="Selecione a categoria"
            placeholder="Escolha uma categoria"
            variant="outlined"
            prepend-inner-icon="mdi-tag"
            :rules="categoryRules"
            density="comfortable"
          />
        </v-card-text>
      </v-card>

      <!-- Program Selection Card -->
      <v-card class="selection-card mb-4" elevation="1">
        <v-card-text class="pa-4">
          <div class="section-header mb-4">
            <v-icon color="success" size="24" class="mr-2">mdi-star-circle</v-icon>
            <h3 class="text-subtitle-1 font-weight-medium">
              Que tipo de benefício você procura?
            </h3>
          </div>

          <p class="text-body-2 text-medium-emphasis mb-4">
            Escolha se deseja alertas de um programa específico ou de todos os programas de um tipo
          </p>

          <!-- Program Type Selection -->
          <div class="option-group mb-4">
            <v-radio-group 
              v-model="programSelectionType" 
              density="comfortable"
              color="success"
              hide-details
            >
              <v-radio value="specific" class="mb-2">
                <template #label>
                  <div class="radio-content">
                    <div class="radio-title">Programa específico</div>
                    <div class="radio-subtitle">Ex: Nubank Rewards, Multiplus, etc.</div>
                  </div>
                </template>
              </v-radio>
              
              <v-radio value="type">
                <template #label>
                  <div class="radio-content">
                    <div class="radio-title">Tipo de programa</div>
                    <div class="radio-subtitle">Ex: Cashback, Milhas, Pontos, etc.</div>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </div>

          <!-- Program Selection -->
          <ProgramAutocomplete
            v-model="selectedProgram"
            :selection-type="programSelectionType"
            :multiple="false"
            class="mt-4"
            @program-selected="handleProgramSelected"
            @program-type-selected="handleProgramTypeSelected"
          />
        </v-card-text>
      </v-card>

      <!-- Threshold Card -->
      <v-card class="selection-card mb-6" elevation="1">
        <v-card-text class="pa-4">
          <div class="section-header mb-4">
            <v-icon color="warning" size="24" class="mr-2">mdi-percent</v-icon>
            <h3 class="text-subtitle-1 font-weight-medium">
              Valor mínimo do benefício
            </h3>
          </div>

          <p class="text-body-2 text-medium-emphasis mb-4">
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

          <div class="threshold-help mt-2">
            <v-icon size="16" color="info" class="mr-1">mdi-information</v-icon>
            <span class="text-caption text-medium-emphasis">
              {{ getThresholdHelp }}
            </span>
          </div>
        </v-card-text>
      </v-card>

      <!-- Summary Card -->
      <v-card v-if="showSummary" class="summary-card mb-6" elevation="2" color="primary">
        <v-card-text class="pa-4">
          <div class="section-header mb-3">
            <v-icon color="white" size="24" class="mr-2">mdi-eye</v-icon>
            <h3 class="text-subtitle-1 font-weight-medium text-white">
              Resumo do seu alerta
            </h3>
          </div>

          <div class="summary-content text-white">
            <p class="mb-2">
              <strong>{{ storeSelectionType === 'specific' ? 'Loja' : 'Categoria' }}:</strong>
              {{ getSummaryStore }}
            </p>
            <p class="mb-2">
              <strong>{{ programSelectionType === 'specific' ? 'Programa' : 'Tipo' }}:</strong>
              {{ getSummaryProgram }}
            </p>
            <p class="mb-0">
              <strong>Valor mínimo:</strong> {{ threshold }}{{ getThresholdSuffix }}
            </p>
          </div>
        </v-card-text>
      </v-card>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <v-btn
          color="primary"
          size="large"
          variant="flat"
          block
          :disabled="!isFormValid"
          :loading="isCreating"
          type="submit"
        >
          <v-icon start>mdi-bell-plus</v-icon>
          Criar Alerta
        </v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script lang="ts" setup>
  type Step = 'phone' | 'verification'

  // Estados do formulário
  const storeSelectionType = ref<'specific' | 'category'>('specific')
  const programSelectionType = ref<'specific' | 'type'>('specific')
  
  const selectedStore = ref<number | null>(null)
  const selectedEcommerce = ref<any>(null)
  const selectedCategory = ref('')
  const selectedProgram = ref<number | string | null>(null)
  const selectedProgramData = ref<any>(null)
  const threshold = ref('')
  
  const isCreating = ref(false)
  const alertForm = ref()

  // Mock data apenas para categorias
  const categories = ref([
    { id: '1', name: 'E-commerce Geral' },
    { id: '2', name: 'Supermercados' },
    { id: '3', name: 'Eletrônicos' },
    { id: '4', name: 'Moda e Beleza' }
  ])

  // Computeds para threshold baseado no tipo de programa
  const selectedProgramTypeData = computed(() => {
    if (programSelectionType.value === 'specific' && selectedProgramData.value?.type) {
      return selectedProgramData.value.type.toLowerCase()
    } else if (programSelectionType.value === 'type' && selectedProgramData.value) {
      return selectedProgramData.value
    }
    return ''
  })

  const isCashbackType = computed(() => {
    return selectedProgramTypeData.value === 'cashback'
  })

  const isPointsType = computed(() => {
    return selectedProgramTypeData.value === 'points'
  })

  const isMilesType = computed(() => {
    return selectedProgramTypeData.value === 'miles'
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
      return 'Defina a porcentagem mínima de cashback para receber o alerta'
    }
    if (isPointsType.value) {
      return 'Defina a quantidade mínima de pontos para receber o alerta'
    }
    if (isMilesType.value) {
      return 'Defina a quantidade mínima de milhas para receber o alerta'
    }
    return 'Defina o valor mínimo para receber o alerta'
  })

  const getThresholdHelp = computed(() => {
    if (isCashbackType.value) {
      return 'Use valores decimais como 2.5 para 2,5%. Valor mínimo: 0%'
    }
    if (isPointsType.value) {
      return 'Use apenas números inteiros como 1000. Valor mínimo: 0 pontos'
    }
    if (isMilesType.value) {
      return 'Use apenas números inteiros como 500. Valor mínimo: 0 milhas'
    }
    return 'Valor mínimo: 0'
  })

  // Validações
  const categoryRules = [
    (v: string) => !!v || 'Selecione uma categoria'
  ]

  const thresholdRules = computed(() => {
    const baseRules = [
      (v: string) => !!v || 'Informe o valor mínimo',
      (v: string) => {
        const num = parseFloat(v)
        return !isNaN(num) && num >= 0 || 'Valor deve ser maior ou igual a 0'
      }
    ]

    if (isCashbackType.value) {
      baseRules.push(
        (v: string) => {
          const decimals = v.includes('.') ? v.split('.')[1]?.length || 0 : 0
          return decimals <= 2 || 'Máximo 2 casas decimais para cashback'
        }
      )
    } else {
      baseRules.push(
        (v: string) => {
          return Number.isInteger(parseFloat(v)) || 'Apenas números inteiros são permitidos'
        }
      )
    }

    return baseRules
  })

  // Computeds
  const isFormValid = computed(() => {
    const hasStore = storeSelectionType.value === 'specific' ? !!selectedStore.value : !!selectedCategory.value
    const hasProgram = !!selectedProgram.value
    
    let hasValidThreshold = false
    if (threshold.value) {
      const num = parseFloat(threshold.value)
      if (isCashbackType.value) {
        hasValidThreshold = !isNaN(num) && num >= 0
      } else {
        hasValidThreshold = !isNaN(num) && num >= 0 && Number.isInteger(num)
      }
    }
    
    return hasStore && hasProgram && hasValidThreshold
  })

  const showSummary = computed(() => {
    return isFormValid.value
  })

  const getSummaryStore = computed(() => {
    if (storeSelectionType.value === 'specific') {
      return selectedEcommerce.value?.name || 'Loja não selecionada'
    } else {
      const category = categories.value.find(c => c.id === selectedCategory.value)
      return category?.name || 'Categoria não selecionada'
    }
  })

  const getSummaryProgram = computed(() => {
    if (programSelectionType.value === 'specific') {
      return selectedProgramData.value?.name || 'Programa não selecionado'
    } else {
      // Para tipos, mostrar o nome do tipo selecionado
      const typeLabels = {
        cashback: 'Cashback',
        points: 'Pontos', 
        miles: 'Milhas'
      }
      return typeLabels[selectedProgramData.value as keyof typeof typeLabels] || 'Tipo não selecionado'
    }
  })

  // Methods
  const goBack = () => {
    console.log('Navigate to: /alerts/view')
  }

  const handleEcommerceSelected = (ecommerce: any) => {
    selectedEcommerce.value = ecommerce
  }

  const handleProgramSelected = (program: any) => {
    selectedProgramData.value = program
  }

  const handleProgramTypeSelected = (type: any) => {
    selectedProgramData.value = type
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

  const handleCreateAlert = async () => {
    const { valid } = await alertForm.value.validate()
    if (!valid) return

    isCreating.value = true

    try {
      const payload: any = {
        threshold: isCashbackType.value ? parseFloat(threshold.value) : parseInt(threshold.value)
      }

      if (storeSelectionType.value === 'specific') {
        payload.ecommerce_id = selectedStore.value
      } else {
        payload.ecommerce_category = selectedCategory.value
      }

      if (programSelectionType.value === 'specific') {
        payload.program_id = selectedProgram.value
      } else {
        payload.program_type = selectedProgram.value
      }

      console.log('API: Criar alerta com payload:', payload)

      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('API: Alerta criado com sucesso!')
      console.log('Navigate to: /alerts/view')

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

  watch(programSelectionType, () => {
    selectedProgram.value = null
    selectedProgramData.value = null
    threshold.value = ''
  })

  watch([selectedProgram], () => {
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
  }

  .back-btn {
    margin-top: 4px;
    flex-shrink: 0;
  }

  .header-content {
    min-height: 48px;
  }

  .selection-card {
    border-radius: 12px;
    border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
    transition: border-color 0.2s ease;
  }

  .selection-card:hover {
    border-color: rgba(var(--v-theme-primary), 0.2);
  }

  .summary-card {
    border-radius: 12px;
    background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgba(var(--v-theme-primary), 0.8));
  }

  .section-header {
    display: flex;
    align-items: center;
  }

  .option-group {
    background: rgba(var(--v-theme-surface), 0.5);
    border-radius: 8px;
    padding: 16px;
    border: 1px solid rgba(var(--v-theme-on-surface), 0.05);
  }

  .radio-content {
    margin-left: 8px;
  }

  .radio-title {
    font-weight: 500;
    color: rgba(var(--v-theme-on-surface), 0.9);
    margin-bottom: 2px;
  }

  .radio-subtitle {
    font-size: 0.75rem;
    color: rgba(var(--v-theme-on-surface), 0.6);
    line-height: 1.2;
  }

  .program-item {
    border-radius: 8px;
    margin: 2px 0;
  }

  .threshold-help {
    display: flex;
    align-items: center;
    margin-top: 8px;
  }

  .summary-content {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 16px;
  }

  .action-buttons {
    padding-bottom: 24px;
  }

  /* Mobile adjustments */
  @media (max-width: 600px) {
    .create-alert-page {
      padding: 12px;
    }

    .selection-card .v-card-text {
      padding: 16px !important;
    }

    .page-header {
      margin-bottom: 20px;
    }

    .section-header h3 {
      font-size: 1rem;
    }

    .option-group {
      padding: 12px;
    }
  }

  /* Radio group customization */
  :deep(.v-radio-group .v-selection-control) {
    min-height: auto;
  }

  :deep(.v-radio .v-selection-control__wrapper) {
    align-self: flex-start;
    margin-top: 2px;
  }

  /* Input customization */
  :deep(.v-text-field .v-field) {
    border-radius: 8px;
  }

  :deep(.v-select .v-field) {
    border-radius: 8px;
  }
</style>