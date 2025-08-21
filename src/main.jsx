import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import './assets/vendor/bootstrap/css/bootstrap.min.css'
import './assets/vendor/bootstrap-icons/bootstrap-icons.css'
import './assets/vendor/boxicons/css/boxicons.min.css'
import './assets/vendor/glightbox/css/glightbox.min.css'
import './assets/vendor/remixicon/remixicon.css'
import './assets/vendor/swiper/swiper-bundle.min.css'
import './assets/vendor/aos/aos.css'
import './assets/css/style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      {/* For demonstration, render both EmailScreen and StripeSetting */}
      {/* <EmailScreen /> */}
      {/* <StripeSetting /> */}
    </AppProvider>
  </StrictMode>,
)
