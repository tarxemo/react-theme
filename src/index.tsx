import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  lightClass?: string;
  darkClass?: string;
  systemClass?: string;
  storageKey?: string;
  disableTransition?: boolean;
  followSystemTheme?: boolean;
}

export interface ThemeContextType {
  theme: Theme;
  systemTheme: 'light' | 'dark';
  effectiveTheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  config: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  config?: ThemeConfig;
}

export const ThemeProvider = ({
  children,
  defaultTheme = 'light',
  config = {}
}: ThemeProviderProps) => {
  const finalConfig = {
    lightClass: 'light',
    darkClass: 'dark',
    systemClass: 'system',
    storageKey: 'theme',
    disableTransition: false,
    followSystemTheme: true,
    ...config
  };

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(finalConfig.storageKey) as Theme;
      return stored || defaultTheme;
    }
    return defaultTheme;
  });

  const effectiveTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Monitor system theme changes if followSystemTheme is enabled
    if (finalConfig.followSystemTheme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
      
      const handleChange = (e: MediaQueryListEvent) => {
        setSystemTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [finalConfig.followSystemTheme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    
    // Disable transitions temporarily to prevent flashing if requested
    if (finalConfig.disableTransition) {
       root.classList.add('no-transitions');
    }

    // Remove all theme classes first
    root.classList.remove(finalConfig.lightClass, finalConfig.darkClass, finalConfig.systemClass);
    
    // Add the effective theme class
    if (effectiveTheme === 'dark') {
      root.classList.add(finalConfig.darkClass);
    } else if (effectiveTheme === 'light') {
      root.classList.add(finalConfig.lightClass);
    } else {
      root.classList.add(finalConfig.systemClass);
    }
    
    localStorage.setItem(finalConfig.storageKey, theme);

    if (finalConfig.disableTransition) {
       // Force repaint
       (() => window.getComputedStyle(root).opacity)();
       root.classList.remove('no-transitions');
    }
  }, [theme, effectiveTheme, finalConfig]);

  const value = useMemo(
    () => ({
      theme,
      systemTheme,
      effectiveTheme,
      toggleTheme: () => setThemeState((t) => {
        if (t === 'light') return 'dark';
        if (t === 'dark') return 'system';
        return 'light';
      }),
      setTheme: setThemeState,
      config: finalConfig
    }),
    [theme, systemTheme, effectiveTheme, finalConfig]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

// Alias for compatibility if needed, or prefer useTheme
export const useThemeContext = useTheme;
