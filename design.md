# SkillForge — Design System

Direction: **Applied Blueprint.** SkillForge is an engineering platform for learning — courses are
built out of modules like a system is built out of components, and a learner's mastery score
is basically a live readout. The UI should feel like a technical drafting tool that happens to be
delightful to use: precise, high-contrast, slightly mechanical — not another soft SaaS dashboard.

This extends the direction already validated in `AuthPages.tsx` (hard shadows, thick ink borders,
dot-grid backdrop). This document formalizes it into a system so every future screen (dashboards,
quiz runner, analytics) stays consistent instead of drifting.

---

## 1. Personality

- **Precise, not playful.** Confident geometry over decoration.
- **Technical, not cold.** Warm paper background + hand-drawn-adjacent hard shadows keep it human.
- **Earned motion.** Every animation communicates state (loading, success, error) — nothing purely
  decorative.

## 2. Color

| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#F4F1EA` | App background — warm bone paper |
| `--color-surface` | `#FFFFFF` | Cards, panels, modals |
| `--color-surface-sunken` | `#FAF9F6` | Inputs, wells, code blocks |
| `--color-ink` | `#1A1A1A` | Primary text, borders, icons |
| `--color-ink-soft` | `#605F5B` | Secondary text, placeholders |
| `--color-ink-faint` | `#A09E9A` | Disabled text, idle icons |
| `--color-primary` | `#2563EB` | Cobalt — primary actions, learner role, links |
| `--color-primary-dark` | `#1D4ED8` | Primary hover |
| `--color-accent` | `#E11D48` | Rose — secondary actions, instructor/admin role, destructive intent when paired with icon |
| `--color-success` | `#16A34A` | Correct answers, completion, success toasts |
| `--color-warning` | `#D97706` | Caution states, mid-mastery |
| `--color-danger` | `#DC2626` | Errors, failed submissions |
| `--color-border` | `#1A1A1A` | 2px solid, used everywhere — never a soft gray hairline |

Rule: **one accent per screen context.** Cobalt = learner-facing / primary flow. Rose = admin-facing
or secondary flow. Don't mix both as competing CTAs on the same view.

## 3. Typography

- **Display / Headings — Space Grotesk (700/800).** Geometric, slightly technical, used for page
  titles, card headers, stat numbers. Tight letter-spacing (-0.02em to -0.04em) at large sizes.
- **Body / UI — Spline Sans (400/500/700).** Everything else: labels, buttons, body copy, nav.
- **Data / Codes — JetBrains Mono (500).** Verification codes, IDs, scores, timers, anything that
  represents a raw value rather than prose. Gives the "instrument readout" feel.

```
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=Spline+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
```

Type scale (rem, base 16px):

| Role | Size | Weight | Line height |
|---|---|---|---|
| Display XL (hero stat) | 3rem | 800 | 1.0 |
| H1 (page title) | 1.75rem | 800 | 1.1 |
| H2 (card title) | 1.25rem | 700 | 1.2 |
| Body | 0.875rem | 500 | 1.5 |
| Label | 0.8125rem | 700 | 1.3, uppercase, 0.02em tracking |
| Caption / mono | 0.75rem | 500 | 1.4 |

## 4. Layout & Spacing

- 4px base unit. Scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
- Max content width for auth/forms: 420px. App shell content: 1120px.
- Corner radius: **8px** for inputs/buttons, **16px** for cards/panels. Never fully rounded except
  avatars and status dots.
- Border: 2px solid `--color-ink` on every interactive surface and card. This is a signature trait
  — don't drop to 1px gray borders elsewhere in the app for consistency.

## 5. Signature Element — Hard Offset Shadow + Dot Grid

- Cards/buttons carry a flat, non-blurred drop shadow: `4px 4px 0px 0px #1A1A1A` at rest,
  `6px 6px 0px 0px #1A1A1A` with a `-2px/-2px` translate on hover — the element physically lifts
  off the page like a raised drafting tool.
- Backgrounds use a faint dot grid (`radial-gradient(#1A1A1A 1px, transparent 1px)`, 24px cell,
  4% opacity) to reinforce the blueprint/graph-paper feel without competing with content.
- Status badges (role tags, difficulty tags, mastery level) are small pill/tab shapes that sit
  half-outside the card edge — like a stamped label — rather than living inline in the header.

## 6. Components (patterns, not full spec)

- **Buttons:** solid fill (primary/accent), thick ink border, hard shadow, bold uppercase-ish
  label at 15px/700. Press state removes the shadow and nudges the button down-right 2px — it
  should feel like a physical button, not a CSS gradient.
- **Inputs:** sunken background (`--color-surface-sunken`), icon inset left, ink border. On focus:
  background goes white and shadow flips to an inset `2px 2px 0 #1A1A1A` — the input "presses in"
  while the button "lifts out."
- **Cards:** white surface, ink border, 16px radius, hard shadow. A small tab/badge can hang off
  the top-left corner for status/context (mirrors the "Secure Gateway" tab in the auth card).
- **Loading:** never a generic spinner alone — pair with a short mono status string
  ("VERIFYING…", "SYNCING…") to keep the instrument-panel feel.

## 7. Motion

- Durations: 150ms for hover/press micro-interactions, 250–300ms for entrances, `cubic-bezier(0.16, 1, 0.3, 1)` easing (snappy-out).
- Card/page entrance: fade + 8px translate-up, once, on mount. No looping ambient motion.
- Error state: single short horizontal shake (2–3 cycles, ~350ms total) on the field or card, not
  the whole page.
- Respect `prefers-reduced-motion`: fall back to opacity-only transitions.

## 8. Iconography

Outline icons only, 2.5px stroke, matched to `--color-ink-faint` at rest and `--color-primary`/
`--color-accent` on focus/active (inline SVGs, no icon font — keeps bundle light and stroke width
consistent, as already established in `AuthPages.tsx`).

## 9. Voice

Plain and direct. Buttons describe the action ("Sign in", "Create account"), not the mechanism.
Errors state what happened and what to do, without blame ("That email is already registered —
try signing in instead."). Save the "engineering" flavor for visual and structural details (mono
type, dot grid, stat readouts), not for literally renaming form fields — keep labels like
"Email" and "Password" plain so the product stays usable, and reserve stylized copy for
marketing-adjacent surfaces only.
