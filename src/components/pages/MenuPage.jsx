import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { list } from '../../lib/db.js'

export default function MenuPage() {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([list('categories'), list('menuItems')])
      .then(([cats, menuItems]) => {
        setCategories(cats)
        setItems(menuItems)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory
      ? item.categoryId === activeCategory
      : true
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch = q
      ? item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      : true
    return matchesCategory && matchesSearch
  })

  // Build a map from categoryId → category name for quick lookup
  const catMap = {}
  categories.forEach((c) => {
    catMap[c.id] = c.name
  })

  if (loading) {
    return (
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-text-muted">Loading our menu…</p>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="flex-1">
      {/* Page header */}
      <section className="relative overflow-hidden bg-surface-alt py-20 md:py-28">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div
            className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary blur-3xl"
          />
          <div
            className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary blur-3xl"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-text">
            Our Menu
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-text-muted leading-relaxed">
            A carefully crafted selection of rustic Italian dishes, made with
            love and the finest seasonal ingredients.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 md:top-20 z-30 bg-bg/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search */}
          <div className="relative mb-4">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes…"
              className="w-full rounded-xl border border-border bg-surface pl-12 pr-4 py-3 text-text placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
            />
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                activeCategory === null
                  ? 'bg-primary text-white shadow-md shadow-primary/30'
                  : 'bg-surface text-text-muted hover:bg-surface-alt hover:text-text border border-border'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'bg-surface text-text-muted hover:bg-surface-alt hover:text-text border border-border'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[30vh] text-center">
            <svg
              className="h-16 w-16 text-text-muted/30 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <p className="text-xl font-serif text-text-muted">
              No dishes found
            </p>
            <p className="mt-1 text-sm text-text-muted/70">
              Try adjusting your search or filter.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-text-muted mb-6">
              Showing{' '}
              <span className="font-semibold text-text">
                {filteredItems.length}
              </span>{' '}
              {filteredItems.length === 1 ? 'dish' : 'dishes'}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/item/${item.id}`}
                  className="group bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-border/50 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-surface-alt">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      width={item.imageWidth || 600}
                      height={item.imageHeight || 400}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-xl text-text group-hover:text-primary transition-colors duration-200">
                        {item.name}
                      </h3>
                      <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                        ${item.price}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-text-muted line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    {catMap[item.categoryId] && (
                      <span className="inline-block mt-3 text-xs font-medium text-secondary uppercase tracking-wider">
                        {catMap[item.categoryId]}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  )
}
