import { AppBar, Toolbar, Typography, Stack, IconButton, Badge } from '@mui/material';
import { Link } from 'react-router-dom';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import Search from '../Search/Search'
import DarkMode from '../../reusable/DarkModeToggle'
import Profile from '../dropdown/Profile'

function Navbar({ onSearch }) {
  const { user } = useAuth()
  const { count } = useCart()

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
            <IconButton
              component={Link}
              to="/cart"
              size="small"
              aria-label="cart"
              sx={{ color: 'var(--text-h)' }}
            >
              <Badge badgeContent={count} color="primary" max={99}>
                <ShoppingCartOutlinedIcon fontSize="small" />
              </Badge>
            </IconButton>
          )}
          <DarkMode />
          <Profile />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar