export type CatalogItem = {
  slug: string
  name: string
  category: string
  is_dot_pick?: boolean
}

export function filterCatalog<T extends CatalogItem>(catalog: T[], query: string, category: string) {
  const needle = query.trim().toLowerCase()
  return catalog.filter(item =>
    (category === 'All' || item.category === category) &&
    (!needle || [item.name, item.category].some(value => value.toLowerCase().includes(needle)))
  )
}

export function selectDotPick<T extends CatalogItem>(catalog: T[]) {
  return catalog.find(item => item.is_dot_pick) || catalog[0]
}

export function nextDiscovery<T extends CatalogItem>(catalog: T[], currentSlug: string) {
  if (catalog.length < 2) return undefined
  const currentIndex = catalog.findIndex(item => item.slug === currentSlug)
  return catalog[(currentIndex < 0 ? 0 : currentIndex + 1) % catalog.length]
}
