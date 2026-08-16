import { AppBar, Toolbar, Typography, Stack } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import Search from '../Search/Search'
import DarkMode from '../../reusable/DarkModeToggle'
import Logout from '../../reusable/LogoutButton'

function Navbar({ onSearch }) {
  const { user } = useAuth()

  return (
    <AppBar
      position="static"
      elevation={0}
      className="border-b"
      sx={{ bgcolor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-h)' }}
    >
      <Toolbar className="flex flex-col sm:flex-row gap-3 py-2 sm:py-0">
        <Typography variant="h6" className="whitespace-nowrap" sx={{ fontSize: 18 }}>
          Project showcase
        </Typography>

        <div className="flex-1 flex justify-center sm:justify-start">
          <Search onSearch={onSearch} />
        </div>

        <Stack direction="row" alignItems="center" gap={1.5}>
          {user && (
            <Typography variant="body2" className="hidden sm:inline" sx={{ color: 'var(--text)' }}>
              {user.username}
            </Typography>
          )}
          <DarkMode />
          <Logout />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar