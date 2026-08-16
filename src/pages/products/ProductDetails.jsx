import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, CircularProgress, Alert, Container } from '@mui/material';
import { getProducts } from '../../utils/product';
import { useCart } from '../../context/CartContext';
import BackButton from '../../components/reusable/BackButton';
import './ProductDetails.css';

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('')
  const { addItem } = useCart()

  useEffect(() => {
    getProducts(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <CircularProgress />
      </div>
    )
  }

  if (error) return <Alert severity="error" className="m-4">{error}</Alert>;
  if (!product) return null

  return (
    <Container maxWidth="sm" className="flex flex-col gap-3 py-8 page-enter">
      <BackButton />

      <div className="product-detail-card">
        <Typography variant="h5" sx={{ color: 'var(--text-h)' }}>
          {product.name}
        </Typography>
        <Typography variant="h6" sx={{ color: 'var(--accent)' }}>
          ${Number(product.price).toFixed(2)}
        </Typography>
        {product.description && (
          <Typography variant="body1" sx={{ color: 'var(--text)' }}>
            {product.description}
          </Typography>
        )}
        <Button variant="contained" className="self-start" onClick={() => addItem(product)}>
          Add to cart
        </Button>
      </div>
    </Container>
  )
}

export default ProductDetail