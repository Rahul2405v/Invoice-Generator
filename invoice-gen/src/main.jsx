import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import 'animate.css';
import App from './App.jsx'
import {AppContextProvider} from './context/AppContextProvider.jsx';
import { ClerkProvider } from '@clerk/clerk-react'

const publishable_key=import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if(!publishable_key) {
  throw new Error('VITE_CLERK_PUBLISHABLE_KEY is not defined in .env file');
}

createRoot(document.getElementById('root')).render(
  <AppContextProvider>
    <ClerkProvider publishableKey={publishable_key}>
      <App />
    </ClerkProvider>
  </AppContextProvider>,
)
