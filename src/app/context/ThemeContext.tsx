import { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  setTheme: (t: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  resolvedTheme: 'dark',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [systemDark, setSystemDark] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const resolvedTheme: 'dark' | 'light' =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem('our-notes-theme', t);
  };

  useEffect(() => {
    const saved = localStorage.getItem('our-notes-theme') as ThemeMode | null;
    if (saved) setThemeState(saved);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
