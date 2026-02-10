# CLAUDE.md — AI Assistant Guide

## Repository Overview

This is a **GitHub Profile Repository** for [carolbarbosa101](https://github.com/carolbarbosa101) (Caroline Barbosa). It contains:

1. A `README.md` that renders as the user's GitHub profile landing page
2. A **Calculadora Oficial** — a fully functional web calculator built with vanilla HTML, CSS, and JavaScript

## Repository Structure

```
carolbarbosa101/
├── CLAUDE.md                        # This file — AI assistant guidance
├── README.md                        # GitHub profile page content (Markdown + HTML)
└── calculadoraoficial/              # Web calculator application
    ├── index.html                   # Main HTML — calculator layout and structure
    ├── css/
    │   └── styles.css               # Styling — responsive dark theme with pink accents
    ├── js/
    │   └── calculator.js            # Logic — all operations, display, keyboard support
    └── assets/                      # Reserved for future static assets (icons, images)
```

## GitHub Profile (README.md)

The `README.md` displays a personal portfolio/profile using:

- **Animated header/footer** via `capsule-render.vercel.app`
- **Typing animation** via `readme-typing-svg.herokuapp.com`
- **GitHub activity graph** via `github-readme-activity-graph.cyclic.app`
- **Profile trophies** via `github-profile-trophy.vercel.app`
- **GitHub stats & top languages** via `github-readme-stats.vercel.app`
- **Social media badges** (Instagram, YouTube, Gmail, LinkedIn) via `shields.io`
- **Skill badges** (JavaScript, CSS, React.js, PHP, TypeScript, Node.js) via `shields.io`
- **Visitor counter** via `profile-counter.glitch.me`

### Profile Color Theme

- Primary color: `#ff91a4` (pink)
- Accent color: `#b13583` (dark pink)
- Background: `#0d1117` (GitHub dark theme)
- Dracula theme for trophies

## Calculadora Oficial

### Overview

A responsive web calculator with a dark theme that matches the profile's pink/rose color scheme. No frameworks or dependencies — pure HTML, CSS, and JavaScript.

### Features

- **Basic operations**: addition, subtraction, multiplication, division
- **Percentage**: context-aware (e.g., `200 + 10%` = `220`)
- **Decimal numbers**: with Brazilian locale formatting (comma separator)
- **Backspace**: delete last digit
- **Expression display**: shows the ongoing calculation above the result
- **Keyboard support**: full numpad and operator key bindings
- **Responsive**: adapts to mobile screens (< 400px)

### Architecture

| File | Responsibility |
|------|---------------|
| `index.html` | Semantic HTML structure with `data-*` attributes for button actions |
| `css/styles.css` | CSS custom properties (variables), grid layout, transitions, responsive breakpoints |
| `js/calculator.js` | IIFE-wrapped state machine — handles input, calculation, display formatting |

### CSS Variables (Theme)

All colors are defined as CSS custom properties in `:root`:
- `--color-primary`: `#ff91a4`
- `--color-accent`: `#b13583`
- `--color-bg`: `#0d1117`
- `--color-surface`: `#161b22`
- `--color-text`: `#e6edf3`

### JavaScript Patterns

- **IIFE**: entire module is wrapped in an immediately invoked function expression for encapsulation
- **State object**: single `state` object holds all calculator state (`currentValue`, `previousValue`, `operator`, etc.)
- **Event delegation**: one click listener on the keys container, dispatches by `data-action` / `data-value`
- **Locale formatting**: uses `toLocaleString('pt-BR')` for Brazilian number format (comma as decimal separator)

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0`–`9` | Input digit |
| `.` or `,` | Decimal point |
| `+` `-` `*` `/` | Operators |
| `%` | Percentage |
| `Enter` or `=` | Equals |
| `Backspace` | Delete last digit |
| `Escape` or `C` | Clear all |

### How to Run

Open `calculadoraoficial/index.html` in any modern browser. No server or build step required.

## Development Workflow

### No Build Tools or Dependencies

There is no `package.json`, no linting, no CI/CD, no tests, and no build process. All files are edited directly.

### Making Changes

1. Edit files directly in the relevant directory
2. Preview `index.html` in a browser or GitHub Pages
3. For the profile `README.md`, preview on GitHub or with a local Markdown previewer
4. Commit and push to the appropriate branch

### Conventions

- **Color theme**: All UI follows the pink/rose scheme (`#ff91a4`, `#b13583`, `#0d1117`)
- **No frameworks**: Vanilla HTML/CSS/JS only for the calculator
- **Badge format**: Profile badges use `shields.io` with `style=for-the-badge`
- **Content alignment**: Profile sections are center-aligned using `<div align="center">`
- **External services**: Profile dynamic content is rendered by third-party badge/SVG services
- **Commit messages**: Keep simple and descriptive

## Key Notes for AI Assistants

- **Do not** introduce build tools, bundlers, linters, or package managers — this is intentionally dependency-free.
- **Do not** download or inline external badge images — they are intentionally served dynamically.
- When editing the profile README, preserve the existing HTML structure and color theme.
- When editing the calculator, maintain the CSS variable system and the state-based JS architecture.
- Some external service URLs in the profile may be outdated (e.g., `cyclic.app`). Suggest replacements if asked.
- The GitHub username referenced throughout is `carolbarbosa101`.
