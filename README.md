# @tarxemo/react-theme

[![npm version](https://img.shields.io/npm/v/@tarxemo/react-theme.svg)](https://www.npmjs.com/package/@tarxemo/react-theme)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A flexible, lightweight React theme provider for managing dark/light modes with system preference detection and localStorage persistence.

## Features

✅ **Light, Dark & System Modes** - Support for all three theme modes  
✅ **System Preference Detection** - Automatically follows OS theme  
✅ **LocalStorage Persistence** - Remembers user's theme choice  
✅ **Zero Dependencies** - Only React peer dependency  
✅ **TypeScript Support** - Full type definitions  
✅ **SSR Safe** - Works with Next.js and other SSR frameworks  
✅ **Customizable Classes** - Configure your own CSS class names  
✅ **Transition Control** - Prevent flash on initial load

## Installation

```bash
npm install @tarxemo/react-theme
```

### Peer Dependencies

```bash
npm install react react-dom
```

## Quick Start

### 1. Wrap Your App

```tsx
import { ThemeProvider } from '@tarxemo/react-theme';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      {/* Your app */}
    </ThemeProvider>
  );
}
```

### 2. Use the Hook

```tsx
import { useTheme } from '@tarxemo/react-theme';

function ThemeToggle() {
  const { theme, effectiveTheme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Effective theme: {effectiveTheme}</p>
      
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
      
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  );
}
```

### 3. Add CSS

```css
/* Global styles */
:root.light {
  --bg-color: #ffffff;
  --text-color: #000000;
}

:root.dark {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

/* Prevent transitions on initial load */
.no-transitions * {
  transition: none !important;
}
```

## API Reference

### ThemeProvider

```tsx
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
  config?: ThemeConfig;
}
```

**Props:**
- `children` - Your app components
- `defaultTheme` - Initial theme (default: `'light'`)
- `config` - Configuration options

**Example:**
```tsx
<ThemeProvider
  defaultTheme="system"
  config={{
    lightClass: 'light-mode',
    darkClass: 'dark-mode',
    storageKey: 'app-theme',
    disableTransition: true
  }}
>
  <App />
</ThemeProvider>
```

### ThemeConfig

```tsx
interface ThemeConfig {
  lightClass?: string;         // Default: 'light'
  darkClass?: string;          // Default: 'dark'
  systemClass?: string;        // Default: 'system'
  storageKey?: string;         // Default: 'theme'
  disableTransition?: boolean; // Default: false
  followSystemTheme?: boolean; // Default: true
}
```

### useTheme Hook

```tsx
const {
  theme,           // 'light' | 'dark' | 'system'
  systemTheme,     // 'light' | 'dark' (OS preference)
  effectiveTheme,  // 'light' | 'dark' (actual theme applied)
  toggleTheme,     // () => void
  setTheme,        // (theme: Theme) => void
  config           // ThemeConfig
} = useTheme();
```

**Returns:**
- `theme` - Current theme setting
- `systemTheme` - OS theme preference
- `effectiveTheme` - Actual theme applied (resolves 'system' to light/dark)
- `toggleTheme` - Cycles through light → dark → system → light
- `setTheme` - Set specific theme
- `config` - Current configuration

## Usage Examples

### Theme Toggle Button

```tsx
function ThemeToggle() {
  const { effectiveTheme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {effectiveTheme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
```

### Theme Selector

```tsx
function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}
```

### Conditional Rendering

```tsx
function Logo() {
  const { effectiveTheme } = useTheme();
  
  return (
    <img 
      src={effectiveTheme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'} 
      alt="Logo" 
    />
  );
}
```

### With Tailwind CSS

```tsx
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Use class-based dark mode
  // ...
};

// App.tsx
<ThemeProvider
  defaultTheme="system"
  config={{
    darkClass: 'dark',
    lightClass: 'light'
  }}
>
  <App />
</ThemeProvider>

// Component.tsx
function Component() {
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
      Content
    </div>
  );
}
```

### Custom Configuration

```tsx
<ThemeProvider
  defaultTheme="dark"
  config={{
    lightClass: 'theme-light',
    darkClass: 'theme-dark',
    systemClass: 'theme-system',
    storageKey: 'my-app-theme',
    disableTransition: true,      // Prevent flash on load
    followSystemTheme: true       // Monitor OS theme changes
  }}
>
  <App />
</ThemeProvider>
```

## Advanced Usage

### Prevent Flash on Initial Load

```tsx
// Add to your HTML head
<script>
  (function() {
    const theme = localStorage.getItem('theme') || 'light';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    document.documentElement.classList.add(effectiveTheme);
  })();
</script>

// Then use disableTransition
<ThemeProvider config={{ disableTransition: true }}>
  <App />
</ThemeProvider>
```

### Next.js Integration

```tsx
// _app.tsx
import { ThemeProvider } from '@tarxemo/react-theme';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider defaultTheme="system">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
```

### CSS Variables Approach

```css
:root {
  --color-bg: #ffffff;
  --color-text: #000000;
  --color-primary: #3b82f6;
}

:root.dark {
  --color-bg: #0f172a;
  --color-text: #f1f5f9;
  --color-primary: #60a5fa;
}

.card {
  background: var(--color-bg);
  color: var(--color-text);
}

.button {
  background: var(--color-primary);
}
```

## Best Practices

### 1. Use CSS Variables

```css
/* Define variables for both themes */
:root.light {
  --bg: white;
  --text: black;
}

:root.dark {
  --bg: black;
  --text: white;
}

/* Use variables in components */
.component {
  background: var(--bg);
  color: var(--text);
}
```

### 2. Provide System Option

```tsx
// Always include system option for user preference
<ThemeProvider defaultTheme="system">
```

### 3. Persist User Choice

```tsx
// Library handles this automatically via localStorage
// Just ensure storageKey is consistent
<ThemeProvider config={{ storageKey: 'my-app-theme' }}>
```

### 4. Handle Images

```tsx
function ThemedImage() {
  const { effectiveTheme } = useTheme();
  
  return (
    <picture>
      <source 
        srcSet="/image-dark.jpg" 
        media="(prefers-color-scheme: dark)" 
      />
      <img src="/image-light.jpg" alt="Themed image" />
    </picture>
  );
}
```

## Troubleshooting

### Issue: Flash of wrong theme on load

**Solution:** Use the inline script in HTML head (see Advanced Usage)

### Issue: Theme not persisting

**Cause:** localStorage not available or different storageKey

**Solution:**
```tsx
// Ensure consistent storageKey
<ThemeProvider config={{ storageKey: 'theme' }}>
```

### Issue: System theme not updating

**Cause:** `followSystemTheme` disabled

**Solution:**
```tsx
<ThemeProvider config={{ followSystemTheme: true }}>
```

## TypeScript

Full TypeScript support:

```tsx
import {
  ThemeProvider,
  useTheme,
  Theme,
  ThemeConfig,
  ThemeContextType
} from '@tarxemo/react-theme';
```

## License

MIT
# react-theme
