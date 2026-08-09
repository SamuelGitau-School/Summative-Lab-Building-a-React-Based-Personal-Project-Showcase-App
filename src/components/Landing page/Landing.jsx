import { Link } from 'react-router-dom';
import './Landing.css';

const features = [
  {
    title: 'Browse products',
    description: 'Explore the full catalog, filter by category, and search for exactly what you need.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l1-5h16l1 5" />
        <path d="M3 9h18v11H3z" />
        <path d="M9 13a3 3 0 0 0 6 0" />
      </svg>
    ),
  },
  {
    title: 'Build your cart',
    description: "Add items as you go and check out whenever you're ready.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    title: 'Save favorites',
    description: 'Keep a wishlist of things you want to come back to later.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
]

function Landing() {
  return (
    <div>
      <div className="landing-hero">
        <h1>Project showcase</h1>
        <p>Browse products, build a cart, and manage your account — all in one place.</p>
        <div className="landing-hero-actions">
          <Link to="/signup" className="landing-button landing-button-primary">
            Get started
          </Link>
          <Link to="/login" className="landing-button landing-button-outline">
            Log in
          </Link>
        </div>
      </div>

      <div className="landing-features">
        {features.map(({ icon, title, description }) => (
          <div className="landing-feature-card" key={title}>
            <div className="landing-feature-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Landing