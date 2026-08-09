import { useState, useEffect } from 'react';
import { Typography, Button, Container } from '@mui/material';
import { useCart } from '../../../assets/Cart/CartContext';

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
        <Container maxWidth="sm" className="text-center py-16">
            <Typography variant="h6" sx={{ color: 'var(--text-h)' }}>
                Your wishlist is empty
            </Typography>
        </Container>
        )
    }

    return (
        <Container maxWidth="sm" className="flex flex-col gap-4 py-8">
        <Typography variant="h5" sx={{ color: 'var(--text-h)' }}>
            Wishlist
        </Typography>
        {items.map((item) => (
            <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded"
            style={{ border: '1px solid var(--border)' }}
            >
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