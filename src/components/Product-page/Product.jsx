import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { getProducts } from '../../assets/Product/Product';
import { useCart } from '../../assets/Cart/CartContext';
import './Product.css';

function Product({ searchQuery = '' }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addItem } = useCart()

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <CircularProgress />
      </div>
    );
  }

  if (error) 
    return <Alert severity="error" className="m-4">{error}</Alert>

  if (filtered.length === 0) {
    return (
      <div className="product-empty page-enter">
        <Typography variant="h6" sx={{ color: 'var(--text-h)' }}>
          No products found
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text)' }}>
          Try a different search or category.
        </Typography>
      </div>
    );
  }

  return (
    <div className="product-grid page-enter">
      {filtered.map((product) => (
        <Card key={product.id} className="product-card">
          <CardContent className="flex flex-col gap-2">
            <Typography variant="subtitle1" sx={{ color: 'var(--text-h)' }}>
              {product.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--accent)' }}>
              ${Number(product.price).toFixed(2)}
            </Typography>
            <div className="flex gap-2">
              <Button size="small" component={Link} to={`/products/${product.id}`}>
                View
              </Button>
              <Button size="small" variant="contained" onClick={() => addItem(product)}>
                Add to cart
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Product