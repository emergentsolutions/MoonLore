# Moonbirds Art Forge Style Guide

## 🎨 Design System

### Color Palette

Our design system is based on a dark theme with vibrant accent colors inspired by the Moonbirds universe.

```css
/* Primary Colors */
--color-primary: rgb(0, 240, 255);        /* Cyan - #00F0FF */
--color-primary-dark: rgb(0, 192, 204);   /* Dark Cyan */
--color-primary-light: rgb(51, 243, 255); /* Light Cyan */

/* Accent Colors */
--color-accent: rgb(156, 39, 176);        /* Purple - #9C27B0 */
--color-accent-dark: rgb(123, 31, 162);   /* Dark Purple */
--color-accent-light: rgb(186, 104, 200); /* Light Purple */

/* Background Colors */
--color-background: rgb(18, 18, 26);      /* Dark Navy - #12121A */
--color-background-light: rgb(36, 36, 44); /* Lighter Navy */

/* Text Colors */
--color-foreground: rgb(255, 255, 255);   /* White */
--color-foreground-muted: rgba(255, 255, 255, 0.7);
```

### Typography

We use system fonts for optimal performance and readability:

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

Font sizes follow a modular scale:
- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875rem (14px)
- `text-base`: 1rem (16px)
- `text-lg`: 1.125rem (18px)
- `text-xl`: 1.25rem (20px)
- `text-2xl`: 1.5rem (24px)
- `text-3xl`: 1.875rem (30px)
- `text-4xl`: 2.25rem (36px)
- `text-5xl`: 3rem (48px)

### Spacing

We use a consistent 8-point grid system:
- `1`: 0.25rem (4px)
- `2`: 0.5rem (8px)
- `3`: 0.75rem (12px)
- `4`: 1rem (16px)
- `6`: 1.5rem (24px)
- `8`: 2rem (32px)
- `12`: 3rem (48px)
- `16`: 4rem (64px)
- `20`: 5rem (80px)

### Components

#### Buttons

```css
.btn {
  @apply inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none;
}

.btn-primary {
  @apply bg-primary hover:bg-primary-light text-background;
}

.btn-outline {
  @apply border border-primary text-primary hover:bg-primary hover:text-background;
}

.btn-sm {
  @apply px-4 py-2 text-sm;
}
```

#### Cards

```css
.card {
  @apply bg-background-light/10 rounded-xl border border-background-light/20 p-6;
}

.card-hover {
  @apply hover:border-primary/50 transition-all;
}
```

#### Forms

```css
.input {
  @apply w-full px-4 py-3 bg-background-dark border border-background-light/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all;
}

.label {
  @apply block text-sm font-medium text-foreground/80 mb-2;
}
```

## 📏 Layout Principles

### Container

Maximum width: 1280px (max-w-6xl)
Responsive padding: `px-4 sm:px-6 lg:px-8`

### Grid System

- Mobile: Single column
- Tablet (md): 2 columns
- Desktop (lg): 3-4 columns

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Items -->
</div>
```

### Sections

Standard section padding: `py-12 md:py-20`

## 🧩 Component Patterns

### Loading States

Use skeleton loaders and progress indicators:

```html
<div class="animate-pulse">
  <div class="h-4 bg-background-light/20 rounded w-3/4 mb-2"></div>
  <div class="h-4 bg-background-light/20 rounded w-1/2"></div>
</div>
```

### Error States

Consistent error messaging:

```html
<div class="text-center p-4">
  <div class="text-red-500 mb-2">
    <svg class="h-12 w-12 mx-auto"><!-- Icon --></svg>
  </div>
  <p class="text-lg font-medium">Error Title</p>
  <p class="text-sm text-foreground/60 mt-1">Error description</p>
  <button class="btn btn-primary mt-4">Try Again</button>
</div>
```

### Empty States

Friendly empty state messaging:

```html
<div class="text-center py-12">
  <svg class="h-24 w-24 mx-auto text-foreground/30 mb-4"><!-- Icon --></svg>
  <h3 class="text-lg font-medium mb-2">No items found</h3>
  <p class="text-foreground/60">Get started by creating your first item</p>
</div>
```

## 🖼️ Icons

We use Heroicons for consistency:
- Outline icons for UI elements
- Solid icons for emphasis
- Size: 5 (1.25rem) for standard, 6 (1.5rem) for prominent actions

## 📱 Responsive Design

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Mobile-first approach: Design for mobile, then enhance for larger screens.

## ♿ Accessibility

- All interactive elements must be keyboard accessible
- Color contrast ratios must meet WCAG AA standards
- Provide proper ARIA labels for screen readers
- Focus indicators must be visible
- Images must have alt text

## 🎭 Animation

Use subtle animations for better UX:

```css
/* Standard transition */
transition: all 0.2s ease;

/* Hover scale */
transform: scale(1.02);

/* Loading spinner */
animation: spin 1s linear infinite;
```

## 🌐 Internationalization

- Use relative units (rem, em) for scalable text
- Allow for text expansion (30-50% for translations)
- Use logical properties (start/end instead of left/right)

## 🧪 Testing

Visual regression testing checkpoints:
- Mobile (375px)
- Tablet (768px)
- Desktop (1280px)

## 📋 Code Standards

### HTML/Component Structure

```astro
---
// Imports and logic
import Component from './Component.astro';

export interface Props {
  title: string;
  className?: string;
}

const { title, className = '' } = Astro.props;
---

<div class={`component-name ${className}`}>
  <h2>{title}</h2>
  <slot />
</div>

<style>
  /* Component-specific styles */
</style>
```

### CSS Organization

1. Layout properties (display, position, grid)
2. Box model (width, padding, margin)
3. Typography (font, color)
4. Visual (background, border)
5. Misc (transition, animation)

### Naming Conventions

- Components: PascalCase (e.g., `WalletConnect.tsx`)
- Files: kebab-case (e.g., `moon-token.ts`)
- CSS classes: kebab-case (e.g., `.btn-primary`)
- Variables: camelCase (e.g., `tipAmount`)
- Constants: UPPER_SNAKE_CASE (e.g., `MOON_TOKEN_ADDRESS`)