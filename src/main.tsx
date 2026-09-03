import { StrictMode, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowLeft, ArrowUpRight, Copy, ExternalLink, GitBranch, Mail, Plus, Search, Trash2, Upload, X } from 'lucide-react'
import './styles.css'
import { appleLookupEndpoint, parseAppleLookup } from './app-store'
import { filterCatalog, nextDiscovery, selectDotPick } from './catalog'

const API_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'https://screen-studio-api.ilyastorunn.workers.dev')).replace(/\/$/, '')

type AppItem = {
  slug: string
  name: string
  category: string
  description: string
  long_description?: string
  app_store_url?: string
  developer?: string
  website_url?: string
  platform?: string
  icon: string
  screenshots: string[]
  accent: string
  updated: string
  updated_at?: string
  is_dot_pick?: boolean
}

const fallbackApps: AppItem[] = [
  { slug: 'focus-flow', name: 'Focus Flow', category: 'Productivity', description: 'A calm workspace for planning your day and protecting your attention.', icon: '◒', accent: '#b8f25a', updated: '2 days ago', screenshots: ['https://images.unsplash.com/photo-1551650975-87deedd944c3?w=900&q=85', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&q=85', 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=900&q=85'] },
  { slug: 'moodly', name: 'Moodly', category: 'Health & Fitness', description: 'Understand your patterns, check in with yourself, and make small changes that last.', icon: '✦', accent: '#f7a6cb', updated: '5 days ago', screenshots: ['https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=900&q=85', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&q=85', 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=900&q=85'] },
  { slug: 'orbit', name: 'Orbit', category: 'Finance', description: 'A beautifully simple way to see where your money goes.', icon: '◉', accent: '#b7c6ff', updated: '1 week ago', screenshots: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=85', 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=900&q=85', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&q=85'] },
]

function formatDate(value: string) {
  if (!value) return 'recently'
  const normalized = /^\d{4}-\d{2}-\d{2} /.test(value) ? `${value.replace(' ', 'T')}Z` : value
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

function parseApp(row: Record<string, unknown>): AppItem {
  let screenshots: string[] = []
  try {
    screenshots = Array.isArray(row.screenshots) ? row.screenshots as string[] : JSON.parse(String(row.screenshots || '[]'))
  } catch {
    screenshots = []
  }
  return {
    slug: String(row.slug || ''), name: String(row.name || ''), category: String(row.category || 'Other'),
    description: String(row.description || ''), long_description: String(row.long_description || ''),
    app_store_url: String(row.app_store_url || ''), developer: String(row.developer || ''),
    website_url: String(row.website_url || ''), platform: String(row.platform || 'iOS'),
    icon: String(row.icon || '✦'), accent: String(row.accent || '#b8f25a'), screenshots,
    updated_at: String(row.updated_at || ''), updated: formatDate(String(row.updated_at || row.updated || '')),
    is_dot_pick: Boolean(Number(row.is_dot_pick || 0)),
  }
}

function isImage(value: string) {
  return /^https?:\/\//i.test(value) || value.startsWith('/api/assets/')
}

function canvasToPng(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not prepare the image.')), 'image/png'))
}

async function loadBitmap(url: string) {
  const response = await fetch(url, { mode: 'cors' })
  if (!response.ok) throw new Error('Could not download this screenshot.')
  return createImageBitmap(await response.blob())
}

function fitCanvasText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (context.measureText(text).width <= maxWidth) return text
  let shortened = text
  while (shortened.length > 1 && context.measureText(`${shortened}…`).width > maxWidth) shortened = shortened.slice(0, -1)
  return `${shortened.trimEnd()}…`
}

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2)
  context.beginPath()
  context.moveTo(x + r, y)
  context.arcTo(x + width, y, x + width, y + height, r)
  context.arcTo(x + width, y + height, x, y + height, r)
  context.arcTo(x, y + height, x, y, r)
  context.arcTo(x, y, x + width, y, r)
  context.closePath()
}

const clubMascots = [
  { name: 'Nico', color: '#F3FF19', role: 'discovery', eyeTilt: -.12 },
  { name: 'Poppy', color: '#FF5A49', role: 'picks', eyeTilt: .1 },
  { name: 'Miso', color: '#F4F1E8', role: 'exports', eyeTilt: -.03 },
] as const

function randomClubMascot() {
  return clubMascots[Math.floor(Math.random() * clubMascots.length)]
}

function drawExportMascot(context: CanvasRenderingContext2D, x: number, y: number, size: number, mascot: typeof clubMascots[number]) {
  context.save()
  context.translate(x, y)
  context.fillStyle = mascot.color
  context.strokeStyle = '#111111'
  context.lineWidth = Math.max(1.5, size * .055)
  context.beginPath()
  context.moveTo(-size * .48, size * .35)
  context.bezierCurveTo(-size * .45, -size * .3, -size * .25, -size * .62, 0, -size * .64)
  context.bezierCurveTo(size * .29, -size * .66, size * .45, -size * .23, size * .48, size * .35)
  context.closePath()
  context.fill()
  context.stroke()
  context.fillStyle = '#111111'
  context.beginPath()
  context.ellipse(-size * .13, -size * .2, size * .045, size * .13, mascot.eyeTilt, 0, Math.PI * 2)
  context.ellipse(size * .13, -size * .2, size * .045, size * .13, mascot.eyeTilt, 0, Math.PI * 2)
  context.fill()
  context.restore()
}

async function withExportBanner(source: HTMLCanvasElement, app: AppItem) {
  const mascot = randomClubMascot()
  const bannerHeight = Math.max(84, Math.min(140, Math.round(source.height * .1)))
  const canvas = document.createElement('canvas')
  canvas.width = source.width
  canvas.height = source.height + bannerHeight
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not add the nice apps club credit.')
  context.drawImage(source, 0, 0)
  context.fillStyle = '#f5f3ee'
  context.fillRect(0, source.height, canvas.width, bannerHeight)

  const padding = Math.round(bannerHeight * .2)
  const iconSize = Math.round(bannerHeight * .46)
  const iconY = source.height + Math.round((bannerHeight - iconSize) / 2)
  roundedRect(context, padding, iconY, iconSize, iconSize, iconSize * .22)
  context.save()
  context.clip()
  context.fillStyle = app.accent || '#ff5a49'
  context.fillRect(padding, iconY, iconSize, iconSize)
  if (isImage(app.icon)) {
    try {
      const icon = await loadBitmap(app.icon)
      context.drawImage(icon, padding, iconY, iconSize, iconSize)
      icon.close()
    } catch { /* Keep the app accent as a resilient fallback. */ }
  } else {
    context.fillStyle = '#101010'
    context.font = `600 ${Math.round(iconSize * .5)}px Inter, Arial, sans-serif`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(app.icon || '✦', padding + iconSize / 2, iconY + iconSize / 2)
  }
  context.restore()

  const message = `${mascot.name} made it for you!`
  let messageSize = Math.max(10, Math.round(bannerHeight * .14))
  context.font = `650 ${messageSize}px Inter, Arial, sans-serif`
  const mascotSize = Math.round(bannerHeight * .42)
  const messageGap = Math.round(bannerHeight * .12)
  const messageMaxWidth = Math.max(92, source.width * .28)
  while (messageSize > 9 && context.measureText(message).width > messageMaxWidth) {
    messageSize -= 1
    context.font = `650 ${messageSize}px Inter, Arial, sans-serif`
  }
  const messageText = fitCanvasText(context, message, messageMaxWidth)
  const messageWidth = context.measureText(messageText).width
  const groupWidth = mascotSize + messageGap + messageWidth
  const groupX = Math.max(source.width * .3, source.width / 2 - groupWidth / 2)
  const groupRight = groupX + groupWidth
  const labelX = padding + iconSize + padding * .55
  const labelMaxWidth = Math.max(36, groupX - padding - labelX)
  const exportName = app.name.split(':')[0].trim()
  let labelSize = Math.max(12, Math.round(bannerHeight * .2))
  context.textBaseline = 'middle'
  context.textAlign = 'left'
  context.fillStyle = '#858580'
  context.font = `600 ${labelSize}px Inter, Arial, sans-serif`
  while (labelSize > 10 && context.measureText(exportName).width > labelMaxWidth) {
    labelSize -= 1
    context.font = `600 ${labelSize}px Inter, Arial, sans-serif`
  }
  context.fillText(fitCanvasText(context, exportName, labelMaxWidth), labelX, source.height + bannerHeight / 2)

  let brandSize = Math.max(11, Math.round(bannerHeight * .16))
  const brand = 'nice apps club'
  const brandAvailable = Math.max(58, source.width - padding - groupRight - padding)
  let brandWidth = 0
  do {
    context.font = `700 ${brandSize}px Inter, Arial, sans-serif`
    brandWidth = context.measureText(brand).width
    if (brandWidth <= brandAvailable || brandSize <= 8) break
    brandSize -= 1
  } while (true)
  const brandX = source.width - padding - brandWidth
  context.font = `700 ${brandSize}px Inter, Arial, sans-serif`
  context.fillStyle = '#111111'
  context.fillText(fitCanvasText(context, brand, brandAvailable), brandX, source.height + bannerHeight / 2)

  drawExportMascot(context, groupX + mascotSize / 2, source.height + bannerHeight / 2, mascotSize, mascot)
  context.font = `650 ${messageSize}px Inter, Arial, sans-serif`
  context.fillStyle = '#111111'
  context.fillText(messageText, groupX + mascotSize + messageGap, source.height + bannerHeight / 2)
  return canvas
}

async function screenshotAsPng(url: string, app: AppItem) {
  const bitmap = await loadBitmap(url)
  const source = document.createElement('canvas')
  source.width = bitmap.width
  source.height = bitmap.height
  const context = source.getContext('2d')
  if (!context) { bitmap.close(); throw new Error('Could not prepare the image.') }
  context.drawImage(bitmap, 0, 0)
  bitmap.close()
  return canvasToPng(await withExportBanner(source, app))
}

async function screenshotsAsOnePng(urls: string[], app: AppItem) {
  const bitmaps = await Promise.all(urls.map(loadBitmap))
  try {
    const padding = 18
    const gap = 12
    const totalAspectRatio = bitmaps.reduce((total, bitmap) => total + bitmap.width / bitmap.height, 0)
    const maxCanvasWidth = 14000
    const availableWidth = maxCanvasWidth - padding * 2 - gap * Math.max(0, bitmaps.length - 1)
    const tallestUsefulHeight = Math.min(1200, Math.max(...bitmaps.map(bitmap => bitmap.height)))
    const targetHeight = Math.max(1, Math.floor(Math.min(tallestUsefulHeight, availableWidth / totalAspectRatio)))
    const widths = bitmaps.map(bitmap => Math.round(targetHeight * bitmap.width / bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = padding * 2 + widths.reduce((total, width) => total + width, 0) + gap * Math.max(0, bitmaps.length - 1)
    canvas.height = targetHeight + padding * 2
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Could not combine the screenshots.')
    context.fillStyle = '#0b0b0b'
    context.fillRect(0, 0, canvas.width, canvas.height)
    let x = padding
    bitmaps.forEach((bitmap, index) => {
      context.drawImage(bitmap, x, padding, widths[index], targetHeight)
      x += widths[index] + gap
    })
    return canvasToPng(await withExportBanner(canvas, app))
  } finally {
    bitmaps.forEach(bitmap => bitmap.close())
  }
}

async function copyPng(png: Promise<Blob>) {
  if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') throw new Error('Image copying is not supported in this browser.')
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })])
}

function AppIcon({ app, large = false }: { app: Pick<AppItem, 'icon' | 'accent' | 'name'>; large?: boolean }) {
  return <div className={`app-icon${large ? ' large' : ''}`} style={{ background: app.accent }}>
    {isImage(app.icon) ? <img src={app.icon} alt={`${app.name} icon`} /> : <span aria-hidden="true">{app.icon}</span>}
  </div>
}

function Brand() {
  return <a className="site-brand" href="#/" aria-label="niceapps.club home"><span>niceapps.club</span><img src="/brand/dot-club.svg" alt="" /></a>
}

function Header({ query, setQuery, catalog }: { query: string; setQuery: (value: string) => void; catalog: AppItem[] }) {
  const searchRef = useRef<HTMLInputElement>(null)
  const searchResults = useMemo(() => query.trim() ? filterCatalog(catalog, query, 'All').slice(0, 8) : [], [catalog, query])
  const searchOpen = Boolean(query.trim())
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); searchRef.current?.focus()
      }
      if (event.key === 'Escape') { setQuery(''); searchRef.current?.blur() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
  return <header className={`site-header${searchOpen ? ' has-search-results' : ''}`}><div className="site-header-inner">
    <Brand />
    <label className="site-search"><Search aria-hidden="true" /><input ref={searchRef} value={query} onChange={event => setQuery(event.target.value)} placeholder="Search apps..." aria-label="Search apps" aria-expanded={searchOpen} aria-controls="global-search-results" />{searchOpen ? <button type="button" onClick={() => { setQuery(''); searchRef.current?.focus() }} aria-label="Clear search"><X /></button> : <kbd>⌘K</kbd>}</label>
    <nav className="site-nav"><a href="#apps">Explore</a><a className="suggest-link" href="https://github.com/ilyastorunn/screen.studio/issues/new?template=app-request.yml" target="_blank" rel="noreferrer">Suggest an app <ArrowUpRight /></a></nav>
  </div>{searchOpen && <div className="search-popover" id="global-search-results"><div className="search-popover-head"><span>Search results</span><small>{searchResults.length}{searchResults.length === 8 ? '+' : ''} found</small></div>{searchResults.length ? <div className="search-result-list">{searchResults.map(app => <a href={`#/apps/${app.slug}`} key={app.slug} onClick={() => setQuery('')}><AppIcon app={app} /><span><strong>{app.name}</strong><small>{app.category}</small></span><ArrowUpRight /></a>)}</div> : <div className="search-no-results"><strong>No nice apps found.</strong><span>Try a different name or category.</span></div>}</div>}</header>
}

function ScreenshotStrip({ app }: { app: AppItem }) {
  const shots = app.screenshots.slice(0, 3)
  const stripStyle = shots.length ? { gridTemplateColumns: `repeat(${shots.length}, minmax(0, 1fr))` } : undefined
  return <div className={`shot-row${shots.length ? '' : ' shot-row-empty'}`} style={stripStyle}>
    {shots.length ? shots.map((shot, index) => <img key={shot} src={shot} alt={`${app.name} screenshot ${index + 1}`} loading="lazy" />) : <div><AppIcon app={app} large /><span>Screenshots coming soon</span></div>}
  </div>
}

function AppCard({ app, lead = false }: { app: AppItem; lead?: boolean }) {
  return <a className={`app-card${lead ? ' is-lead' : ''}`} href={`#/apps/${app.slug}`}><ScreenshotStrip app={app} /><div className="app-meta"><AppIcon app={app} /><div><strong>{app.name}</strong><small>{app.category}</small></div></div></a>
}

function DotPickCard({ app }: { app: AppItem }) {
  return <a className="dot-pick-card" href={`#/apps/${app.slug}`}>
    <img className="dot-pick-mascot" src="/brand/poppy-peek.svg" alt="" />
    <div className="dot-pick-copy"><span className="dot-pick-label">★ Poppy’s pick</span><AppIcon app={app} /><h3>{app.name}</h3><p>{app.description}</p><span className="dot-pick-meta">{app.name}<small>{app.category}</small></span></div>
    <ScreenshotStrip app={app} />
  </a>
}

function Hero() {
  return <section className="dot-hero">
    <div className="hero-copy"><p className="eyebrow">A curated collection of app design</p><h1>Find<br />something nice<span>.</span></h1><p>A hand-picked collection of apps worth opening.</p><a className="outline-cta" href="#apps">Browse the collection <ArrowUpRight /></a></div>
    <div className="hero-media"><picture><source srcSet="/brand/dot-garden.jpg" type="image/jpeg" /><img src="/brand/dot-garden.png" alt="Nico exploring a handmade garden of app interfaces" width="1448" height="1086" fetchPriority="high" /></picture></div>
  </section>
}

function Collection({ catalog, loading, query }: { catalog: AppItem[]; loading: boolean; query: string }) {
  const [category, setCategory] = useState('All')
  const availableCategories = ['All', ...Array.from(new Set(catalog.map(app => app.category)))]
  const filtered = useMemo(() => filterCatalog(catalog, query, category), [catalog, query, category])
  const dotPick = selectDotPick(catalog)
  const showPick = Boolean(dotPick && filtered.some(app => app.slug === dotPick.slug))
  const regularApps = showPick ? filtered.filter(app => app.slug !== dotPick?.slug) : filtered
  return <section id="apps" className="collection-section"><div className="collection-head"><div><p className="eyebrow">The collection</p><h2>Latest apps</h2></div><span>{loading ? 'Loading…' : `${filtered.length} ${filtered.length === 1 ? 'app' : 'apps'}`}<i /></span></div>
    <div className="filters" aria-label="Filter apps by category">{availableCategories.map(item => <button className={category === item ? 'active' : ''} aria-pressed={category === item} onClick={() => setCategory(item)} key={item}>{item}{item === 'All' && <i />}</button>)}</div>
    {filtered.length ? <div key={`${query.trim().toLowerCase()}-${category}`} className={`collection-grid${showPick ? ' with-pick' : ''}`}>{showPick && dotPick && <DotPickCard app={dotPick} />}{regularApps.map((app, index) => <AppCard key={app.slug} app={app} lead={showPick && index === 0} />)}</div> : <div className="public-empty"><img src="/brand/dot-peek.svg" alt="" /><strong>No nice apps found.</strong><span>Try another search or category.</span></div>}
  </section>
}

function Footer({ count }: { count: number }) {
  return <footer className="site-footer"><Brand /><span>Curated apps.<br />No noise.</span><span className="footer-count">{count} apps and counting.</span><div><a href="https://github.com/ilyastorunn/screen.studio/issues/new?template=app-request.yml" target="_blank" rel="noreferrer"><img src="/brand/dot-mark.svg" alt="" /> Suggest an app</a><a href="https://github.com/ilyastorunn/screen.studio" target="_blank" rel="noreferrer"><GitBranch /> GitHub</a></div></footer>
}

function Home({ catalog, loading, query, setQuery }: { catalog: AppItem[]; loading: boolean; query: string; setQuery: (value: string) => void }) {
  return <div className="public-shell"><Header query={query} setQuery={setQuery} catalog={catalog} /><main><Hero /><Collection catalog={catalog} loading={loading} query="" /></main><Footer count={catalog.length} /></div>
}

function ScreenshotGallery({ app }: { app: AppItem }) {
  const [copying, setCopying] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [copyError, setCopyError] = useState('')
  const progressRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef(0)
  const updateProgress = (rail: HTMLDivElement) => {
    if (frameRef.current) return
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = 0
      const range = rail.scrollWidth - rail.clientWidth
      progressRef.current?.style.setProperty('--gallery-progress', String(range > 0 ? rail.scrollLeft / range : 0))
    })
  }
  const runCopy = async (target: string, png: Promise<Blob>) => {
    setCopying(target); setCopied(null); setCopyError('')
    try { await copyPng(png); setCopied(target); window.setTimeout(() => setCopied(current => current === target ? null : current), 1800) }
    catch (cause) { setCopyError(cause instanceof Error ? cause.message : 'Copy failed. Please try again.') }
    finally { setCopying(null) }
  }
  return <section className="detail-showcase" aria-labelledby="screenshots-title"><div className="showcase-head"><div><p className="eyebrow">Visual library</p><h2 id="screenshots-title">App Store screenshots</h2></div><button className="copy-all" type="button" disabled={Boolean(copying)} onClick={() => void runCopy('all', screenshotsAsOnePng(app.screenshots, app))}><img src="/brand/miso-mark.svg" alt="" />{copying === 'all' ? 'Combining…' : copied === 'all' ? 'Copied all ✓' : <>Copy all <Copy /></>}</button></div>
    <div className="screenshot-rail" tabIndex={0} onScroll={event => updateProgress(event.currentTarget)}>{app.screenshots.map((shot, index) => { const target = `shot-${index}`; return <button className={`screenshot-copy${copying === target ? ' is-copying' : ''}${copied === target ? ' is-copied' : ''}`} type="button" key={shot} disabled={Boolean(copying)} onClick={() => void runCopy(target, screenshotAsPng(shot, app))} aria-label={`Copy ${app.name} screenshot ${index + 1}`}><img src={shot} alt={`${app.name} screenshot ${index + 1}`} loading={index < 3 ? 'eager' : 'lazy'} /><span>{copying === target ? 'Copying…' : copied === target ? 'Copied ✓' : 'Click to copy'}</span></button> })}</div>
    <div className="gallery-progress" ref={progressRef}><i /><img src="/brand/dot-mark.svg" alt="" /></div>{copyError && <p className="copy-status error" role="alert">{copyError}</p>}<p className="copy-status" aria-live="polite">{copied === 'all' ? 'All screenshots were copied as one PNG.' : copied?.startsWith('shot-') ? 'Screenshot copied as a PNG.' : ''}</p>
  </section>
}

function NextDiscovery({ app }: { app: AppItem }) {
  return <section className="next-discovery"><p className="eyebrow">Next discovery</p><a href={`#/apps/${app.slug}`}><div className="next-copy"><h2>Keep looking.<br />Nico found another one.</h2><p>{app.description}</p><img src="/brand/dot-stretch.svg" alt="Nico pointing to the next app" /></div><div className="next-app"><div><AppIcon app={app} large /><span><strong>{app.name}</strong><small>{app.category}</small></span></div><ScreenshotStrip app={app} /></div></a></section>
}

function Detail({ app, catalog, query, setQuery }: { app: AppItem; catalog: AppItem[]; query: string; setQuery: (value: string) => void }) {
  useEffect(() => { document.title = `${app.name} | nice apps club`; return () => { document.title = 'nice apps club' } }, [app.name])
  const fullDescription = app.long_description?.trim() || ''
  const descriptionParagraphs = fullDescription.split(/\n\s*\n/).map(paragraph => paragraph.trim()).filter(Boolean)
  const firstParagraph = descriptionParagraphs[0] || app.description
  const remainingDescription = descriptionParagraphs.slice(1).join('\n\n')
  const next = nextDiscovery(catalog, app.slug)
  const titleClass = app.name.length > 32 ? ' is-long' : ''
  return <div className="public-shell"><Header query={query} setQuery={setQuery} catalog={catalog} /><main className="detail-page"><a className="back" href="#/"><ArrowLeft /> Back to all apps</a>
    <section className="detail-overview"><div className="detail-primary"><div className="detail-title-line"><AppIcon app={app} large /><div className="detail-heading"><div className="detail-kicker"><span>{app.category}</span><i />{app.developer && <span>{app.developer}</span>}</div><h1 className={titleClass}>{app.name}</h1></div></div><p className="detail-desc">{app.description}</p><div className="detail-links"><span>{app.platform || 'iOS'}</span><span>Updated {app.updated}</span>{app.website_url && <a href={app.website_url} target="_blank" rel="noreferrer">Website <ExternalLink /></a>}{app.app_store_url && <a href={app.app_store_url} target="_blank" rel="noreferrer">App Store <ExternalLink /></a>}<a href="mailto:ilyastorun.dev@gmail.com">Contact <Mail /></a></div></div></section>
    {app.screenshots.length ? <ScreenshotGallery app={app} /> : <div className="detail-empty"><img src="/brand/dot-peek.svg" alt="" /><p>No screenshots have been added yet.</p></div>}
    {firstParagraph && <section className="detail-about"><p className="eyebrow">About the app</p><h2>Why {app.name.split(':')[0]}?</h2><p className="about-lead">{firstParagraph}</p>{remainingDescription && <details><summary>Read more</summary><p>{remainingDescription}</p></details>}</section>}
    {next && <NextDiscovery app={next} />}
  </main><Footer count={catalog.length} /></div>
}

const blankApp = (): AppItem => ({ slug: '', name: '', category: 'Productivity', description: '', long_description: '', developer: '', platform: 'iOS', app_store_url: '', website_url: '', icon: '✦', accent: '#b8f25a', updated: 'just now', screenshots: [], is_dot_pick: false })

function AdminCloud() {
  const [token, setToken] = useState(() => localStorage.getItem('screen-admin-token') || '')
  const [items, setItems] = useState<AppItem[]>([])
  const [editing, setEditing] = useState<AppItem | null>(null)
  const [importUrl, setImportUrl] = useState('')
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const auth = { 'X-Admin-Token': token }

  const load = async () => {
    setLoading(true); setLoadError('')
    try {
      let lastError: unknown
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          if (attempt) await new Promise(resolve => window.setTimeout(resolve, attempt * 750))
          const response = await fetch(`${API_URL}/api/apps`, { cache: 'no-store' })
          if (!response.ok) throw new Error(`API returned ${response.status}.`)
          const rows = await response.json() as Record<string, unknown>[]
          setItems(rows.map(parseApp))
          return
        } catch (cause) {
          lastError = cause
        }
      }
      throw lastError
    } catch {
      setLoadError('The app list could not be reached. Your saved apps are safe; check the connection and retry.')
    }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])

  const openAdd = () => { setEditing(blankApp()); setImportUrl(''); setError(''); setNotice('') }
  const openEdit = (app: AppItem) => { setEditing(app); setImportUrl(app.app_store_url || ''); setError(''); setNotice('') }

  const importApp = async () => {
    if (!importUrl.trim()) { setError('Paste an App Store URL or Apple ID first.'); return }
    setImporting(true); setError(''); setNotice('')
    try {
      let response: Response
      try {
        // Apple's API allows browser CORS requests. Calling it from the admin browser
        // avoids Apple's intermittent blocking of shared Cloudflare Worker IP ranges.
        response = await fetch(appleLookupEndpoint(importUrl))
      } catch {
        response = await fetch(`${API_URL}/api/import/app-store?url=${encodeURIComponent(importUrl.trim())}`)
      }
      const payload = await response.json() as Record<string, unknown> & { error?: string; retry_after?: string }
      if (!response.ok) {
        const retrySeconds = Number(payload.retry_after || response.headers.get('Retry-After'))
        const retryMessage = response.status === 429 && Number.isFinite(retrySeconds) ? ` Try again in ${retrySeconds} seconds.` : ''
        throw new Error(`${payload.error || `Apple API request failed (${response.status}).`}${retryMessage}`)
      }
      const result = 'results' in payload ? parseAppleLookup(payload as Parameters<typeof parseAppleLookup>[0]) : payload
      if (!result) throw new Error('No app found for this App Store URL or Apple ID.')
      const imported = parseApp({ ...blankApp(), ...result, slug: editing?.slug || '', updated: editing?.updated || 'just now', is_dot_pick: editing?.is_dot_pick || false })
      setEditing(imported); setImportUrl(imported.app_store_url || importUrl); setNotice(`Imported ${imported.name}. Review the details, then save.`)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'App Store import failed.') }
    finally { setImporting(false) }
  }

  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (!editing) return
    if (!token) { setError('Enter the Worker admin token above before saving.'); return }
    setSaving(true); setError(''); setNotice('')
    const slug = editing.slug || editing.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    try {
      const response = await fetch(`${API_URL}/api/apps`, { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...editing, slug }) })
      const result = await response.json() as { error?: string }
      if (!response.ok) throw new Error(result.error === 'Unauthorized' ? 'The Worker admin token is incorrect.' : result.error || 'Save failed.')
      setEditing(null); setNotice(`${editing.name} saved.`); await load()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Save failed.') }
    finally { setSaving(false) }
  }

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length || !editing) return
    if (!token) { setError('Enter the Worker admin token before uploading screenshots.'); return }
    setUploading(true); setError('')
    try {
      const urls: string[] = []
      for (const file of files) {
        const form = new FormData(); form.append('file', file)
        const response = await fetch(`${API_URL}/api/assets`, { method: 'POST', headers: auth, body: form })
        const result = await response.json() as { error?: string; url?: string }
        if (!response.ok || !result.url) throw new Error(result.error || `Upload failed for ${file.name}.`)
        urls.push(`${API_URL}${result.url}`)
      }
      setEditing(current => current ? { ...current, screenshots: [...current.screenshots, ...urls] } : current)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Upload failed.') }
    finally { setUploading(false); event.target.value = '' }
  }

  const remove = async (app: AppItem) => {
    if (!token) { setError('Enter the Worker admin token before deleting an app.'); return }
    if (!window.confirm(`Delete ${app.name}? This cannot be undone.`)) return
    const response = await fetch(`${API_URL}/api/apps/${encodeURIComponent(app.slug)}`, { method: 'DELETE', headers: auth })
    if (!response.ok) { setError(response.status === 401 ? 'The Worker admin token is incorrect.' : 'Delete failed.'); return }
    setNotice(`${app.name} deleted.`); await load()
  }

  return <div className="admin-shell"><aside className="admin-sidebar"><a className="brand" href="https://niceapps.club">niceapps<span>.</span>club</a><p className="eyebrow">Cloudflare admin</p><a className="admin-nav active" href="#/admin">Apps <span>{items.length}</span></a><a className="admin-nav" href="https://github.com/ilyastorunn/screen.studio/issues" target="_blank" rel="noreferrer">Community requests</a><a className="admin-nav" href="https://niceapps.club" target="_blank" rel="noreferrer">View public site ↗</a></aside>
    <main className="admin-main"><div className="admin-top"><div><p className="eyebrow">D1 + R2 content manager</p><h1>Apps</h1></div><button className="primary-button" onClick={openAdd}><Plus /> Add app</button></div>
      <label className="token-field">Worker admin token<input type="password" value={token} onChange={event => { setToken(event.target.value); localStorage.setItem('screen-admin-token', event.target.value) }} placeholder="Required for save, delete and upload" /><small>Stored only in this browser.</small></label>
      {!editing && error && <p className="form-message error" role="alert">{error}</p>}{!editing && loadError && <div className="form-message error" role="alert">{loadError} <button type="button" onClick={() => void load()}>Retry</button></div>}{!editing && notice && <p className="form-message success" role="status">{notice}</p>}
      <div className="admin-table"><div className="admin-table-head"><span>App</span><span>Category</span><span>Updated</span><span></span></div>{loading ? <div className="empty">Loading apps…</div> : items.length ? items.map(app => <div className="admin-row" key={app.slug}><div className="admin-app"><AppIcon app={app} /><div><strong>{app.name}</strong><small>/{app.slug}</small></div></div><span>{app.category}</span><span>{app.updated}</span><div className="row-actions"><button onClick={() => openEdit(app)}>Edit</button><button aria-label={`Delete ${app.name}`} onClick={() => void remove(app)}><Trash2 /></button></div></div>) : loadError ? <div className="empty">Unable to display the app list right now. Nothing was deleted.</div> : <div className="empty">No apps yet. Import the first one from the App Store.</div>}</div>
      {editing && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setEditing(null) }}><form className="admin-form" onSubmit={save}><div className="form-head"><div><p className="eyebrow">{editing.slug ? 'Edit app' : 'New app'}</p><h2>{editing.slug ? 'Update details' : 'Add to collection'}</h2></div><button type="button" className="close-button" onClick={() => setEditing(null)} aria-label="Close">×</button></div>
        <section className="import-panel"><label>App Store URL or Apple ID<div className="import-controls"><input value={importUrl} onChange={event => setImportUrl(event.target.value)} placeholder="https://apps.apple.com/…" /><button className="primary-button" type="button" disabled={importing} onClick={() => void importApp()}>{importing ? 'Importing…' : 'Import app'}</button></div></label><small>Imports the name, descriptions, category, developer, icon and screenshots.</small></section>
        {error && <p className="form-message error" role="alert">{error}</p>}{notice && <p className="form-message success" role="status">{notice}</p>}
        <div className="form-grid"><label>Name<input required value={editing.name} onChange={event => setEditing({ ...editing, name: event.target.value })} /></label><label>Category<input required value={editing.category} onChange={event => setEditing({ ...editing, category: event.target.value })} /></label></div>
        <label>Short description<textarea required rows={3} value={editing.description} onChange={event => setEditing({ ...editing, description: event.target.value })} /></label><label>Long description<textarea rows={7} value={editing.long_description || ''} onChange={event => setEditing({ ...editing, long_description: event.target.value })} /></label>
        <div className="form-grid"><label>Developer<input value={editing.developer || ''} onChange={event => setEditing({ ...editing, developer: event.target.value })} /></label><label>Platform<input value={editing.platform || 'iOS'} onChange={event => setEditing({ ...editing, platform: event.target.value })} /></label></div>
        <label>Website URL<input type="url" value={editing.website_url || ''} onChange={event => setEditing({ ...editing, website_url: event.target.value })} /></label><label>Icon URL or emoji<input value={editing.icon} onChange={event => setEditing({ ...editing, icon: event.target.value })} /></label>
        <label className="dot-pick-toggle"><input type="checkbox" checked={Boolean(editing.is_dot_pick)} onChange={event => setEditing({ ...editing, is_dot_pick: event.target.checked })} /><span><strong>Set as Poppy’s Pick</strong><small>Only one app can be featured at a time.</small></span></label>
        <div className="icon-preview"><AppIcon app={editing} large /><span>{isImage(editing.icon) ? 'Imported icon preview' : 'Emoji icon preview'}</span></div>
        <label className="upload-control">Add screenshots<input type="file" multiple accept="image/*" disabled={uploading} onChange={upload} /><span><Upload /> {uploading ? 'Uploading to R2…' : 'Choose images'}</span></label>
        <div className="upload-list">{editing.screenshots.map((shot, index) => <div className="upload-item" key={`${shot}-${index}`}><img src={shot} alt={`Screenshot ${index + 1}`} /><button type="button" onClick={() => setEditing(current => current ? { ...current, screenshots: current.screenshots.filter((_, itemIndex) => itemIndex !== index) } : current)}>Remove</button></div>)}</div>
        <div className="form-actions"><button type="button" onClick={() => setEditing(null)}>Cancel</button><button className="primary-button" disabled={saving || importing || uploading} type="submit">{saving ? 'Saving…' : 'Save app'}</button></div>
      </form></div>}
    </main>
  </div>
}

function App() {
  const [catalog, setCatalog] = useState<AppItem[]>(fallbackApps)
  const [loading, setLoading] = useState(true)
  const [path, setPath] = useState(() => location.hash)
  const [query, setQuery] = useState('')
  useEffect(() => { const onHashChange = () => setPath(location.hash); window.addEventListener('hashchange', onHashChange); return () => window.removeEventListener('hashchange', onHashChange) }, [])
  useEffect(() => {
    if (path.startsWith('#/apps/') || path === '#/' || path === '') window.scrollTo({ top: 0, behavior: 'auto' })
  }, [path])
  useEffect(() => {
    fetch(`${API_URL}/api/apps`).then(response => { if (!response.ok) throw new Error(); return response.json() }).then((rows: Record<string, unknown>[]) => { if (rows.length) setCatalog(rows.map(parseApp)) }).catch(() => undefined).finally(() => setLoading(false))
  }, [])
  const slug = path.split('/')[2]
  const selected = catalog.find(app => app.slug === slug)
  const isAdminHost = location.hostname === 'admin-screen-studio.devanta.net'
  return isAdminHost || path === '#/admin' ? <AdminCloud /> : selected ? <Detail app={selected} catalog={catalog} query={query} setQuery={setQuery} /> : <Home catalog={catalog} loading={loading} query={query} setQuery={setQuery} />
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
