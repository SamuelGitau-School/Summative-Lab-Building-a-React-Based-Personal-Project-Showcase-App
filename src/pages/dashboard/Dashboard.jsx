import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, CardContent, Button, CircularProgress } from '@mui/material';
import Navbar from '../../components/layout/Navbar/Navbar.jsx';
import Categories from '../../components/layout/dropdown/Categories';
import Profile from '../../components/layout/dropdown/Profile';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getProducts } from '../../utils/product';

import './Dashboard.css';

const categoryIcons = {
  accessories: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  clothing: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  ),
  electronics: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="18" x2="12" y2="21" />
    </svg>
  ),
}

function getCategoryIcon(product) {
  const key = (product.department || '').toLowerCase();
  return categoryIcons[key] || categoryIcons.accessories;
}

function ProductCard({ product, onAddToCart }) {
  return (
    <Card className="dashboard-product-card">
      <CardContent className="flex flex-col gap-2">
        <div className="dashboard-card-icon">{getCategoryIcon(product)}</div>
        <Typography variant="caption" sx={{ color: 'var(--accent)', textTransform: 'uppercase' }}>
          {product.category}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'var(--text-h)' }}>
          {product.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text)' }}>
          ${Number(product.price).toFixed(2)}
        </Typography>
        <div className="flex gap-2 mt-1">
          <Button size="small" component={Link} to={`/products/${product.id}`}>
            View
          </Button>
          <Button size="small" variant="contained" onClick={() => onAddToCart(product)}>
            Add to cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { addItem } = useCart()

  useEffect(() => {
    getProducts()
      .then(setAllProducts)
      .finally(() => setLoading(false));
  }, [])

  // Featured strip
  const featured = (() => {
    const seen = new Set();
    return allProducts.filter((p) => {
      if (seen.has(p.category)) return false;
      seen.add(p.category);
      return true;
    })
  })
  ()


  const filtered = allProducts.filter((p) => {
    const matchesCategory =
      category === 'All' ||
      p.category === category ||
      (p.department || '').toLowerCase() === category.toLowerCase()
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div>
      <Navbar onSearch={setSearch} />

      <div className="dashboard-toolbar">
        <Categories onSelect={setCategory} />
        <Profile />
      </div>

      <div className="dashboard-hero page-enter">
        <Typography variant="h5" sx={{ color: 'var(--text-h)' }}>
          Welcome back{user ? `, ${user.firstName}` : ''}
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text)' }}>
          Here's what's featured today.
        </Typography>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="dashboard-featured">
            <Typography variant="h6" sx={{ color: 'var(--text-h)', mb: 1 }}>
              Featured
            </Typography>
            <div className="dashboard-card-grid">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addItem} />
              ))}
            </div>
          </div>

          <div className="dashboard-catalog">
            <Typography variant="h6" sx={{ color: 'var(--text-h)', mt: 4, mb: 1 }}>
              All Products {category !== 'All' ? `— ${category}` : ''}
            </Typography>

            {filtered.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'var(--text)' }}>
                No products match your search or category.
              </Typography>
            ) : (
              <div className="dashboard-card-grid">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={addItem} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard;