import { defineSitemapEventHandler } from '#imports'
import { getAllProviderGames } from '~/server/utils/providers'

export default defineSitemapEventHandler(async () => {
  const games = await getAllProviderGames()

  // Static pages
  const staticPages = [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/privacy', changefreq: 'monthly', priority: 0.3 },
    { loc: '/terms', changefreq: 'monthly', priority: 0.3 },
    { loc: '/cookies', changefreq: 'monthly', priority: 0.3 },
    { loc: '/contact', changefreq: 'monthly', priority: 0.4 },
    { loc: '/developers', changefreq: 'monthly', priority: 0.5 },
  ]

  // Game pages
  const gamePages = games.slice(0, 500).map((game) => ({
    loc: `/game/${game.slug}`,
    changefreq: 'weekly' as const,
    priority: 0.7,
  }))

  // Category pages - extract unique categories
  const categories = new Set<string>()
  games.forEach((game) => {
    if (game.category) {
      categories.add(game.category.toLowerCase().replace(/\s+/g, '-'))
    }
    game.categories?.forEach((cat) => {
      categories.add(cat.toLowerCase().replace(/\s+/g, '-'))
    })
  })

  const categoryPages = Array.from(categories).slice(0, 30).map((cat) => ({
    loc: `/category/${cat}`,
    changefreq: 'daily' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...categoryPages, ...gamePages]
})
