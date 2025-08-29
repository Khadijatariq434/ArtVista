import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ArtProvider } from './context/ArtContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
      <ArtProvider>
      <BrowserRouter>
    <App />
    </BrowserRouter>
    </ArtProvider>
    </WishlistProvider>
    </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
