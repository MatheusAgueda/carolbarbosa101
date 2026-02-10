# CLAUDE.md — AI Assistant Guide

## Repository Overview

This is a **GitHub Profile Repository** for [carolbarbosa101](https://github.com/carolbarbosa101) (Caroline Barbosa). It contains a single `README.md` that renders as the user's GitHub profile landing page. This is **not** a software application — there is no source code, build system, or runtime.

## Repository Structure

```
carolbarbosa101/
├── CLAUDE.md        # This file — AI assistant guidance
└── README.md        # GitHub profile page content (Markdown + HTML)
```

## What the README Does

The `README.md` displays a personal portfolio/profile using:

- **Animated header/footer** via `capsule-render.vercel.app`
- **Typing animation** via `readme-typing-svg.herokuapp.com`
- **GitHub activity graph** via `github-readme-activity-graph.cyclic.app`
- **Profile trophies** via `github-profile-trophy.vercel.app`
- **GitHub stats & top languages** via `github-readme-stats.vercel.app`
- **Social media badges** (Instagram, YouTube, Gmail, LinkedIn) via `shields.io`
- **Skill badges** (JavaScript, CSS, React.js, PHP, TypeScript, Node.js) via `shields.io`
- **Visitor counter** via `profile-counter.glitch.me`

### Color Theme

The profile uses a consistent pink/rose color scheme:
- Primary color: `#ff91a4` (pink)
- Accent color: `#b13583` (dark pink)
- Background: `#0d1117` (GitHub dark theme)
- Dracula theme for trophies

## Development Workflow

### No Build Tools or Dependencies

There is no `package.json`, no linting, no CI/CD, no tests, and no build process. Changes are made directly to `README.md`.

### Making Changes

1. Edit `README.md` directly
2. Preview rendering on GitHub or with a local Markdown previewer that supports HTML
3. Commit and push to the appropriate branch

### Conventions

- **Markdown style**: Uses raw HTML (`<div>`, `<img>`, `<p>`, `<a>`) embedded in Markdown for layout control (centering, sizing)
- **Badge format**: All skill/social badges use `shields.io` with `style=for-the-badge`
- **Image sizing**: Stats cards use percentage-based widths (`width="49%"`, `width="41%"`)
- **Content alignment**: Most sections are center-aligned using `<div align="center">`
- **External services**: All dynamic content is rendered by third-party badge/SVG services — no local assets

### Commit History Pattern

All 9 historical commits are `Update README.md` messages from the same author. Keep commit messages simple and descriptive of what changed in the profile.

## Key Notes for AI Assistants

- **Do not** introduce build tools, linters, or package managers — this is intentionally a single-file repository.
- **Do not** download or inline external badge images — they are intentionally served dynamically.
- When editing the README, preserve the existing HTML structure and color theme (`#ff91a4`, `#b13583`, `#0d1117`).
- Some external service URLs may be outdated or broken (e.g., `cyclic.app` services have shut down). Suggest replacements if asked.
- The GitHub username referenced throughout is `carolbarbosa101`.
