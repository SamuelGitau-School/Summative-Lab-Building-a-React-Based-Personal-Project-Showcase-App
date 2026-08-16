import { IconButton, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

// Goes back in browser history when possible (e.g. arrived via a link),
// otherwise falls back to a fixed route (e.g. arrived via a direct URL/refresh).
function BackButton({ fallback = '/dashboard', label = 'Back' }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <Tooltip title={label}>
      <IconButton onClick={handleBack} size="small" className="back-button" aria-label={label}>
        <ArrowBackIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

export default BackButton;
