// مولّد صور مؤقتة أنيقة للمنتجات التجريبية (SVG مضمّن — لا يحتاج إنترنت)
const PALETTES = [
  ['#0f1b2d', '#1e3a5f', '#f97316'],
  ['#101827', '#312e81', '#38bdf8'],
  ['#111827', '#7c2d12', '#fb923c'],
  ['#0c1a1e', '#134e4a', '#2dd4bf'],
  ['#171225', '#4c1d95', '#a78bfa'],
  ['#1c1917', '#713f12', '#facc15'],
]

export function placeholderImage(title, subtitle = '', idx = 0, emoji = '⚙️') {
  const [bg, mid, accent] = PALETTES[idx % PALETTES.length]
  const t = esc(title.slice(0, 26))
  const s = esc(subtitle.slice(0, 32))
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${mid}"/>
    </linearGradient>
  </defs>
  <rect width="640" height="480" fill="url(#bg)"/>
  <circle cx="540" cy="70" r="130" fill="${accent}" opacity="0.08"/>
  <circle cx="90" cy="420" r="150" fill="${accent}" opacity="0.06"/>
  <rect x="40" y="40" width="10" height="60" rx="5" fill="${accent}" opacity="0.9"/>
  <text x="320" y="205" font-family="Tajawal, Arial, sans-serif" font-size="120" text-anchor="middle" opacity="0.9">${emoji}</text>
  <text x="320" y="300" font-family="Tajawal, Arial, sans-serif" font-weight="800" font-size="34" fill="#ffffff" text-anchor="middle">${t}</text>
  <text x="320" y="345" font-family="Tajawal, Arial, sans-serif" font-size="22" fill="${accent}" text-anchor="middle" opacity="0.95">${s}</text>
  <text x="320" y="435" font-family="Tajawal, Arial, sans-serif" font-weight="700" font-size="20" fill="#94a3b8" text-anchor="middle" direction="rtl">AutoProTech</text>
</svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
