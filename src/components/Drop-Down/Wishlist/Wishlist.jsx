import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Container } from '@mui/material';
import { useCart } from '../../../assets/Cart/CartContext';
import BackButton from '../../../assets/Navbar/BackButton';
import './Wishlist.css';

function wishlistKey(userId) {
  return userId ? `wishlist_${userId}` : 'wishlist_guest';
}

// Persists
function Wishlist() {
    const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('wishlist')
        return saved ? JSON.parse(saved) : []
    })
    const { addItem } = useCart();

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(items))
    }, [items])

    const removeFromWishlist = (productId) => {
        setItems((prev) => prev.filter((i) => i.id !== productId))
    }

    if (items.length === 0) {
        return (
        <Container maxWidth="sm" className="page-enter">
            <BackButton />
            <div className="wishlist-empty">
                <svg className="wishlist-empty-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <Typography variant="h6" sx={{ color: 'var(--text-h)' }}>
                    Your wishlist is empty
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text)' }}>
                    Save things you want to come back to later.
                </Typography>
                <Button component={Link} to="/dashboard" variant="contained" sx={{ mt: 1 }}>
                    Browse products
                </Button>
            </div>
        </Container>
        )
    }

    return (
        <Container maxWidth="sm" className="wishlist-page page-enter py-8">
        <BackButton />
        <Typography variant="h5" sx={{ color: 'var(--text-h)' }}>
            Wishlist
        </Typography>
        {items.map((item) => (
            <div key={item.id} className="wishlist-item">
                <Typography variant="subtitle2" sx={{ color: 'var(--text-h)' }}>
                    {item.name}
                </Typography>
                <div className="flex gap-2">
                    <Button size="small" variant="contained" onClick={() => addItem(item)}>
                        Add to cart
                    </Button>
                    <Button size="small" onClick={() => removeFromWishlist(item.id)}>
                        Remove
                    </Button>
                </div>
            </div>
        ))}
        </Container>
    )
}

export default Wishlist