# Trattoria Bella — Design System

## Brand
- **Project name:** Trattoria Bella — Restaurant Menu Site
- **One-line description:** A cozy, refined trattoria website showcasing an authentic Italian menu with a warm, rustic feel.
- **Emotional tone:** Warm, appetizing, cozy yet refined — evokes the feeling of a rustic Italian trattoria with modern polish.

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#C65D47` | Main brand — terracotta (CTAs, active tabs, key highlights) |
| `--color-secondary` | `#6B8F5E` | Olive green (secondary accents, success states, decorative elements) |
| `--color-accent` | `#E8B84B` | Golden honey (special badges, star ratings, price highlights) |
| `--color-bg` | `#FDF8F3` | Warm cream (page background) |
| `--color-surface` | `#FFFFFF` | Pure white (cards, panels, modals) |
| `--color-surface-alt` | `#F5EDE4` | Warm beige (alternate card backgrounds, hover states) |
| `--color-text` | `#2C1810` | Dark espresso (body text) |
| `--color-text-muted` | `#7D6B5D` | Warm taupe (secondary text, descriptions) |
| `--color-border` | `#E3D5C8` | Soft sand (borders, dividers) |

## Typography

- **Heading font:** Playfair Display (600, 700) → `--font-serif`
- **Body font:** Inter (400, 600, 700) → `--font-sans`
- **Base size:** 18px (`text-lg`), `leading-relaxed` (1.625)
- **Scale:**
  - `h1` → `text-5xl md:text-7xl` font-serif
  - `h2` → `text-3xl md:text-5xl` font-serif
  - `h3` → `text-2xl md:text-3xl` font-serif
  - `h4` → `text-xl` font-sans semibold
  - Body → `text-lg` font-sans

## Spacing & Layout

- Section padding: `py-20 md:py-28`
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Card radius: `rounded-2xl`
- Button radius: `rounded-lg`
- Gap grid: `gap-6 md:gap-8`
- Card padding: `p-6`

## Component Inventory

### 1. Navbar
- Sticky top, `bg-bg/90 backdrop-blur-md` glass effect
- Logo (trattoria name, font-serif) left, nav links center, CTA "Reserve a Table" button right
- Mobile hamburger menu with slide-out overlay
- Active link underlined with `text-primary`

### 2. Hero
- Full-viewport height (`min-h-screen`) with a rich background image (dark overlay gradient)
- Centered headline in font-serif, white text, dramatic sizing
- Subheadline in font-sans, softened
- Two CTAs: "View Our Menu" (primary) and "Make a Reservation" (outline)
- Subtle parallax or scroll indicator at bottom

### 3. About Section (Home)
- Two-column: left image (restaurant interior / chef), right text
- Small decorative olive branch or divider accent
- "Our Story" heading + paragraph about the trattoria

### 4. Featured Categories / Specialties (Home)
- Grid of 3-4 category cards with image backgrounds, overlay with category name
- Hover: scale(1.03) with brightened overlay

### 5. CategoryTabs (Menu page)
- Horizontal scrollable row of pill-shaped tabs
- Active tab: `bg-primary text-white`; inactive: `bg-surface-alt text-text-muted`
- Click filters the displayed items

### 6. SearchBar (Menu page)
- Full-width input with a search icon,rounded-xl border
- Real-time filtering by item name (derived state, no API call)

### 7. MenuItemGrid (Menu page)
- CSS Grid: 1 col mobile, 2 cols tablet, 3 cols desktop
- Each card: image (aspect-[4/3]), name, description (2-line clamp), price badge (accent bg)
- Click navigates to `/item/:id`

### 8. ItemDetail page
- Two-column layout: left large image, right details
- Category tag pill, item name (font-serif), price, full description
- "Add to Order" button (visual placeholder)
- Back to menu link

### 9. Contact page
- Left column: address, phone, email, hours (with icons)
- Right column: embedded map image (static)
- Contact form: name, email, message — controlled inputs, validated on submit

### 10. Footer
- 4-column grid: logo + description, Quick Links, Hours, Social
- Copyright bar at bottom
- Background: `text` color, `bg-surface-alt`

### 11. Admin Panel
- Two sections side by side (top/bottom on mobile):
  - **Category Manager:** list + add/edit/delete form
  - **Menu Item Manager:** list + add/edit/delete form with category selector
- All CRUD operations via `src/lib/db.js` → persists to db.json

### 12. ScrollReveal (shared hook)
- Simple IntersectionObserver-based hook: `useScrollReveal`
- Adds `opacity-0 translate-y-8` initially, toggles to `opacity-100 translate-y-0` on intersect
- 0.5s ease, staggered by 0.1s delay per child index

## Images

| Slot | URL | Width | Height | Orientation | Source |
|---|---|---|---|---|---|
| `hero` | `https://images.rawpixel.com/editor_1024/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcHgxMTA0MjczLWltYWdlLWt3eXI2aDNwLWt3eXQ5djh5LmpwZw.jpg` | 4052 | 2504 | landscape | Rawpixel CC0 — Italian antipasti platter |
| `about` | `https://live.staticflickr.com/2861/10281830755_1eb8f48a9c_b.jpg` | 1024 | 679 | landscape | Flickr CC0 — SF Restaurant interior |
| `cat-pasta` | `https://images.rawpixel.com/editor_1024/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvYTAxOS1qYWt1YmstMDc1MC1tYWtpbmctZnJlc2gtaG9tZW1hZGUtcGFzdGEuanBn.jpg` | 6000 | 4000 | landscape | Rawpixel CC0 — Fresh homemade pasta |
| `cat-pizza` | `https://live.staticflickr.com/65535/55252067993_53dabc563c_b.jpg` | 1024 | 768 | landscape | Flickr CC0 — Margherita pizza |
| `cat-dessert` | `https://pd.w.org/2022/09/514632a8d03222554.67030706-2048x1536.jpg` | 2048 | 1536 | landscape | WordPress CC0 — Tiramisu dessert |
| `cat-wine` | `https://live.staticflickr.com/8543/8647725243_248fc89d30_b.jpg` | 1024 | 678 | landscape | Flickr PDM — Red wine |
| `contact-map` | `https://live.staticflickr.com/65535/51409280995_4e444b7dda_b.jpg` | 1024 | 661 | landscape | Flickr PDM — Nero's Italian Restaurant exterior |

## Animations

- **Scroll reveal:** fade-up (opacity 0→1, translateY 2rem→0), 0.5s ease, staggered by 0.1s
- **Card hover:** `translateY(-4px)` + `shadow-xl`, 0.25s ease
- **Button hover:** `scale(1.02)` + `brightness(1.1)`, 0.2s
- **Nav link underline:** slide-in from left, 0.2s ease
- **Tab active:** smooth background color transition, 0.2s
- **Mobile menu:** slide-in from right, 0.3s ease
