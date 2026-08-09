import { Typography, Button, IconButton, Container, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../../assets/Cart/CartContext';

function Cart() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" className="text-center py-16">
        <Typography variant="h6" sx={{ color: 'var(--text-h)' }}>
          Your cart is empty
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" className="flex flex-col gap-4 py-8">
      <Typography variant="h5" sx={{ color: 'var(--text-h)' }}>
        Your cart
      </Typography>

      {items.map((item) => (
        <div
        key={item.id}
        className="flex items-center justify-between gap-3 p-3 rounded"
        style={{ border: '1px solid var(--border)' }}
        >
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

        <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
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