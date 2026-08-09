import { createTheme } from '@mui/material/styles';


export function getTheme(mode) {
  const isDark = mode === 'dark';
  const accent = isDark ? '#a68a64' : '#7f4f24';
  const border = isDark ? '#414833' : '#b6ad90';

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
        main: accent, 
      },
      divider: border, 
    },
    typography: {
      fontFamily: 'system-ui, "Segoe UI", Roboto, sans-serif',
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: '0 6px 14px -6px rgba(0,0,0,0.35)',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'transform 0.15s ease, background-color 0.15s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              backgroundColor: isDark ? 'rgba(166,138,100,0.15)' : 'rgba(127,79,36,0.1)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: `1px solid ${border}`,
            backgroundColor: isDark ? 'rgba(51,61,41,0.6)' : 'rgba(194,197,170,0.6)',
            backdropFilter: 'blur(16px)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
            '&.Mui-focused': {
              boxShadow: `0 0 0 3px ${isDark ? 'rgba(166,138,100,0.2)' : 'rgba(127,79,36,0.12)'}`,
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            transition: 'transform 0.15s ease',
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 10,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            borderRadius: 3,
          },
        },
      },
    },
  });
}