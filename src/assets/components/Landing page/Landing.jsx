import { Link } from 'react-router-dom';
import { Button, Typography, Container } from '@mui/material';

function Landing() {
  return (
    <Container maxWidth="sm" className="flex flex-col items-center text-center gap-4 py-16">
      <Typography variant="h4" sx={{ color: 'var(--text-h)' }}>Project showcase</Typography>

      <Typography variant="body1" sx={{ color: 'var(--text)' }}>Browse products, build a cart, and manage your account.</Typography>

      <div className="flex gap-3">
        <Button component={Link} to="/login" variant="contained">Log in</Button>
        <Button component={Link} to="/signup" variant="outlined">Sign up</Button>
      </div>
    </Container>
  )
}

export default Landing