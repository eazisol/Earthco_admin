import { BrowserRouter as Router, Routes, Route, Link, useLocation, NavLink } from 'react-router-dom'
import Branding from './Branding'
import Register from './Register'
import Dashboard from './Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import RoleBasedRoute from './components/RoleBasedRoute'
import { useEffect, useState } from 'react'
import { LoginScreen } from './Login'
import { PackagesScreen } from './components/Packages'
import { TenantScreen } from './components/TenantUser'
import { TransactionsScreen } from './components/Transactions'
import { EmailScreen } from './components/Setting/emailSetting'
import { QBookScreen } from './components/Setting/QBook'
import { CompanyScreen } from './components/Setting/Company'
import { GoogleSetting } from './components/Setting/googleMap';
import { StripeSetting } from './components/Setting/StripeSetting';
import { CompaniesScreen } from './components/Comanies';
import ForgotPassword from './components/ForgotPassword'
import { TermAndPrivacy } from './components/Setting/termAndPrivacy'
import ProfilePage from './components/Profile/ProfilePage'
import { AppProvider } from './context/AppContext'

function Layout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {

    const selectHeader = document.querySelector('#header');
    if (selectHeader) {
      let headerOffset = selectHeader.offsetTop;
      let nextElement = selectHeader.nextElementSibling;
      const headerScrolled = () => {
        if (window.pageYOffset > headerOffset) {
          selectHeader.classList.add('header-scrolled');
        } else {
          selectHeader.classList.remove('header-scrolled');
        }
      };
      window.addEventListener('load', headerScrolled);
      window.addEventListener('scroll', headerScrolled);
    }

    // Highlight active nav link on scroll
    const handleScroll = () => {
      const sections = ['hero', 'about', 'services', 'contact','pricing'];
      const scrollPos = window.scrollY + 120; // 120px offset for header
      sections.forEach((id) => {
        const section = document.getElementById(id);
        const navLink = document.querySelector(`#navbar a[href="/#${id}"]`);
        if (section && navLink) {
          if (
            scrollPos >= section.offsetTop &&
            scrollPos < section.offsetTop + section.offsetHeight
          ) {
            navLink.classList.add('active');
          } else {
            navLink.classList.remove('active');
          }
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', handleScroll);
    setMobileMenuOpen(false); // Close mobile menu on route change
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('load', handleScroll);
    };
  }, [location]);

  const hideNavFooter = location.pathname.startsWith('/dashboard');
  const showNavFooter = location.pathname === '/' || location.pathname === '/register' || location.pathname === '/login' || location.pathname === '/forgot-password';

  // Add this line to detect register page
  const isRegisterPage = location.pathname === '/register';
  const isLoginPage = location.pathname === '/login';
  const isForgotPasswordPage = location.pathname === '/forgot-password';
  const handleMobileToggle = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      {showNavFooter && (
        <header id="header" className={`fixed-top${isRegisterPage || isLoginPage || isForgotPasswordPage ? ' register-navbar' : ''}`}>
          <div className="container d-flex align-items-center">
            <h1 className="logo me-auto">
              <a href="/#hero" className="logo me-auto">
                <img src="/src/assets/img/favicon.svg" alt="" className="img-fluid" />
              </a>
            </h1>
            <nav id="navbar" className={`navbar${mobileMenuOpen ? ' navbar-mobile' : ''}`}>
              <ul>
                <li><a className="nav-link scrollto active" href="/#hero">Home</a></li>
                <li><a className="nav-link scrollto" href="/#about">About</a></li>
                <li><a className="nav-link scrollto" href="/#services">Services</a></li>
                <li><a className="nav-link scrollto" href="/#pricing">Pricing</a></li>
                <li><a className="nav-link scrollto" href="/#contact">Contact</a></li>
                <li>
                  <button
                    className="btn btn-success nav-link custom-login-btn"
                    style={{
                      background: "#fff",
                      border: "1px solid #6da34d",
                      color: "#6da34d",
                      padding: "10px 28px",
                      borderRadius: "6px",
                      marginLeft: "15px",
                      fontSize: "20px",
                      transition: "background 0.2s, color 0.2s"
                    }}
                    onClick={() => window.location.href = "/login"}
                  >
                    Login
                  </button>
                  <style>
                    {`
                      .custom-login-btn:hover {
                        background: #6da34d !important;
                        color: #fff !important; 
                        border: 1px solid #ffffff !important;
                      }
                    `}
                  </style>
                </li>
                
              </ul>
              <i
                className={`bi ${mobileMenuOpen ? 'bi-x' : 'bi-list'} mobile-nav-toggle`}
                onClick={handleMobileToggle}
                style={{ cursor: 'pointer' }}
              ></i>
            </nav>
          </div>
        </header>
      )}
      {children}
      {/* Add scroll-margin-top for all sections to fix heading hidden under navbar */}
      <style>{`
        section[id] { scroll-margin-top: 100px; }
      `}</style>
      {showNavFooter && (
        <footer id="footer">
          <div className="footer-newsletter ">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <h4>Join Our Newsletter</h4>
                  <p>
                    Join our newsletter to get landscaping tips, seasonal updates,
                    and exclusive offers from Earthco — straight to your inbox.
                  </p>
                  <form >
                    <input type="email" name="email" />
                    <input type="submit" value="Subscribe" />
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-top text-start">
            <div className="container">
              <div className="row">
                <div className="col-lg-4 col-md-6 footer-contact">
                  <a href="" className="logo me-auto">
                    <img
                      src="/src/assets/img/favicon.png"
                      alt=""
                      className="footer-image"
                    />
                  </a>
                  <p>
                    HQ: 130 W. Central <br />
                    Ave Santa Ana CA 92705
                    <br />
                    United States <br />
                    <br />
                    <strong>Phone:</strong> 714-571-0455
                    <br />
                    <strong>Email:</strong> info@earthcompany.org
                    <br />
                  </p>
                </div>
                <div className="col-lg-4 col-md-6 footer-links">
                  <h4>Quick Navigation</h4>
                  <ul>
                    <li>
                      <i className="bx bx-chevron-right"></i> <a href="/#">Home</a>
                    </li>
                    <li>
                      <i className="bx bx-chevron-right"></i>{" "}
                      <a href="/#about">About us</a>
                    </li>
                    <li>
                      <i className="bx bx-chevron-right"></i>{" "}
                      <a href="/#services">Services</a>
                    </li>
                    <li>
                      <i className="bx bx-chevron-right"></i>{" "}
                      <a href="/#pricing">Pricing</a>
                    </li>
                    <li>
                      <i className="bx bx-chevron-right"></i>{" "}
                      <a href="/login">Login</a>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-4 col-md-6 footer-links">
                  <h4>Our Social Networks</h4>
                  <p>
                    Connect with us on social media to stay updated on our latest projects, landscaping tips, and company news.
                  </p>
                  <div className="social-links mt-3">
                    <a
                      target="_blank"
                      href="https://www.facebook.com/EarthcoLandscape/"
                      className="facebook"
                    >
                      <i className="bx bxl-facebook"></i>
                    </a>
                    <a
                      target="_blank"
                      href="https://www.instagram.com/earthcolandscape/"
                      className="instagram"
                    >
                      <i className="bx bxl-instagram"></i>
                    </a>
                    <a
                      target="_blank"
                      href="https://www.linkedin.com/authwall?trk=gf&trkInfo=AQE314XMnHbXpAAAAWxDUWcAAEk2mbZXRmafEkca-v2ZmH6VTF0sxefgKAjuaGP1gYfi7TCBQctAK56pdjYPEshHFefCjfHRUH6jp0BhH9jGmz_zqJtNcFy3X9qgFkgx2vVPdRs=&originalReferer=https://www.earthcompany.org/&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Fearthco-commercial-landscape%3Ftrk%3Dnav_account_sub_nav_company_admin"
                      className="linkedin"
                    >
                      <i className="bx bxl-linkedin"></i>
                    </a>
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container footer-bottom clearfix">
            <div className="copyright">
              &copy; Copyright{" "}
          
                <span>2025 EARTHCO COMMERCIAL LANDSCAPE</span>
              . All Rights Reserved
            </div>
            <div className="credits">
              Designed by{" "}
              <a target="_blank" href="https://eazisols.com/">
                eazisols
              </a>
            </div>
          </div>
        </footer>
      )}
      {/* <div id="preloader"></div> */}
      <a
        href="#"
        className="back-to-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
          <Route path="/" element={<Branding />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/package" element={
            <RoleBasedRoute>
              <PackagesScreen />
            </RoleBasedRoute>
          } />
          <Route path="/tenant" element={
            <RoleBasedRoute>
              <TenantScreen />
            </RoleBasedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/transaction" element={
            <ProtectedRoute>
              <TransactionsScreen />
            </ProtectedRoute>
          } />
          <Route path="/email" element={
            <ProtectedRoute>
              <EmailScreen />
            </ProtectedRoute>
          } />
          <Route path="/qb" element={
            <ProtectedRoute>
              <QBookScreen />
            </ProtectedRoute>
          } />
          <Route path="/company" element={
            <ProtectedRoute>
              <CompanyScreen />
            </ProtectedRoute>
          } />
          <Route path="/google-map" element={
            <ProtectedRoute>
              <GoogleSetting />
            </ProtectedRoute>
          } />
          <Route path="/stripe" element={
            <RoleBasedRoute>
              <StripeSetting />
            </RoleBasedRoute>
          } />
              <Route path="/companies" element={
                <ProtectedRoute>
                  <CompaniesScreen />
                </ProtectedRoute>
              } />
              <Route path="/term-and-privacy" element={
                <ProtectedRoute>
                  <TermAndPrivacy />
                </ProtectedRoute>
              } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
         
        </Routes>
      </Layout>
    </Router>
    </AppProvider>
  )
}

export default App
