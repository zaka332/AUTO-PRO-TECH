// طبقة البيانات — تعمل مع Firebase Firestore إن كانت مضبوطة، وإلا في وضع العرض التجريبي
// (بيانات في الذاكرة + الطلبات في localStorage)
import {
  db, auth, storage, firebaseConfigured,
} from '../firebase.js'
import { ENV, DEFAULT_SETTINGS } from '../config.js'
import { seedProducts } from '../data/seed.js'
import { seedCars } from '../data/carsSeed.js'
import { WILAYAS } from '../data/wilayas.js'
import {
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, onSnapshot,
} from 'firebase/firestore'
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const demoMode = !firebaseConfigured

/* ============ المنتجات ============ */
let cache = { products: null, at: 0 }

export async function fetchProducts(force = false) {
  if (demoMode) return seedProducts
  if (!force && cache.products && Date.now() - cache.at < 60_000) return cache.products
  const snap = await getDocs(
    query(collection(db, 'products'), where('active', '==', true), orderBy('createdAt', 'desc'), limit(500)),
  )
  cache.products = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  cache.at = Date.now()
  return cache.products
}

export function filterProducts(products, { category, brand, model, year, q, featured }) {
  let list = products
  if (category) list = list.filter((p) => p.category === category)
  if (brand) list = list.filter((p) => p.brand === brand)
  if (model) list = list.filter((p) => p.model === model)
  if (year) list = list.filter((p) => String(p.year) === String(year))
  if (featured) list = list.filter((p) => p.featured)
  if (q) {
    const s = q.trim().toLowerCase()
    list = list.filter((p) =>
      [p.name, p.brand, p.model, p.sku, p.description].join(' ').toLowerCase().includes(s),
    )
  }
  return list
}

export async function fetchProduct(id) {
  if (demoMode) return seedProducts.find((p) => p.id === id) || null
  const snap = await getDoc(doc(db, 'products', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

/* ============ الطلبات ============ */
const LS_ORDERS = 'apt_demo_orders'

function demoOrders() {
  try { return JSON.parse(localStorage.getItem(LS_ORDERS) || '[]') } catch { return [] }
}
function saveDemoOrders(o) { localStorage.setItem(LS_ORDERS, JSON.stringify(o)) }

export async function createOrder(order) {
  if (demoMode) {
    const orders = demoOrders()
    const id = 'DMO' + Math.random().toString(36).slice(2, 8).toUpperCase()
    const full = { id, seq: orders.length + 1, status: 'new', createdAt: Date.now(), ...order }
    orders.unshift(full)
    saveDemoOrders(orders)
    return full
  }
  const ref = await addDoc(collection(db, 'orders'), {
    ...order, status: 'new', createdAt: serverTimestamp(),
  })
  return { id: ref.id, ...order, status: 'new' }
}

export async function fetchOrders() {
  if (demoMode) return demoOrders()
  const snap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(500)))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export function subscribeOrders(cb, errCb) {
  if (demoMode) {
    cb(demoOrders())
    return () => {}
  }
  return onSnapshot(
    query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(200)),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (e) => errCb?.(e),
  )
}

export async function updateOrderStatus(id, status) {
  if (demoMode) {
    const orders = demoOrders().map((o) => (o.id === id ? { ...o, status } : o))
    saveDemoOrders(orders)
    return
  }
  await updateDoc(doc(db, 'orders', id), { status, updatedAt: serverTimestamp() })
}

/* ============ الإعدادات ============ */
export async function fetchSettings() {
  if (demoMode) return { ...DEFAULT_SETTINGS }
  try {
    const snap = await getDoc(doc(db, 'settings', 'store'))
    return snap.exists() ? { ...DEFAULT_SETTINGS, ...snap.data() } : { ...DEFAULT_SETTINGS }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export async function saveSettings(patch) {
  if (demoMode) {
    localStorage.setItem('apt_demo_settings', JSON.stringify(patch))
    return
  }
  await setDoc(doc(db, 'settings', 'store'), patch, { merge: true })
}

/* ============ إدارة المنتجات (لوحة التحكم) ============ */
export async function saveProduct(data, id) {
  if (demoMode) {
    console.warn('وضع العرض: التغييرات مؤقتة في الذاكرة فقط')
    return id
  }
  if (id) {
    await updateDoc(doc(db, 'products', id), data)
    return id
  }
  const ref = await addDoc(collection(db, 'products'), {
    ...data, active: true, createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function deleteProduct(id) {
  if (demoMode) return
  await deleteDoc(doc(db, 'products', id))
}

export async function uploadProductImage(file, folder = 'products') {
  if (demoMode) {
    return await new Promise((res) => {
      const r = new FileReader()
      r.onload = () => res(r.result)
      r.readAsDataURL(file)
    })
  }
  const name = `${folder}/${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`
  await uploadBytes(ref(storage, name), file)
  return await getDownloadURL(ref(storage, name))
}

// تحميل المنتجات التجريبية إلى Firestore
export async function seedDemoProducts() {
  if (demoMode) return
  for (const p of seedProducts) {
    const { id, ...data } = p
    await addDoc(collection(db, 'products'), {
      ...data, createdAt: serverTimestamp(),
    })
  }
}

/* ============ مصادقة المدير ============ */
export function isAdminUser(user) {
  if (!user?.email) return false
  const email = user.email.toLowerCase()
  if (ENV.adminEmail) return email === ENV.adminEmail
  return email.endsWith('@autoprotech.dz')
}

export async function adminSignIn(email, password) {
  if (demoMode) {
    return { email, demo: true }
  }
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function adminSignOut() {
  if (!demoMode) await signOut(auth)
}

export function subscribeAuth(cb) {
  if (demoMode) {
    cb(JSON.parse(localStorage.getItem('apt_demo_admin') || 'null'))
    return () => {}
  }
  return onAuthStateChanged(auth, cb)
}

export function persistDemoAdmin(user) {
  if (demoMode) localStorage.setItem('apt_demo_admin', JSON.stringify({ email: user.email }))
}

/* ============ السيارات المعروضة للبيع (أقل من 3 سنوات) ============ */
const LS_CARS = 'apt_demo_cars'

function demoCars() {
  try {
    return JSON.parse(localStorage.getItem(LS_CARS) || 'null') || seedCars
  } catch { return seedCars }
}

export async function fetchCars(force = false) {
  if (demoMode) return demoCars()
  if (!force && cache.cars && Date.now() - cache.at < 60_000) return cache.cars
  const snap = await getDocs(
    query(collection(db, 'cars'), where('active', '==', true), orderBy('createdAt', 'desc'), limit(200)),
  )
  cache.cars = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  cache.at = Date.now()
  return cache.cars
}

export async function fetchCar(id) {
  if (demoMode) return demoCars().find((c) => c.id === id) || null
  const snap = await getDoc(doc(db, 'cars', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function saveCar(data, id) {
  if (demoMode) {
    console.warn('وضع العرض: التغييرات مؤقتة في الذاكرة فقط')
    return id
  }
  if (id) {
    await updateDoc(doc(db, 'cars', id), data)
    return id
  }
  const r = await addDoc(collection(db, 'cars'), {
    ...data, active: true, createdAt: serverTimestamp(),
  })
  return r.id
}

export async function deleteCar(id) {
  if (demoMode) return
  await deleteDoc(doc(db, 'cars', id))
}

/* ============ تصدير كتالوج فيسبوك (Meta Business) ============ */
export function exportFacebookCatalog(products) {
  const origin = ENV.siteUrlFallback || import.meta.env.VITE_SITE_URL || window.location.origin
  const rows = [
    'id,title,description,availability,condition,price,link,image_link,brand,google_product_category',
  ]
  for (const p of products) {
    const val = (v) => `"${String(v ?? '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    rows.push(
      [
        p.sku || p.id,
        val(p.name),
        val(p.description?.slice(0, 200)),
        p.stock > 0 ? 'in stock' : 'out of stock',
        'new',
        `${p.price} DZD`,
        `${origin}/product/${p.id}`,
        val(p.image),
        val(p.brand),
        '507057 Vehicles & Parts > Vehicle Parts & Accessories',
      ].join(','),
    )
  }
  const blob = new Blob(['\ufeff' + rows.join('\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'autoprotech-catalog.csv'
  a.click()
  URL.revokeObjectURL(a.href)
}
