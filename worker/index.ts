export interface Env { DB: D1Database; ASSETS?: R2Bucket; ADMIN_EMAIL?: string; ADMIN_API_KEY?: string }

export const APP_STORE_STOREFRONT = 'us'

const json = (data: unknown, init: ResponseInit = {}) => Response.json(data, { ...init, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', ...(init.headers || {}) } })

export const appleFailureResponse = (apple: Response) => {
  const retryAfter = apple.headers.get('Retry-After')
  if (apple.status === 429) {
    return json({ error: 'Apple API rate limit exceeded. Please wait and try again.', ...(retryAfter ? { retry_after: retryAfter } : {}) }, { status: 429, headers: retryAfter ? { 'Retry-After': retryAfter } : {} })
  }
  return json({ error: `Apple API request failed (Apple returned ${apple.status}).`, upstream_status: apple.status }, { status: 502 })
}

export default { async fetch(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS' } })
  const url = new URL(request.url); if (!url.pathname.startsWith('/api/')) return new Response('niceapps.club API')
  if (url.pathname === '/api/import/app-store' && request.method === 'GET') {
    const input = url.searchParams.get('url') || ''
    if (!input.trim()) return json({ error: 'App Store URL or Apple ID is required' }, { status: 400 })
    const id = input.match(/(?:id|\/id)(\d{5,})/i)?.[1] || input.match(/^\d{5,}$/)?.[0]
    const endpoint = id ? `https://itunes.apple.com/lookup?id=${id}&country=${APP_STORE_STOREFRONT}` : `https://itunes.apple.com/search?term=${encodeURIComponent(input)}&entity=software&country=${APP_STORE_STOREFRONT}&limit=1`
    let apple: Response
    try {
      apple = await fetch(endpoint, { headers: { Accept: 'application/json' }, cf: { cacheTtl: 3600, cacheEverything: true } })
    } catch {
      return json({ error: 'Could not reach Apple API. Please try again.' }, { status: 502 })
    }
    if (!apple.ok) return appleFailureResponse(apple)
    const payload = await apple.json<any>(); const result = payload.results?.[0]
    if (!result) return json({ error: 'No app found' }, { status: 404 })
    const rawScreenshots = result.screenshotUrls?.length ? result.screenshotUrls : (result.ipadScreenshotUrls || [])
    const screenshots = rawScreenshots.filter(Boolean).map((imageUrl: string) => imageUrl.replace(/^http:/, 'https:').replace(/\/\d+x\d+bb\./, '/640x960bb.'))
    const fullDescription = String(result.description || '').trim()
    const firstParagraph = fullDescription.split(/\n\s*\n/)[0] || fullDescription
    const shortDescription = firstParagraph.length > 280 ? `${firstParagraph.slice(0, 277).trimEnd()}…` : firstParagraph
    return json({ name: result.trackName, category: result.primaryGenreName || 'Productivity', description: shortDescription, long_description: fullDescription, developer: result.artistName || '', platform: 'iOS', app_store_url: result.trackViewUrl || '', icon: result.artworkUrl512 || result.artworkUrl100 || '✦', accent: '#b8f25a', screenshots, apple_id: result.trackId, website_url: result.sellerUrl || '' })
  }
  const assetMatch = url.pathname.match(/^\/api\/assets\/(.+)$/)
  if (assetMatch && request.method === 'GET' && env.ASSETS) { const object = await env.ASSETS.get(assetMatch[1]); if (!object) return new Response('Not found', { status: 404 }); const headers = new Headers(); object.writeHttpMetadata(headers); headers.set('etag', object.httpEtag); headers.set('Cache-Control', 'public, max-age=31536000, immutable'); headers.set('Access-Control-Allow-Origin', '*'); return new Response(object.body, { headers }) }
  const isWrite = request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE'
  if (isWrite && (!env.ADMIN_API_KEY || request.headers.get('X-Admin-Token') !== env.ADMIN_API_KEY)) return json({ error: 'Unauthorized' }, { status: 401 })
  if (url.pathname === '/api/assets' && request.method === 'POST' && env.ASSETS) { const form = await request.formData(); const file = form.get('file'); if (!(file instanceof File)) return json({ error: 'file is required' }, { status: 400 }); const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-'); const key = `uploads/${crypto.randomUUID()}-${safeName}`; await env.ASSETS.put(key, file.stream(), { httpMetadata: { contentType: file.type || 'application/octet-stream' } }); return json({ key, url: `/api/assets/${key}` }, { status: 201 }) }
  if (url.pathname === '/api/apps' && request.method === 'GET') { const { results } = await env.DB.prepare('SELECT * FROM apps ORDER BY created_at DESC').all(); return json(results) }
  if (url.pathname === '/api/apps' && request.method === 'POST') {
    const body = await request.json<any>()
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const isDotPick = body.is_dot_pick ? 1 : 0
    const write = env.DB.prepare('INSERT INTO apps (slug,name,category,description,icon,accent,long_description,app_store_url,developer,website_url,platform,screenshots,is_dot_pick) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(slug) DO UPDATE SET name=excluded.name,category=excluded.category,description=excluded.description,icon=excluded.icon,accent=excluded.accent,long_description=excluded.long_description,app_store_url=excluded.app_store_url,developer=excluded.developer,website_url=excluded.website_url,platform=excluded.platform,screenshots=excluded.screenshots,is_dot_pick=excluded.is_dot_pick,updated_at=CURRENT_TIMESTAMP').bind(slug,body.name,body.category,body.description || '',body.icon || '✦',body.accent || '#b8f25a',body.long_description || '',body.app_store_url || '',body.developer || '',body.website_url || '',body.platform || 'iOS',JSON.stringify(body.screenshots || []),isDotPick)
    if (isDotPick) await env.DB.batch([env.DB.prepare('UPDATE apps SET is_dot_pick=0 WHERE slug<>?').bind(slug), write])
    else await write.run()
    return json({ slug }, { status: 201 })
  }
  const match = url.pathname.match(/^\/api\/apps\/([^/]+)$/)
  if (match && request.method === 'PUT') {
    const body = await request.json<any>()
    const isDotPick = body.is_dot_pick ? 1 : 0
    const write = env.DB.prepare('UPDATE apps SET name=?,category=?,description=?,icon=?,accent=?,long_description=?,app_store_url=?,developer=?,website_url=?,platform=?,screenshots=?,is_dot_pick=?,updated_at=CURRENT_TIMESTAMP WHERE slug=?').bind(body.name,body.category,body.description || '',body.icon || '✦',body.accent || '#b8f25a',body.long_description || '',body.app_store_url || '',body.developer || '',body.website_url || '',body.platform || 'iOS',JSON.stringify(body.screenshots || []),isDotPick,match[1])
    if (isDotPick) await env.DB.batch([env.DB.prepare('UPDATE apps SET is_dot_pick=0 WHERE slug<>?').bind(match[1]), write])
    else await write.run()
    return json({ ok: true })
  }
  if (match && request.method === 'DELETE') { await env.DB.prepare('DELETE FROM apps WHERE slug=?').bind(match[1]).run(); return json({ ok: true }) }
  return json({ error: 'Not found' }, { status: 404 })
} }
