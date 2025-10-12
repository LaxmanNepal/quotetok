// FIX: Import React to resolve 'React' namespace errors for types.
import React, { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

type Theme = 'light' | 'dark';

function useTheme(): [Theme, React.Dispatch<React.SetStateAction<Theme>>] {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return [theme, setTheme];
}

export default useTheme;