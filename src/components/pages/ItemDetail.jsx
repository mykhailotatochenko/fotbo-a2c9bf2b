import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { get, list } from '../../lib/db.js'

export default function ItemDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [categoryName, setCategoryName] = useState('')
  const [relatedItems, setRelatedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetchItem() {
      try {
        setLoading(true)
        setError(null)
        const data = await get('menuItems', id)
        if (cancelled) return
        setItem(data)

        // Fetch category name
        if (data.categoryId) {
          const categories = await list('categories')
          if (!cancelled) {
            const cat = categories.find((c) => c.id === data.categoryId)
            setCategoryName(cat ? cat.name : '')

            // Fetch related items (same category, excluding current)
            const allItems = await list('menuItems')
            const related = allItems
              .filter((i) => i.categoryId === data.categoryId && i.id !== data.id)
              .slice(0, 4)
            setRelatedItems(related)
          }
        }
      } catch (err) {
        if (!cancelled) setError('Unable to load this menu item. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchItem()
    return () => { cancelled = true }
  }, [id])

  // Loading skeleton
  if (loading) {
    return (
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 animate-pulse">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] bg-surface-alt rounded-2xl" />
            <div className="space-y-5">
              <div className="h-3 w-24 bg-surface-alt rounded-full" />
              <div className="h-10 w-3/4 bg-surface-alt rounded-lg" />
              <div className="h-6 w-20 bg-surface-alt rounded-lg" />
              <div className="h-4 w-full bg-surface-alt rounded" />
              <div className="h-4 w-5/6 bg-surface-alt rounded" />
              <div className="h-4 w-2/3 bg-surface-alt rounded" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Error state
  if (error || !item) {
    return (
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto rounded-full bg-surface-alt flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="font-serif text-3xl text-text mb-3">Item Not Found</h2>
            <p className="text-text-muted mb-8">{error || 'We couldn\'t find the menu item you\'re looking for.'}</p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:brightness-110 active:scale-[.98] transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Menu
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="flex-1">
      {/* Hero section with image and intro */}
      <section className="relative bg-surface-alt overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #c65d47 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="relative group">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-surface">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    width={item.imageWidth || 800}
                    height={item.imageHeight || 600}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    style={{ backgroundColor: '#f5ede4' }}
                    loading="lazy"
                  />
                </div>
                {/* Decorative accent */}
                <div className="absolute -bottom-3 -right-3 w-24 h-24 rounded-full bg-accent/10 -z-10" />
                <div className="absolute -top-3 -left-3 w-16 h-16 rounded-full bg-primary/10 -z-10" />
              </div>
            </div>

            {/* Item info */}
            <div className="order-1 lg:order-2">
              {/* Category badge */}
              {categoryName && (
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary hover:bg-secondary/20 transition-colors duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  {categoryName}
                </Link>
              )}

              <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl text-text leading-tight">
                {item.name}
              </h1>

              {/* Price */}
              <div className="mt-6 flex items-center gap-4">
                <span className="font-serif text-3xl md:text-4xl text-primary font-bold">
                  ${item.price}
                </span>
                <span className="text-sm text-text-muted font-sans">per serving</span>
              </div>

              <p className="mt-6 text-base md:text-lg text-text-muted font-sans leading-relaxed">
                {item.description}
              </p>

              {/* Tags / meta */}
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-lg bg-surface px-4 py-2 text-sm font-sans text-text border border-border shadow-sm">
                  🍽️ Main Course
                </span>
                <span className="rounded-lg bg-surface px-4 py-2 text-sm font-sans text-text border border-border shadow-sm">
                  🥗 Fresh Ingredients
                </span>
                <span className="rounded-lg bg-surface px-4 py-2 text-sm font-sans text-text border border-border shadow-sm">
                  👨‍🍳 Chef's Special
                </span>
              </div>

              {/* Action buttons */}
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-white hover:brightness-110 active:scale-[.98] transition-all duration-200 shadow-md shadow-primary/20"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Menu
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-6 py-3.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white active:scale-[.98] transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Make a Reservation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl text-text text-center">About This Dish</h2>
          <div className="mt-10 grid sm:grid-cols-2 gap-6">
            {/* Card 1: Ingredients */}
            <div className="rounded-2xl bg-surface p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-text mb-2">Premium Ingredients</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Sourced directly from small Italian producers — San Marzano tomatoes, 
                aged Parmigiano-Reggiano, and cold-pressed extra virgin olive oil.
              </p>
            </div>

            {/* Card 2: Preparation */}
            <div className="rounded-2xl bg-surface p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-text mb-2">Traditional Recipe</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Prepared using time-honored techniques passed down through generations. 
                Every step, from hand-rolling pasta to slow-simmering sauces, honors authenticity.
              </p>
            </div>

            {/* Card 3: Dietary */}
            <div className="rounded-2xl bg-surface p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-text mb-2">Quality Guarantee</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Every dish is crafted to order with the freshest seasonal ingredients. 
                We never compromise on quality — if it's not perfect, we remake it.
              </p>
            </div>

            {/* Card 4: Pairing */}
            <div className="rounded-2xl bg-surface p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-text mb-2">Wine Pairing</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Our sommelier recommends the perfect Italian wine pairing for this dish. 
                Ask your server for our curated pairing suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related items section */}
      {relatedItems.length > 0 && (
        <section className="bg-surface-alt">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl text-text">More from {categoryName}</h2>
              <p className="mt-3 text-text-muted">Explore other dishes in this category</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedItems.map((related) => (
                <Link
                  key={related.id}
                  to={`/item/${related.id}`}
                  className="group bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-surface-alt">
                    <img
                      src={related.imageUrl}
                      alt={related.name}
                      width={related.imageWidth || 400}
                      height={related.imageHeight || 300}
                      loading="lazy"
                      style={{ backgroundColor: '#f5ede4' }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg text-text group-hover:text-primary transition-colors duration-200">
                      {related.name}
                    </h3>
                    <p className="mt-1 font-sans font-semibold text-primary">
                      ${related.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
