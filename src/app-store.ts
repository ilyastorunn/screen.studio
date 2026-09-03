export type AppStoreImport = {
  name: string
  category: string
  description: string
  long_description: string
  developer: string
  platform: 'iOS'
  app_store_url: string
  icon: string
  accent: string
  screenshots: string[]
  apple_id: number
  website_url: string
}

type AppleLookupResult = {
  trackName?: string
  primaryGenreName?: string
  description?: string
  artistName?: string
  trackViewUrl?: string
  artworkUrl512?: string
  artworkUrl100?: string
  screenshotUrls?: string[]
  ipadScreenshotUrls?: string[]
  trackId?: number
  sellerUrl?: string
}

type AppleLookupPayload = {
  results?: AppleLookupResult[]
}

export function appleAppId(input: string) {
  return input.match(/(?:id|\/id)(\d{5,})/i)?.[1] || input.match(/^\d{5,}$/)?.[0] || ''
}

export function appleLookupEndpoint(input: string) {
  const normalized = input.trim()
  const id = appleAppId(normalized)
  return id
    ? `https://itunes.apple.com/lookup?id=${id}&country=us`
    : `https://itunes.apple.com/search?term=${encodeURIComponent(normalized)}&entity=software&country=us&limit=1`
}

export function parseAppleLookup(payload: AppleLookupPayload): AppStoreImport | null {
  const result = payload.results?.[0]
  if (!result) return null

  const rawScreenshots = result.screenshotUrls?.length ? result.screenshotUrls : (result.ipadScreenshotUrls || [])
  const screenshots = rawScreenshots
    .filter(Boolean)
    .map(imageUrl => imageUrl.replace(/^http:/, 'https:').replace(/\/\d+x\d+bb\./, '/640x960bb.'))
  const fullDescription = String(result.description || '').trim()
  const firstParagraph = fullDescription.split(/\n\s*\n/)[0] || fullDescription
  const description = firstParagraph.length > 280 ? `${firstParagraph.slice(0, 277).trimEnd()}…` : firstParagraph

  return {
    name: result.trackName || '',
    category: result.primaryGenreName || 'Productivity',
    description,
    long_description: fullDescription,
    developer: result.artistName || '',
    platform: 'iOS',
    app_store_url: result.trackViewUrl || '',
    icon: result.artworkUrl512 || result.artworkUrl100 || '✦',
    accent: '#b8f25a',
    screenshots,
    apple_id: result.trackId || 0,
    website_url: result.sellerUrl || '',
  }
}

