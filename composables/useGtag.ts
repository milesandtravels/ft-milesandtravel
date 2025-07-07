export const useGtag = () => {
  const config = useRuntimeConfig()

  const gtag = (...args: any[]) => {
    if (window.gtag) {
      window.gtag(...args)
    }
  }

  const trackEvent = (eventName: string, parameters?: any) => {
    gtag('event', eventName, parameters)
  }

  const trackPageView = (pagePath: string) => {
    gtag('config', config.public.googleTagCode, {
      page_path: pagePath,
    })
  }

  return {
    gtag,
    trackEvent,
    trackPageView,
  }
}
