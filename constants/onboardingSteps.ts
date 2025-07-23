import type { OnboardingStep } from '../interfaces/onboarding'

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome-home',
    title: 'Bem-vindo ao Miles&Travels',
    description:
      'Sua jornada para economizar com cashback, pontos e milhas começa aqui! Na página inicial você encontra as promoções em destaque para começar a explorar.',
    target: '[data-onboarding="promotions-highlight"]',
    icon: 'mdi-home',
    animation: { icon: 'mdi-compass', color: 'primary' },
    features: [
      'Veja promoções em destaque na página inicial',
      'Descubra ofertas especiais de programas',
      'Explore categorias com melhores benefícios',
      'Comece sua busca por produtos',
    ],
    tip: '🏠 A página inicial mostra as melhores oportunidades do momento para você começar!',
  },

  {
    id: 'search-products-page',
    title: 'Busca Inteligente de Produtos',
    description:
      'Acesse a página de busca para encontrar produtos específicos. Quanto mais detalhada sua busca, melhores serão os resultados com ofertas personalizadas!',
    target: '[data-onboarding="search-input"]',
    icon: 'mdi-magnify',
    animation: { icon: 'mdi-magnify', color: 'primary' },
    features: [
      'Use termos específicos como "iPhone 15 Pro 256GB Azul"',
      'Inclua marca, modelo e características importantes',
      'Evite termos muito genéricos como "celular"',
      'O sistema busca em centenas de lojas simultaneamente',
    ],
    tip: '💡 Exemplo: Ao invés de "notebook", tente "notebook Dell Inspiron 15 i5 8GB" para resultados precisos.',
  },

  {
    id: 'product-selection',
    title: 'Seleção de Produtos',
    description:
      'Após a busca, você verá os produtos encontrados. Selecione aqueles que mais se aproximam do que você procura - eles serão usados para gerar ofertas personalizadas.',
    target: '[data-onboarding="product-list"]',
    icon: 'mdi-checkbox-marked-circle',
    animation: { icon: 'mdi-cursor-default-click', color: 'green' },
    features: [
      'Compare preços entre diferentes produtos',
      'Verifique avaliações e especificações',
      'Observe características como cor, tamanho e marca',
      'Selecione múltiplos produtos para mais opções',
    ],
    tip: '⚡ Selecione vários produtos similares - isso gera mais opções de ofertas para comparar!',
  },

  {
    id: 'offers-page',
    title: 'Ofertas dos Produtos Selecionados',
    description:
      'Na página de ofertas, você encontra todas as oportunidades geradas a partir dos produtos que selecionou, comparando cashback, pontos e milhas de diferentes programas.',
    target: '[data-onboarding="offers-list"]',
    icon: 'mdi-cart',
    animation: { icon: 'mdi-auto-fix', color: 'orange' },
    features: [
      'Ofertas dos seus produtos em Amazon, Shopee, Magazine Luiza e mais',
      'Comparação de programas de cashback, pontos e milhas',
      'Cálculo do melhor custo-benefício por produto',
      'Filtros para refinar suas opções',
    ],
    tip: '🛍️ Essas ofertas são baseadas especificamente nos produtos que você selecionou!',
  },
  {
    id: 'strategic-benefits',
    title: 'Entendendo os Benefícios',
    description:
      'Agora que você viu as ofertas, vamos explicar o que você pode fazer com cada tipo de benefício e como maximizar seus ganhos através de estratégias inteligentes.',
    // SEM target - será centralizado
    icon: 'mdi-school',
    animation: { icon: 'mdi-lightbulb', color: 'amber' },
    features: [
      'Cashback: Dinheiro de volta direto na sua conta',
      'Pontos: Podem virar produtos, descontos ou transferir para milhas',
      'Milhas: Use para passagens aéreas, hotéis e upgrades',
      'Transferências bonificadas: Dobre ou triplique seus pontos!',
    ],
    tip: '🚀 Estratégia secreta: Acumule pontos em compras estratégicas e depois transfira com bônus para maximizar milhas!',
  },

  {
    id: 'strategic-explanation',
    title: 'Compras Estratégicas Explicadas',
    description:
      'Compras estratégicas significam escolher conscientemente onde e como comprar para maximizar seus benefícios. Não é apenas sobre o menor preço!',
    // SEM target - será centralizado
    icon: 'mdi-strategy',
    animation: { icon: 'mdi-chart-line', color: 'success' },
    features: [
      'Escolha produtos que geram mais pontos/milhas por real gasto',
      'Considere o valor total: preço + benefícios',
      'Aproveite promoções de transferência bonificada',
      'Planeje compras grandes em períodos de bônus',
    ],
    tip: '💰 Exemplo: Um produto R$ 50 mais caro pode compensar se gerar 5.000 pontos extras que viram uma passagem!',
  },

  {
    id: 'bonus-transfers',
    title: 'Transferências Bonificadas - O Segredo',
    description:
      'Transferências bonificadas são promoções onde você ganha pontos/milhas extras ao transferir entre programas. É a forma mais eficiente de multiplicar seus benefícios!',
    // SEM target - será centralizado
    icon: 'mdi-cart',
    animation: { icon: 'mdi-trending-up', color: 'purple' },
    features: [
      'Transfira 10.000 pontos e ganhe 20.000 (bônus de 100%)',
      'Transforme pontos de cartão em milhas aéreas',
      'Aproveite promoções sazonais e datas especiais',
      'Multiplique o valor das suas compras estratégicas',
    ],
    tip: '⭐ Ciclo perfeito: Compra estratégica → Acumula pontos → Transferência bonificada → Milhas para viagem!',
  },
  {
    id: 'offers-filters',
    title: 'Filtros Inteligentes',
    description:
      'Use os filtros para refinar as ofertas dos seus produtos. Compare por tipo de programa, loja, ou encontre as melhores oportunidades de cashback.',
    target: '[data-onboarding="offers-filters"]',
    icon: 'mdi-filter-variant',
    animation: { icon: 'mdi-filter-variant', color: 'blue' },
    features: [
      'Filtre por cashback, pontos ou milhas',
      'Compare diferentes lojas e marketplaces',
      'Ordene por melhor benefício',
      'Encontre ofertas específicas dos seus produtos',
    ],
    tip: '💰 Considere não apenas o preço, mas também o valor total do cashback e benefícios!',
  },

  {
    id: 'promotions-page',
    title: 'Promoções Exclusivas de Programas',
    description:
      'Na página de promoções, descubra transferências bonificadas, ofertas especiais de programas de pontos e oportunidades por categorias que podem multiplicar seus benefícios!',
    target: '[data-onboarding="promotions-menu"]',
    icon: 'mdi-gift',
    animation: { icon: 'mdi-trending-up', color: 'purple' },
    features: [
      'Transferências bonificadas entre programas (ex: 100% bônus)',
      'Promoções específicas de programas de pontos e milhas',
      'Ofertas por categorias de produtos',
      'Oportunidades limitadas por tempo',
    ],
    tip: '⭐ Combine promoções com suas compras para maximizar pontos e milhas!',
  },
]
