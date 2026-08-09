import { createTheme } from '@mui/material/styles';


export function getTheme(mode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      background: {
        default: isDark ? '#333d29' : '#c2c5aa', 
        paper: isDark ? '#333d29' : '#c2c5aa',
      },
      text: {
        primary: isDark ? '#c2c5aa' : '#333d29', 
        secondary: isDark ? '#b6ad90' : '#656d4a', 
      },
      primary: {
        main: isDark ? '#a68a64' : '#7f4f24', 
      },
      divider: isDark ? '#414833' : '#b6ad90', 
    },
    typography: {
      fontFamily: 'system-ui, "Segoe UI", Roboto, sans-serif',
    },
    shape: {
      borderRadius: 6,
    },
  });
}