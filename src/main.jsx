import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './assests/Auth/authContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
