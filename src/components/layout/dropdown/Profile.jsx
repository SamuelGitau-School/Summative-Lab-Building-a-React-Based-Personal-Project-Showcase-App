import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Menu, MenuItem, Avatar, Divider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../../context/AuthContext';
import { useLogout } from '../../reusable/LogoutButton';
import './Profile.css';

function Profile() {
    const { user } = useAuth()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleLogout = useLogout()

    if (!user) return null

    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()

    const handleLogoutClick = () => {
        setAnchorEl(null)
        handleLogout()
    }

    return (
        <>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
            <Avatar className="profile-avatar">{initials}</Avatar>
        </IconButton>

        <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
            <MenuItem component={Link} to="/profile" onClick={() => setAnchorEl(null)}>
                Profile
            </MenuItem>
            <MenuItem component={Link} to="/wishlist" onClick={() => setAnchorEl(null)}>
                Wishlist
            </MenuItem>
            <MenuItem component={Link} to="/cart" onClick={() => setAnchorEl(null)}>
                Cart
            </MenuItem>

            <Divider />

            <MenuItem
                onClick={handleLogoutClick}
                sx={{
                    color: '#b3261e',
                    gap: 1,
                    '&:hover': {
                        bgcolor: 'rgba(179, 38, 30, 0.08)',
                    },
                }}
            >
                <LogoutIcon fontSize="small" />
                Log out
            </MenuItem>
        </Menu>
        </>
    )
}

export default Profile