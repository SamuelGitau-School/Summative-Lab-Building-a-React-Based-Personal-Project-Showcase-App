import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';

export function useLogout() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  return () => {
    logoutUser()
    navigate('/login')
  }
}

function Logout({ sx, ...props }) {
  const handleLogout = useLogout()

  return (
    <Button
    onClick={handleLogout}
    size="small"
    startIcon={<LogoutIcon fontSize="small" />}
    className="normal-case"
    sx={{
      color: '#b3261e',
      bgcolor: 'rgba(179, 38, 30, 0.08)',
      border: '1px solid rgba(179, 38, 30, 0.25)',
      '&:hover': {
        bgcolor: 'rgba(179, 38, 30, 0.16)',
        borderColor: 'rgba(179, 38, 30, 0.4)',
      },
      ...sx,
    }}
    {...props}
    >
    Log out
    </Button>
  )
}

export default Logout