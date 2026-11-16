import { useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { useLang } from '../i18n/index.jsx'
import { fmtPrice } from '../lib/format.js'
import { CheckIcon } from '../components/Icons.jsx'

export default function OrderSuccess() {
  const { id } = useParams()
  const { state } = useLocation()
  const { t, price } = useLang()
  const order = state?.order
  const wa = state?.wa

  useEffect(() => {
    document.title = `${t('os.ok')} | AutoProTech`
    if (wa) {
      const tm = setTimeout(() => { window.open(wa, '_blank') }, 1200)
      return () => clearTimeout(tm)
    }
  }, [wa, t])

  return (
    <div className="container section order-success">
      <div className="card success-card">
        <div className="success-anim"><CheckIcon size={46} /></div>
        <h2>{t('os.ok')}</h2>
        <p className="success-sub">
          {t('os.orderNo')} <b dir="ltr">#{order?.seq ? String(order.seq).padStart(4, '0') : id?.toUpperCase()}</b>
          <br />
          {t('os.willContact')}
        </p>

        {order && (
          <div className="success-details">
            <div className="sum-items">
              {order.items?.map((i) => (
                <div key={i.id} className="sum-item">
                  <img src={i.image} alt="" />
                  <span className="s-name">{i.name} <small>× {i.qty}</small></span>
                  <b>{price(i.price * i.qty)}</b>
                </div>
              ))}
            </div>
            <div className="sum-rows">
              <div><span>{t('co.delivery')}</span><b>{price(order.deliveryFee)}</b></div>
              <div className="sum-total"><span>{t('os.total')}</span><b>{price(order.total)}</b></div>
            </div>
          </div>
        )}

        <div className="success-actions">
          {wa && (
            <a className="btn btn-wa btn-lg" href={wa} target="_blank" rel="noreferrer">
              {t('os.waSend')}
            </a>
          )}
          <Link to="/products" className="btn btn-primary btn-lg">{t('os.shop')}</Link>
        </div>
        {state?.demo && (
          <small className="demo-note">{t('os.demo')}</small>
        )}
      </div>
    </div>
  )
}
