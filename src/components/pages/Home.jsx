import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* ─── Scroll reveal hook (inline – no shared deps) ─── */
function useScrollReveal(ref) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])
  return visible
}

function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const visible = useScrollReveal(ref)
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ─── Category card data ─── */
const categories = [
  {
    name: 'Pasta',
    desc: 'House-made tagliatelle, silky carbonara, and hearty ragù',
    image:
      'https://images.rawpixel.com/editor_1024/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvYTAxOS1qYWt1YmstMDc1MC1tYWtpbmctZnJlc2gtaG9tZW1hZGUtcGFzdGEuanBn.jpg',
    imgWidth: 6000,
    imgHeight: 4000,
  },
  {
    name: 'Pizza',
    desc: 'Wood-fired Neapolitan with San Marzano tomatoes and fior di latte',
    image:
      'https://live.staticflickr.com/65535/55252067993_53dabc563c_b.jpg',
    imgWidth: 1024,
    imgHeight: 768,
  },
  {
    name: 'Dolci',
    desc: 'Tiramisù, panna cotta, and other classic Italian sweets',
    image:
      'https://pd.w.org/2022/09/514632a8d03222554.67030706-2048x1536.jpg',
    imgWidth: 2048,
    imgHeight: 1536,
  },
  {
    name: 'Vini',
    desc: 'Curated Italian wines from Barolo to Prosecco',
    image:
      'https://live.staticflickr.com/8543/8647725243_248fc89d30_b.jpg',
    imgWidth: 1024,
    imgHeight: 678,
  },
]

/* ─── Hero Section ─── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.rawpixel.com/editor_1024/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcHgxMTA0MjczLWltYWdlLWt3eXI2aDNwLWt3eXQ5djh5LmpwZw.jpg"
          alt="Italian antipasti spread on a rustic table"
          width={4052}
          height={2504}
          className="w-full h-full object-cover"
          style={{ backgroundColor: '#8B6C4A' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Decorative top-left accent */}
      <div className="absolute top-20 left-8 md:left-16 w-32 h-32 border-t-2 border-l-2 border-accent/40 rounded-tl-3xl" />

      {/* Decorative bottom-right accent */}
      <div className="absolute bottom-20 right-8 md:right-16 w-32 h-32 border-b-2 border-r-2 border-accent/40 rounded-br-3xl" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <FadeUp>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-tight tracking-tight">
            Trattoria
            <span className="block text-accent">Bella</span>
          </h1>
        </FadeUp>

        <FadeUp delay={200}>
          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-white/80 font-sans max-w-2xl mx-auto leading-relaxed">
            Authentic Italian cuisine crafted with passion and tradition — 
            where every dish tells a story of family, heritage, and the finest ingredients.
          </p>
        </FadeUp>

        <FadeUp delay={400}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/menu"
              className="inline-flex items-center rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-text shadow-lg hover:brightness-110 active:scale-[.98] transition-all duration-200"
            >
              View Our Menu
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center rounded-lg border-2 border-white/40 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 active:scale-[.98] transition-all duration-200"
            >
              Make a Reservation
            </Link>
          </div>
        </FadeUp>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50">
        <span className="text-xs font-sans tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-accent/60 rounded-full mt-1.5 animate-bounce" />
        </div>
      </div>
    </section>
  )
}

/* ─── About Section ─── */
function About() {
  const imgRef = useRef(null)
  const imgVisible = useScrollReveal(imgRef)
  const textRef = useRef(null)
  const textVisible = useScrollReveal(textRef)

  return (
    <section className="py-20 md:py-28 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Image */}
          <div
            ref={imgRef}
            className={`relative transition-all duration-700 ease-out ${
              imgVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://live.staticflickr.com/2861/10281830755_1eb8f48a9c_b.jpg"
                alt="Trattoria Bella cozy interior"
                width={1024}
                height={679}
                className="w-full h-full object-cover"
                style={{ backgroundColor: '#D4C5B0' }}
                loading="lazy"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-primary/30 rounded-bl-2xl hidden md:block" />
            <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-primary/30 rounded-tr-2xl hidden md:block" />
          </div>

          {/* Text */}
          <div
            ref={textRef}
            className={`transition-all duration-700 ease-out ${
              textVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <span className="text-sm font-sans font-semibold uppercase tracking-widest text-primary">
              Our Story
            </span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl text-text leading-tight">
              Where Tradition{' '}
              <span className="text-primary">Meets Passion</span>
            </h2>

            <div className="mt-2 w-16 h-0.5 bg-accent" />

            <p className="mt-6 text-lg text-text-muted font-sans leading-relaxed">
              Trattoria Bella was born from a simple dream — to share the authentic 
              flavors of Italy with every guest who walks through our doors. Our recipes 
              have been passed down through three generations, from the sun-drenched 
              hills of Tuscany to the heart of our kitchen.
            </p>
            <p className="mt-4 text-lg text-text-muted font-sans leading-relaxed">
              Every morning, our chefs hand-roll pasta, simmer slow-cooked ragùs, 
              and prepare the freshest antipasti using ingredients imported directly 
              from small Italian farms. We believe that great food is made with 
              love, patience, and the finest seasonal produce.
            </p>
            <p className="mt-4 text-lg text-text-muted font-sans leading-relaxed">
              Whether you are celebrating a special occasion or enjoying a quiet 
              dinner with loved ones, we invite you to experience the warmth of 
              Italian hospitality.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-surface-alt border-2 border-bg flex items-center justify-center text-xs font-sans font-semibold text-text-muted"
                  >
                    <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-sans font-semibold text-text">4.8 / 5.0</p>
                <p className="text-xs font-sans text-text-muted">from 200+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Featured Categories Section ─── */
function FeaturedCategories() {
  const ref = useRef(null)
  const visible = useScrollReveal(ref)

  return (
    <section className="py-20 md:py-28 bg-surface-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-sans font-semibold uppercase tracking-widest text-primary">
            Our Specialties
          </span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl text-text leading-tight">
            Explore Our{' '}
            <span className="text-primary">Menu</span>
          </h2>
          <div className="mt-2 mx-auto w-16 h-0.5 bg-accent" />
        </div>

        <div
          ref={ref}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {categories.map((cat, i) => (
            <div
              key={cat.name}
              className={`group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-500 ease-out ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                width={cat.imgWidth}
                height={cat.imgHeight}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-serif text-2xl md:text-3xl text-white">{cat.name}</h3>
                <p className="mt-1.5 text-sm text-white/80 font-sans">{cat.desc}</p>
              </div>

              {/* Hover shine */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-500" />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/menu"
            className="inline-flex items-center rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-md hover:brightness-110 active:scale-[.98] transition-all duration-200"
          >
            See Full Menu
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonial Section ─── */
function Testimonials() {
  const ref = useRef(null)
  const visible = useScrollReveal(ref)

  const testimonials = [
    {
      quote: 'The best carbonara I have had outside of Rome. Truly authentic and made with love.',
      author: 'Maria G.',
    },
    {
      quote: 'An absolute gem. The atmosphere, the wine list, the tiramisù — perfection.',
      author: 'James K.',
    },
    {
      quote: 'We celebrated our anniversary here and it was unforgettable. Grazie mille!',
      author: 'Sophia & Matteo R.',
    },
  ]

  return (
    <section className="py-20 md:py-28 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-sans font-semibold uppercase tracking-widest text-primary">
            Guest Love
          </span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl text-text leading-tight">
            What Our{' '}
            <span className="text-primary">Guests Say</span>
          </h2>
          <div className="mt-2 mx-auto w-16 h-0.5 bg-accent" />
        </div>

        <div
          ref={ref}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`bg-surface rounded-2xl p-8 shadow-sm border border-border/50 transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Quote icon */}
              <svg className="w-8 h-8 text-primary/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
              </svg>
              <p className="text-lg text-text font-sans leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-4 text-sm font-sans font-semibold text-text-muted">
                — {t.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Reservation CTA Section ─── */
function ReservationCTA() {
  return (
    <section className="py-20 md:py-28 bg-text relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 border-2 border-accent rounded-full" />
        <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-accent rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-accent rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-accent rounded-full" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-white leading-tight">
          Ready for an{' '}
          <span className="text-accent">Unforgettable Meal?</span>
        </h2>
        <p className="mt-4 text-lg text-white/70 font-sans max-w-xl mx-auto">
          Reserve your table today and experience the authentic taste of Italy.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-text shadow-lg hover:brightness-110 active:scale-[.98] transition-all duration-200"
          >
            Make a Reservation
          </Link>
          <Link
            to="/menu"
            className="inline-flex items-center rounded-lg border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 active:scale-[.98] transition-all duration-200"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Home Page ─── */
export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <FeaturedCategories />
      <Testimonials />
      <ReservationCTA />
    </main>
  )
}
