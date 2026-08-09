import { Link } from 'react-router-dom';
import { Typography, Button, IconButton, Container, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../../assets/Cart/CartContext';
import BackButton from '../../assets/Navbar/BackButton';
import './Cart.css';

function Cart() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" className="page-enter">
        <BackButton />
        <div className="cart-empty">
          <svg className="cart-empty-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <Typography variant="h6" sx={{ color: 'var(--text-h)' }}>
            Your cart is empty
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text)' }}>
            Add something you like and it'll show up here.
          </Typography>
          <Button component={Link} to="/dashboard" variant="contained" sx={{ mt: 1 }}>
            Browse products
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" className="cart-page page-enter py-8">
      <BackButton />
      <Typography variant="h5" sx={{ color: 'var(--text-h)' }}>
        Your cart
      </Typography>

      {items.map((item) => (
        <div key={item.id} className="cart-item">
            <div className="flex flex-col">
                <Typography variant="subtitle2" sx={{ color: 'var(--text-h)' }}>
                    {item.name}
                </Typography>

                <Typography variant="body2" sx={{ color: 'var(--text)' }}>
                    ${Number(item.price).toFixed(2)} each
                </Typography>
            </div>

            <div className="flex items-center gap-2">
                <TextField
                type="number"
                size="small"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                sx={{ width: 70 }}
            />
            
                <IconButton size="small" color="error" onClick={() => removeItem(item.id)}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </div>
        </div>
      ))}

        <div className="cart-summary">
            <Typography variant="h6" sx={{ color: 'var(--text-h)' }}>
                Total: ${total.toFixed(2)}
            </Typography>

            <div className="flex gap-2">
                <Button onClick={clearCart}>Clear</Button>
                <Button variant="contained">Checkout</Button>
            </div>
        </div>
    </Container>
  )
}

export default Cart