import type {
  WalletAccount,
  WalletAccountsResponseDTO,
  CreateWalletAccountDTO,
  WalletSummary,
} from '~/interfaces/wallet'
import type { Program, ProgramsResponseDTO } from '~/interfaces/program'
import { useSnackbarStore } from '~/store/snackbar'

export const useWallet = () => {
  const snackbarStore = useSnackbarStore()

  const accounts = ref<WalletAccount[]>([])
  const programs = ref<Program[]>([])
  const loading = ref(false)
  const loadingPrograms = ref(false)

  const summary = computed<WalletSummary>(() => {
    return accounts.value.reduce(
      (acc, account) => {
        switch (account.program.type) {
          case 'points':
            acc.totalPoints += account.balance
            break
          case 'miles':
            acc.totalMiles += account.balance
            break
        }
        return acc
      },
      { totalPoints: 0, totalMiles: 0 }
    )
  })

  const fetchAccounts = async () => {
    try {
      loading.value = true
      const { data } =
        await useSanctumFetch<WalletAccountsResponseDTO>('/api/accounts')
      accounts.value = data.value?.data || []
    } catch (error) {
      console.error('Erro ao buscar contas da carteira:', error)
      snackbarStore.showError('Erro ao carregar dados da carteira')
    } finally {
      loading.value = false
    }
  }

  const fetchPrograms = async () => {
    try {
      loadingPrograms.value = true
      const { data } =
        await useSanctumFetch<ProgramsResponseDTO>('/api/programs')

      programs.value = [
        ...(data.value?.points || []),
        ...(data.value?.miles || []),
      ]
    } catch (error) {
      console.error('Erro ao buscar programas:', error)
      snackbarStore.showError('Erro ao carregar programas disponíveis')
    } finally {
      loadingPrograms.value = false
    }
  }

  const createAccount = async (accountData: CreateWalletAccountDTO) => {
    try {
      loading.value = true
      await useSanctumFetch('/api/accounts', {
        method: 'POST',
        body: accountData,
      })

      snackbarStore.showSuccess('Programa adicionado à carteira com sucesso')

      await fetchAccounts()
      return true
    } catch (error) {
      console.error('Erro ao criar conta na carteira:', error)
      snackbarStore.showError('Erro ao adicionar programa à carteira')
      return false
    } finally {
      loading.value = false
    }
  }

  const updateAccount = async (
    accountId: number,
    accountData: CreateWalletAccountDTO
  ) => {
    try {
      loading.value = true
      await useSanctumFetch(`/api/accounts/${accountId}`, {
        method: 'PUT',
        body: accountData,
      })

      snackbarStore.showSuccess('Saldo atualizado com sucesso')

      await fetchAccounts()
      return true
    } catch (error) {
      console.error('Erro ao atualizar conta na carteira:', error)
      snackbarStore.showError('Erro ao atualizar saldo')
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteAccount = async (accountId: number) => {
    try {
      loading.value = true
      await useSanctumFetch(`/api/accounts/${accountId}`, {
        method: 'DELETE',
      })

      snackbarStore.showSuccess('Programa removido da carteira')

      await fetchAccounts()
      return true
    } catch (error) {
      console.error('Erro ao deletar conta da carteira:', error)
      snackbarStore.showError('Erro ao remover programa da carteira')
      return false
    } finally {
      loading.value = false
    }
  }

  const getAvailablePrograms = computed(() => {
    const existingProgramIds = accounts.value.map(account => account.program.id)
    return programs.value.filter(
      program => !existingProgramIds.includes(program.id)
    )
  })

  return {
    accounts: readonly(accounts),
    programs: readonly(programs),
    summary: readonly(summary),
    loading: readonly(loading),
    loadingPrograms: readonly(loadingPrograms),
    availablePrograms: readonly(getAvailablePrograms),
    fetchAccounts,
    fetchPrograms,
    createAccount,
    updateAccount,
    deleteAccount,
  }
}
