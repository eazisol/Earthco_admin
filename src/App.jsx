import { BrowserRouter as Router, Routes, Route, Link, useLocation, NavLink } from 'react-router-dom'
import Branding from './Branding'
import Register from './Register'
import Dashboard from './Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { useEffect, useState } from 'react'

function Layout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // try {
    //   const preloader = document.getElementById('preloader');
    //   if (preloader && preloader.parentNode) {
    //     preloader.parentNode.removeChild(preloader);
    //   }
    // } catch (e) {
    //   // ignore
    // }
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
  const showNavFooter = location.pathname === '/' || location.pathname === '/register';

  const handleMobileToggle = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      {showNavFooter && (
        <header id="header" className="fixed-top ">
          <div className="container d-flex align-items-center">
            <h1 className="logo me-auto">
              <a href="" className="logo me-auto">
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
                <li><a className="nav-link" href="/register">Register</a></li>
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
                  <form action="" method="post">
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
                      <i className="bx bx-chevron-right"></i> <a href="#">Home</a>
                    </li>
                    <li>
                      <i className="bx bx-chevron-right"></i>{" "}
                      <a href="#about">About us</a>
                    </li>
                    <li>
                      <i className="bx bx-chevron-right"></i>{" "}
                      <a href="#services">Services</a>
                    </li>
                    <li>
                      <i className="bx bx-chevron-right"></i>{" "}
                      <a href="/register">Register</a>
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
                    <a href="#" className="twitter">
                      <i className="bx bxl-twitter"></i>
                    </a>
                    <a href="#" className="google-plus">
                      <i className="bx bxl-skype"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container footer-bottom clearfix">
            <div className="copyright">
              &copy; Copyright{" "}
              <strong>
                <span>2024 EARTHCO COMMERCIAL LANDSCAPE</span>
              </strong>
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
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Branding />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
