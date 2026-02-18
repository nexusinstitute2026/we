# Nexus Institute - Website

## 🌟 Overview
A fully offline-capable, fast, animated, and mobile-friendly website for Nexus Institute — an online education platform for A/L and Pracheena (ancient) examinations in Sri Lanka.

## ✅ Features Implemented
- **100% Offline Ready** — All fonts, images, and assets are local (no CDN dependencies)
- **Logo Integration** — `logo.png` added to navbar, hero section, mobile menu, and footer on all pages
- **Premium Animations** — Floating blobs, parallax scrolling, scroll reveal, micro-interactions
- **Mobile-First** — Full-screen mobile menu, responsive grids, touch-friendly buttons
- **Glassmorphism** — Modern glass-effect cards and navbar
- **Fast Loading** — No external dependencies (no Tailwind CDN, no React CDN)
- **3 Pages** — `index.html`, `al.html`, `prachina.html`
- **Pure HTML/CSS/JS** — No framework dependencies, works anywhere
- **Vite Build** — Production-optimized output in `dist/` folder

## 📂 Project Structure
```
Nexus Web/
├── index.html          # Main landing page
├── al.html             # A/L section with subject tabs & class cards
├── prachina.html       # Pracheena section with level selectors
├── logo.png            # Institute logo
├── fonts/              # Local font files (Noto Serif Sinhala, Outfit)
│   ├── fonts.css       # @font-face declarations
│   ├── NotoSerifSinhala-*.ttf
│   └── Outfit-*.ttf
├── images/             # Local images
│   ├── logo.png
│   ├── hero-bg.jpg
│   ├── about-bg.jpg
│   └── class-*.jpg
├── public/             # Static assets (copied to dist as-is)
│   └── images/
├── package.json
├── vite.config.js      # Multi-page Vite config
├── dist/               # Production build output
└── readme.md           # This file
```

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)

### Development
```bash
npm install        # Install dependencies (only vite)
npm run dev        # Start dev server (http://localhost:5173)
```

### Build for Production
```bash
npm run build      # Output to dist/ folder
npm run preview    # Preview the production build
```

## 🌐 Deploy to GitHub Pages

1. **Create a GitHub Repository** for this project.

2. **Set base path** in `vite.config.js`:
   ```js
   base: '/YOUR_REPO_NAME/',
   ```

3. **Build and push:**
   ```bash
   npm run build
   ```

4. **Deploy the `dist/` folder** to GitHub Pages:
   - Go to **Settings → Pages → Source** and set it to `Deploy from a branch`
   - Or use `gh-pages` npm package:
     ```bash
     npm install -D gh-pages
     npx gh-pages -d dist
     ```

## � Pages Overview

| Page | Description |
|------|-------------|
| `index.html` | Landing page with hero, courses, features, footer |
| `al.html` | A/L section with subject tabs (Buddhism, Pali, Sanskrit, Sinhala) and class cards |
| `prachina.html` | Pracheena section with 3 exam levels (Prarambha, Madya, Awasana) and subject links |

## 🎨 Design System
- **Primary:** Teal (#0f766e)
- **Accent:** Gold (#d97706)
- **Dark:** #0f393b
- **Fonts:** Noto Serif Sinhala (Sinhala text), Outfit (English text)
- **Effects:** Glassmorphism, animated blobs, parallax, scroll reveal

## 📞 Contact
- **Phone:** 0788 345 643
- **Email:** madhubhashinichandrapala18@gmail.com
- **Facebook:** [Nexus Institute](https://www.facebook.com/profile.php?id=100075692104528)
- **YouTube:** [Madhubhashini Chandrapala](http://www.youtube.com/@madhubhashinichandrapala4816)
- **TikTok:** [@madubhashini.chan0](https://www.tiktok.com/@madubhashini.chan0)
