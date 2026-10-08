# Navi UI

Landing website for **Navi UI**, a lightweight, accessible, themeable component library.

## Features

- Responsive layout with a mobile menu
- Light and dark themes (follows the system setting, with a manual toggle that is remembered)
- Live component showcase: buttons, forms, alerts, badges, progress bars, toasts, and cards
- Accessible tabs with arrow-key navigation, a skip link, and `prefers-reduced-motion` support
- No build step and no dependencies: plain HTML, CSS, and JavaScript

## Project structure

```
index.html     page markup
styles.css     design tokens and component styles
script.js      interactivity (theme, tabs, toasts, copy, animations)
assets/        logo and favicon
```

## Running locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Customizing

All colors, radii, and shadows are CSS custom properties defined on `:root` in `styles.css`.
Override `--primary`, `--accent`, `--radius`, and the other tokens to rebrand the site.
