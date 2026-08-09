import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../Auth/AuthContext';

function Logout() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  return (
    <Button
    onClick={handleLogout}
    size="small"
    startIcon={<LogoutIcon fontSize="small" />}
    className="normal-case"
    >
    Log out
    </Button>
  )
}

export default Logout