import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from '../utils/theme';

const ThemeModeContext = createContext(null)

export function ThemeModeProvider({ children }) {
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem('theme');
            if (saved) return saved;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
       }
    )

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', mode)
        localStorage.setItem('theme', mode)
    }, [mode])

    const toggleColorMode = () => {
        setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }

    const theme = useMemo(() => getTheme(mode), [mode])

    return (
        <ThemeModeContext.Provider value={{ mode, toggleColorMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeModeContext.Provider>
    )
}

export function useThemeMode() {
    const context = useContext(ThemeModeContext)
        if (!context) {
            throw new Error('useThemeMode must be used within a ThemeModeProvider')
        }
    return context
}