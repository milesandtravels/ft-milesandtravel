export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // Só carrega o Google Analytics em produção
  if (config.public.googleTagCode) {
    const gtagScript = document.createElement('script')
    gtagScript.async = true
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${config.public.googleTagCode}`
    document.head.appendChild(gtagScript)

    const gtagConfig = document.createElement('script')
    gtagConfig.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${config.public.googleTagCode}');
    `
    document.head.appendChild(gtagConfig)

    // Disponibiliza a função gtag globalmente
    window.gtag = function () {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push(arguments)
    }
  }
})
