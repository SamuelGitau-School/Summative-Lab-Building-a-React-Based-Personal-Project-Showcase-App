import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import './Profile.css';

function Profile() {
    const { user } = useAuth()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    if (!user) return null

    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()

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
        </Menu>
        </>
    )
}

export default Profile