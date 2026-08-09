import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeModeProvider } from './assets/Theme/Theme-mode-context';
import { AuthProvider } from './assets/Auth/authContext';
import { CartProvider } from './assets/Cart/CartContext';
import App from './App';
import './App.css';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeModeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeModeProvider>
  </StrictMode>
)