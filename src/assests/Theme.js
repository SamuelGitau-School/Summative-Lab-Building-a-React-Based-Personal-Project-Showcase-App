import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: 'var(--bg)',
      paper: 'var(--bg)',
    },
    text: {
      primary: 'var(--text-h)',
      secondary: 'var(--text)',
    },
    primary: {
      main: 'var(--accent)',
    },
    divider: 'var(--border)',
  },
  typography: {
    fontFamily: 'var(--sans)',
  },
  shape: {
    borderRadius: 6,
  },
});

export default theme;