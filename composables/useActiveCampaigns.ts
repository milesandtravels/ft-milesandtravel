import type {
  CampaignResponse,
  CampaignItem,
  CampaignType,
} from '~/interfaces/active-campaigns'

export const useActiveCampaigns = () => {
  // Busca todos os dados da API
  const fetchCampaigns = async (): Promise<CampaignItem[]> => {
    const { data } = await useSanctumFetch<CampaignResponse>('/api/promos')
    return data.value?.data || []
  }

  // Filtra campanhas por tipo
  const filterCampaignsByType = (
    campaigns: CampaignItem[],
    type: CampaignType
  ): CampaignItem[] => {
    return campaigns.filter(campaign => campaign.type === type)
  }

  // Formata o valor baseado no tipo
  const formatCampaignValue = (
    value: number,
    valueType: 'percent' | 'points'
  ): string => {
    if (valueType === 'percent') {
      return `${value}%`
    }
    return `+${value.toLocaleString('pt-BR')} pontos`
  }

  // Verifica se a campanha está expirada
  const isCampaignExpired = (expirationDate: string): boolean => {
    return new Date(expirationDate) < new Date()
  }

  // Formata data de expiração
  const formatExpirationDate = (date: string): string => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  return {
    fetchCampaigns,
    filterCampaignsByType,
    formatCampaignValue,
    isCampaignExpired,
    formatExpirationDate,
  }
}
