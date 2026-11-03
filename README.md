# ▲ Ascend — Revenue Command Center

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live-5df0a8?style=for-the-badge" alt="Status: Live">
  <img src="https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20JS-3a6cff?style=for-the-badge" alt="Stack">
  <img src="https://img.shields.io/badge/Auth-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase Auth">
  <img src="https://img.shields.io/badge/3D-Three.js-black?style=for-the-badge&logo=threedotjs" alt="Three.js">
  <img src="https://img.shields.io/badge/Hosting-GitHub%20Pages-222?style=for-the-badge&logo=github" alt="GitHub Pages">
</p>

<p align="center">
  A fully handcrafted, <strong>zero-dependency SaaS landing page</strong> with a live 3D planet, Firebase authentication, and a real user dashboard — built to showcase modern front-end engineering and UX/UI skills.
</p>

---

## ✨ Live Demo

> 🔗 **[ascend-demo.github.io](https://your-username.github.io/Ascend)** ← replace with your GitHub Pages URL

---

## 🖼 Preview

| Home — 3D Globe | Pricing | Dashboard |
|---|---|---|
| ![Home](https://placehold.co/340x200/04060f/5df0a8?text=3D+Globe+Hero) | ![Plans](https://placehold.co/340x200/04060f/3a6cff?text=Pricing+Page) | ![Dashboard](https://placehold.co/340x200/04060f/5df0a8?text=User+Dashboard) |

---

## 🚀 Features

| Feature | Details |
|---|---|
| 🌍 **Live 3D planet** | Real-time WebGL globe rendered with Three.js and custom GLSL shaders — no libraries beyond Three |
| 🔐 **Real authentication** | Google & GitHub OAuth via Firebase Auth — users are persisted, no backend server required |
| 📊 **User dashboard** | Protected route — shows avatar, display name, KPIs, and personalized content |
| ✉️ **Email/password auth** | Create account + login with password-strength meter and field-level validation |
| 💫 **Scroll animations** | Intersection Observer-powered reveal animations with staggered delays |
| 🎨 **Glassmorphism UI** | Dark mode, backdrop blur, radial gradients, and animated starfield background |
| 📱 **Fully responsive** | Mobile-first layout — nav collapses, grid reflows, sidebar stacks |
| ⚡ **Zero build step** | Pure ES modules via CDN — open `index.html` and it works |
| 📚 **Learning center** | Filterable, searchable guide library with individual guide pages |
| 💳 **Pricing page** | Monthly/yearly toggle with pro-rata billing notes |
| 🔁 **Smooth scroll** | Lenis smooth-scroll library for buttery-smooth page traversal |
| 🏎 **Performance** | No bundler, no bloat — loads in < 1s on a fast connection |

---

## 🛠 Tech Stack

```
HTML5 + Vanilla CSS + Vanilla JS (ES Modules)
Three.js (3D planet & GLSL shaders)
Firebase Auth (Google OAuth, GitHub OAuth, Email/Password)
Lenis (smooth scroll)
Google Fonts — Inter
GitHub Pages (hosting)
```

No React. No Tailwind. No build step. Just clean, modern web fundamentals.

---

## 📁 Project Structure

```
Ascend/
├── index.html          # Landing page (3D globe, hero, features, plans)
├── account.html        # Login / Sign up
├── dashboard.html      # Protected user dashboard
├── plans.html          # Pricing page
├── learning.html       # Filterable guide library
├── guide.html          # Individual guide reader
├── contact.html        # Contact / sales form
├── privacy.html        # Privacy policy
├── terms.html          # Terms of service
├── 404.html            # Custom 404 page
│
├── css/
│   ├── base.css        # Design tokens, buttons, reveal animations
│   ├── sections.css    # Page sections (hero, features, showcase, CTA)
│   ├── Components.css  # Shared UI components (dialog, marquee, nav)
│   ├── Pages.css       # Inner page styles (plans, learning, contact, auth)
│   └── dashboard.css   # Dashboard layout and components
│
└── js/
    ├── firebase.js     # Firebase App + Auth helpers (Google, GitHub, email)
    ├── main.js         # Homepage orchestration (3D scene, features, plans)
    ├── scene.js        # Three.js planet renderer
    ├── Shaders.js      # Custom GLSL vertex + fragment shaders
    ├── account.js      # Auth logic (sign in, sign up, OAuth)
    ├── dashboard.js    # Dashboard hydration + auth guard
    ├── layout.js       # Shared nav + footer injection, starfield canvas
    ├── ui.js           # Mobile nav toggle, smooth anchor links
    ├── pages.js        # Scroll-reveal IntersectionObserver for inner pages
    ├── plans.js        # Billing toggle (monthly ↔ yearly)
    ├── learning.js     # Guide grid, category filter, search
    ├── guides.js       # Guide data
    ├── guide.js        # Individual guide renderer
    ├── contact.js      # Contact form validation + submission
    └── data.js         # Feature icons, stats, plan data
```

---

## 🔥 Firebase Setup (5 minutes)

> You need a free Firebase account to enable Google/GitHub sign-in.

### 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → name it `Ascend` → click through the prompts
3. Click the **`</>`** (Web) icon → register the app → copy the `firebaseConfig` object

### 2. Enable Authentication

1. In the Firebase console: **Authentication → Get started**
2. Click **Sign-in method** → enable **Google** (easy, just toggle on)
3. Enable **GitHub**:
   - Go to [github.com/settings/developers](https://github.com/settings/developers) → **New OAuth App**
   - **Homepage URL**: your GitHub Pages URL (e.g. `https://yourusername.github.io/Ascend`)
   - **Callback URL**: copy the callback URL shown in the Firebase GitHub setup panel
   - Click **Register** → copy the **Client ID** and **Client Secret**
   - Paste them into the Firebase GitHub sign-in settings → **Save**

### 3. Paste your config

Open `js/firebase.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey:            "YOUR_KEY",
  authDomain:        "YOUR_DOMAIN.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_BUCKET.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

### 4. Add your domain to Firebase

1. In Firebase console: **Authentication → Settings → Authorized domains**
2. Add your GitHub Pages domain: `yourusername.github.io`

That's it — Google and GitHub sign-in will work.

---

## 🌐 Deploy to GitHub Pages

```bash
# 1. Create a new repo on GitHub (e.g. "Ascend")
# 2. Push the project
git init
git add .
git commit -m "Initial commit — Ascend landing page"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Ascend.git
git push -u origin main

# 3. Enable GitHub Pages
# → Repo Settings → Pages → Source: Deploy from branch → main / (root) → Save
# → Site will be live at: https://YOUR_USERNAME.github.io/Ascend/
```

---

## 🧑‍💻 Run Locally

No build step required. Just serve the files with any static server:

```bash
# Option A — Python (built into macOS/Linux)
python3 -m http.server 8000

# Option B — Node.js (if installed)
npx serve .

# Option C — VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

> **Note:** You must serve over HTTP (not `file://`) for ES modules and Firebase to work.

---

## 📋 Pages

| Page | Route | Description |
|---|---|---|
| Home | `/index.html` | 3D globe hero, features, showcase, pricing teaser, CTA |
| Sign up / Log in | `/account.html` | Google, GitHub, or email authentication |
| Dashboard | `/dashboard.html` | Protected — requires sign-in |
| Pricing | `/plans.html` | Monthly/yearly toggle, 3 tiers, comparison table, FAQ |
| Learning | `/learning.html` | Searchable, filterable guide library |
| Guide | `/guide.html?id=...` | Individual guide reader |
| Contact | `/contact.html` | Sales / support contact form |
| Privacy | `/privacy.html` | Privacy policy |
| Terms | `/terms.html` | Terms of service |
| 404 | `/404.html` | Custom not-found page |

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#04060f` | Page background |
| `--accent` | `#5df0a8` | Green brand colour |
| `--accent-2` | `#2fd38a` | Gradient end |
| `--ink` | `#f3f6ff` | Primary text |
| `--muted` | `#9aa6c4` | Secondary text |
| `--glass` | `rgba(12,18,38,.55)` | Card backgrounds |
| `--radius-lg` | `26px` | Card border radius |
| `--font` | `'Inter'` | Body & headings |

---

## 📜 License

MIT — free to use, fork, and adapt. Attribution appreciated but not required.

---

<p align="center">Built with care by a front-end developer who believes the web should be beautiful. ✦</p>
