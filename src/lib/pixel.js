// Meta Pixel — تتبع الزيارات والطلبات (يعمل فقط عند ضبط VITE_FB_PIXEL_ID)
import { ENV } from '../config.js'

let ready = false

export function initPixel() {
  const id = ENV.pixelId
  if (!id || ready || typeof window === 'undefined') return
  /* Meta Pixel الأساسي */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = !0
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = !0
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
  window.fbq('init', id)
  window.fbq('track', 'PageView')
  ready = true
}

export function pixelTrack(event, data = {}) {
  if (!ready || !window.fbq) return
  window.fbq('track', event, data)
}

// أحداث جاهزة
export const trackViewProduct = (p) =>
  pixelTrack('ViewContent', { content_ids: [p.id], content_name: p.name, content_type: 'product', value: p.price, currency: 'DZD' })

export const trackAddToCart = (p) =>
  pixelTrack('AddToCart', { content_ids: [p.id], content_name: p.name, content_type: 'product', value: p.price, currency: 'DZD' })

export const trackInitiateCheckout = (subtotal) =>
  pixelTrack('InitiateCheckout', { value: subtotal, currency: 'DZD' })

export const trackPurchase = (order) =>
  pixelTrack('Purchase', { value: order.total, currency: 'DZD', num_items: order.items.reduce((a, i) => a + i.qty, 0) })
