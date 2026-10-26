// Load existing analytics only on the production domain, never in local previews.
if (location.hostname === 'udbhavram.com' || location.hostname === 'www.udbhavram.com') {
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', 'G-FFT2JS2514')
  const analytics = document.createElement('script')
  analytics.async = true
  analytics.src = 'https://www.googletagmanager.com/gtag/js?id=G-FFT2JS2514'
  document.head.appendChild(analytics)
}
