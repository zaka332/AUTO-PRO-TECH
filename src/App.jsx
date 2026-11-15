import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import FloatingWhatsApp from './components/FloatingWhatsApp.jsx'
import BackToTop from './components/BackToTop.jsx'
import { initPixel, pixelTrack } from './lib/pixel.js'
import { demoMode } from './lib/db.js'

import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Cars from './pages/Cars.jsx'
import CarDetails from './pages/CarDetails.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

import AdminLogin from './pages/admin/AdminLogin.jsx'
import { AdminRoute } from './pages/admin/AdminLayout.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import AdminCars from './pages/admin/AdminCars.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'

export default function App() {
  const location = useLocation()

  // تهيئة Meta Pixel وتتبع تغيّر الصفحات
  useEffect(() => { initPixel() }, [])
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) { document.title = 'لوحة التحكم | AutoProTech' }
    pixelTrack('PageView')
  }, [location.pathname])

  const isAdmin = location.pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <Routes>
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="admin/cars" element={<AdminRoute><AdminCars /></AdminRoute>} />
        <Route path="admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  }

  return (
    <>
      {demoMode && (
        <div className="demo-top-banner" title="Firebase غير مضبوط — المتجر يعمل ببيانات تجريبية">
          🧪 <b>وضع العرض التجريبي</b> — المتجر يعمل ببيانات تجريبية. اضبط Firebase من ملف .env لتفعيله بالكامل (الشرح في README)
        </div>
      )}
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
      <BackToTop />
    </>
  )
}
