import { useState } from 'react'
import { create } from '../../lib/db.js'

/* ─── SVG Icons (inline to avoid deps) ─── */
function MapPinIcon() {
  return (
    <svg className="w-6 h-6 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className="w-6 h-6 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  )
}

function EnvelopeIcon() {
  return (
    <svg className="w-6 h-6 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="w-6 h-6 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

/* ─── Contact info data ─── */
const contactInfo = [
  {
    icon: <MapPinIcon />,
    label: 'Address',
    value: '42 Via Roma Street, Brisbane QLD 4000',
  },
  {
    icon: <PhoneIcon />,
    label: 'Phone',
    value: '(07) 3123 4567',
    href: 'tel:+61731234567',
  },
  {
    icon: <EnvelopeIcon />,
    label: 'Email',
    value: 'hello@trattoriabella.com.au',
    href: 'mailto:hello@trattoriabella.com.au',
  },
]

const hours = [
  { day: 'Monday – Thursday', time: '11:30 AM – 10:00 PM' },
  { day: 'Friday – Saturday', time: '11:30 AM – 11:00 PM' },
  { day: 'Sunday', time: '12:00 PM – 9:00 PM' },
]

/* ─── Contact Form ─── */
function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | success | error

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Please enter a valid email'
    if (!form.message.trim()) errs.message = 'Message is required'
    else if (form.message.trim().length < 10)
      errs.message = 'Message must be at least 10 characters'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setStatus('idle')
    try {
      await create('contacts', { ...form, createdAt: new Date().toISOString() })
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-sans font-semibold text-text mb-1.5">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          className={`w-full rounded-xl border bg-surface px-4 py-3 text-text font-sans placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
            errors.name ? 'border-red-400' : 'border-border'
          }`}
          placeholder="Your name"
        />
        {errors.name && (
          <p className="mt-1 text-sm font-sans text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-sans font-semibold text-text mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className={`w-full rounded-xl border bg-surface px-4 py-3 text-text font-sans placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
            errors.email ? 'border-red-400' : 'border-border'
          }`}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm font-sans text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-sans font-semibold text-text mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          className={`w-full rounded-xl border bg-surface px-4 py-3 text-text font-sans placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none ${
            errors.message ? 'border-red-400' : 'border-border'
          }`}
          placeholder="Tell us how we can help…"
        />
        {errors.message && (
          <p className="mt-1 text-sm font-sans text-red-500">{errors.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-md hover:brightness-110 active:scale-[.98] transition-all duration-200"
      >
        Send Message
      </button>

      {/* Status messages */}
      {status === 'success' && (
        <div className="rounded-xl bg-secondary/10 border border-secondary/30 px-4 py-3 text-sm font-sans text-secondary font-semibold text-center">
          Thank you! Your message has been sent. We will get back to you soon.
        </div>
      )}
      {status === 'error' && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-sans text-red-600 font-semibold text-center">
          Something went wrong. Please try again later.
        </div>
      )}
    </form>
  )
}

/* ─── Contact Page ─── */
export default function Contact() {
  return (
    <main>
      {/* Hero banner */}
      <section className="relative py-24 md:py-32 bg-text overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-5 w-48 h-48 border-2 border-accent rounded-full" />
          <div className="absolute bottom-5 right-5 w-32 h-32 border-2 border-accent/60 rounded-full" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-tight">
            Get in{' '}
            <span className="text-accent">Touch</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/70 font-sans max-w-xl mx-auto">
            We would love to hear from you. Whether it is a reservation inquiry or 
            just a friendly hello — reach out anytime.
          </p>
        </div>
      </section>

      {/* Contact details + form */}
      <section className="py-20 md:py-28 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Info */}
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-text leading-tight">
                Visit or{' '}
                <span className="text-primary">Contact Us</span>
              </h2>
              <div className="mt-2 w-16 h-0.5 bg-accent" />
              <p className="mt-4 text-lg text-text-muted font-sans leading-relaxed">
                Drop by our trattoria in the heart of Brisbane or send us a message 
                and we will get back to you within 24 hours.
              </p>

              {/* Contact details */}
              <div className="mt-8 space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="mt-0.5">{item.icon}</div>
                    <div>
                      <p className="text-sm font-sans font-semibold text-text-muted uppercase tracking-wider">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="mt-0.5 text-lg font-sans text-text hover:text-primary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-0.5 text-lg font-sans text-text">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Hours */}
              <div className="mt-10">
                <div className="flex items-center gap-3 mb-4">
                  <ClockIcon />
                  <h3 className="text-base font-sans font-semibold text-text uppercase tracking-wider">
                    Opening Hours
                  </h3>
                </div>
                <div className="space-y-2 pl-10">
                  {hours.map((h) => (
                    <div key={h.day} className="flex justify-between text-base font-sans">
                      <span className="text-text font-medium">{h.day}</span>
                      <span className="text-text-muted">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative quote */}
              <div className="mt-10 pl-6 border-l-2 border-primary/40">
                <p className="text-lg font-serif italic text-text-muted">
                  "La vita è una combinazione di pasta e magia."
                </p>
                <p className="mt-1 text-sm font-sans text-text-muted">
                  — Life is a combination of pasta and magic.
                </p>
              </div>
            </div>

            {/* Right: Map + Form */}
            <div className="space-y-8">
              {/* Map image */}
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-[16/9]">
                <img
                  src="https://live.staticflickr.com/65535/51409280995_4e444b7dda_b.jpg"
                  alt="Trattoria Bella restaurant exterior"
                  width={1024}
                  height={661}
                  className="w-full h-full object-cover"
                  style={{ backgroundColor: '#8B7355' }}
                />
              </div>
              <p className="text-sm font-sans text-text-muted text-center -mt-4">
                <span className="font-semibold">Trattoria Bella</span> — 42 Via Roma Street, Brisbane
              </p>

              {/* Contact form */}
              <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-border/50">
                <h3 className="font-serif text-2xl text-text mb-1">Send a Message</h3>
                <p className="text-sm text-text-muted font-sans mb-6">
                  We will respond within 24 hours.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
