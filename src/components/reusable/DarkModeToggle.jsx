import { IconButton } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeMode } from '../../context/Theme-mode-context';

function DarkMode() {
  const { mode, toggleColorMode } = useThemeMode();

  return (
    <IconButton
      onClick={toggleColorMode}
      size="small"
      aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
    </IconButton>
  );
}

export default DarkMode;