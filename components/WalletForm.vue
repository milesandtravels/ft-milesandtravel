<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card class="wallet-form-dialog">
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">
          {{ isEditing ? 'Editar Saldo' : 'Adicionar à Carteira' }}
        </span>
        <v-btn icon variant="text" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="isFormValid">
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="formData.program_id"
                :items="programOptions"
                item-title="label"
                item-value="value"
                label="Programa"
                placeholder="Selecione o programa"
                :rules="programRules"
                :disabled="isEditing"
                variant="outlined"
                :loading="loadingPrograms"
                prepend-inner-icon="mdi-star-circle"
              >
                <template #item="{ props: itemProps, item }">
                  <v-list-item v-bind="itemProps">
                    <template #prepend>
                      <div class="program-logo-container mr-3">
                        <v-img
                          :src="item.raw.logo_url"
                          :alt="`Logo ${item.raw.name}`"
                          contain
                          height="32"
                          max-width="48"
                          class="program-logo"
                        >
                          <template #error>
                            <div class="logo-error-small">
                              <v-icon :icon="getTypeIcon(item.raw.type)" size="16" color="grey"></v-icon>
                            </div>
                          </template>
                        </v-img>
                      </div>
                    </template>
                    <template #title>
                      <span class="font-weight-medium">{{
                        item.raw.name
                      }}</span>
                    </template>
                    <template #subtitle>
                      <v-chip
                        size="x-small"
                        :color="getTypeColor(item.raw.type)"
                        variant="tonal"
                      >
                        {{ getTypeLabel(item.raw.type) }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formData.balance"
                :label="balanceLabel"
                :placeholder="balancePlaceholder"
                :rules="balanceRules"
                variant="outlined"
                type="number"
                step="0.01"
                min="0"
                :suffix="
                  selectedProgramType === 'points'
                    ? 'pts'
                    : selectedProgramType === 'miles'
                      ? 'milhas'
                      : ''
                "
                prepend-inner-icon="mdi-cash"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="closeDialog"> Cancelar </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="loading"
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          {{ isEditing ? 'Atualizar' : 'Adicionar' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { Program, ProgramType } from '~/interfaces/program'
  import type {
    WalletAccount,
    CreateWalletAccountDTO,
  } from '~/interfaces/wallet'

  interface Props {
    modelValue: boolean
    programs: Program[]
    loadingPrograms?: boolean
    loading?: boolean
    editingAccount?: WalletAccount | null
  }

  interface Emits {
    'update:modelValue': [value: boolean]
    submit: [data: CreateWalletAccountDTO]
  }

  const props = withDefaults(defineProps<Props>(), {
    loadingPrograms: false,
    loading: false,
    editingAccount: null,
  })

  const emit = defineEmits<Emits>()

  const formRef = ref()
  const isFormValid = ref(false)

  const dialog = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  const isEditing = computed(() => !!props.editingAccount)

  const formData = ref<CreateWalletAccountDTO>({
    balance: 0,
    program_id: null as any,
  })

  const selectedProgram = computed(() =>
    props.programs.find(p => p.id === formData.value.program_id)
  )

  const selectedProgramType = computed(
    () => selectedProgram.value?.type || 'points'
  )

  const balanceLabel = computed(() => {
    const labels: Record<ProgramType, string> = {
      cashback: 'Saldo de Cashback',
      points: 'Quantidade de Pontos',
      miles: 'Quantidade de Milhas',
    }
    return labels[selectedProgramType.value] || 'Saldo'
  })

  const balancePlaceholder = computed(() => {
    const placeholders: Record<ProgramType, string> = {
      cashback: '0.00',
      points: '0',
      miles: '0',
    }
    return placeholders[selectedProgramType.value] || '0'
  })

  const programOptions = computed(() =>
    props.programs.map(program => ({
      label: program.name.charAt(0).toUpperCase() + program.name.slice(1),
      value: program.id,
      ...program,
    }))
  )

  const programRules = [(v: number) => (v !== null && v !== undefined && v !== 0) || 'Selecione um programa']

  const balanceRules = [
    (v: number) => (v !== undefined && v !== null) || 'Digite um valor',
    (v: number) => v >= 0 || 'Valor deve ser maior ou igual a zero',
  ]

  const getTypeColor = (type: ProgramType) => {
    const colors: Record<ProgramType, string> = {
      cashback: 'success',
      points: 'info',
      miles: 'purple',
    }
    return colors[type] || 'primary'
  }

  const getTypeLabel = (type: ProgramType) => {
    const labels: Record<ProgramType, string> = {
      cashback: 'Cashback',
      points: 'Pontos',
      miles: 'Milhas',
    }
    return labels[type] || type
  }

  const getTypeIcon = (type: ProgramType) => {
    const icons: Record<ProgramType, string> = {
      cashback: 'mdi-cash',
      points: 'mdi-star',
      miles: 'mdi-airplane',
    }
    return icons[type] || 'mdi-star'
  }

  const closeDialog = () => {
    dialog.value = false
    resetForm()
  }

  const resetForm = () => {
    formData.value = {
      balance: 0,
      program_id: null as any,
    }
    formRef.value?.resetValidation()
  }

  const handleSubmit = async () => {
    const { valid } = await formRef.value.validate()
    if (valid) {
      emit('submit', formData.value)
    }
  }

  watch(
    () => props.editingAccount,
    account => {
      if (account) {
        formData.value = {
          balance: account.balance,
          program_id: account.program.id,
        }
      } else {
        resetForm()
      }
    },
    { immediate: true }
  )

  watch(
    () => props.modelValue,
    open => {
      if (!open) {
        resetForm()
      }
    }
  )
</script>

<style scoped>
  .wallet-form-dialog {
    border-radius: 16px;
  }

  .wallet-form-dialog .v-card-title {
    padding: 20px 24px 16px;
    background: rgba(var(--v-theme-primary), 0.05);
  }

  .wallet-form-dialog .v-card-actions {
    background: rgba(var(--v-theme-surface), 0.5);
  }

  :deep(.v-select .v-field__input) {
    padding-top: 12px;
    padding-bottom: 12px;
  }

  :deep(.v-text-field .v-field__input) {
    padding-top: 12px;
    padding-bottom: 12px;
  }

  /* Program Logo Styles */
  .program-logo-container {
    width: 48px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 8px;
    padding: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .program-logo {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
  }

  .logo-error-small {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .v-theme--dark .program-logo-container {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
  }

  .v-theme--dark .logo-error-small {
    background: rgba(255, 255, 255, 0.05);
  }

  @media (max-width: 600px) {
    .wallet-form-dialog {
      margin: 16px;
    }
  }
</style>
