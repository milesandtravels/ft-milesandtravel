export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  if (config.public.googleTagCode) {
    useHead({
      script: [
        {
          src: `https://www.googletagmanager.com/gtag/js?id=${config.public.googleTagCode}`,
          async: true,
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${config.public.googleTagCode}');
          `,
        },
      ],
    })

    window.gtag = function () {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push(arguments)
    }
  }
})
