import { Link } from 'react-router-dom'

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Our Menu' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/admin', label: 'Admin' },
]

const hours = [
  { day: 'Monday – Thursday', time: '11:30 AM – 10:00 PM' },
  { day: 'Friday – Saturday', time: '11:30 AM – 11:00 PM' },
  { day: 'Sunday', time: '12:00 PM – 9:00 PM' },
]

const socialLinks = [
  { name: 'Instagram', url: '#' },
  { name: 'Facebook', url: '#' },
  { name: 'TripAdvisor', url: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-text text-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Logo & description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="font-serif text-2xl md:text-3xl text-accent tracking-tight"
            >
              Trattoria Bella
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/70 font-sans max-w-xs">
              Authentic Italian cuisine crafted with passion and tradition. 
              Every dish tells a story of family, heritage, and the finest 
              ingredients from the heart of Italy.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg text-accent mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm font-sans text-white/70 hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-serif text-lg text-accent mb-4">Hours</h4>
            <ul className="space-y-3">
              {hours.map((h) => (
                <li key={h.day}>
                  <span className="block text-sm font-sans font-semibold text-white">
                    {h.day}
                  </span>
                  <span className="block text-sm font-sans text-white/70">
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-serif text-lg text-accent mb-4">Follow Us</h4>
            <ul className="space-y-3">
              {socialLinks.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    className="text-sm font-sans text-white/70 hover:text-accent transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-xs text-center font-sans text-white/50">
            &copy; {new Date().getFullYear()} Trattoria Bella. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
