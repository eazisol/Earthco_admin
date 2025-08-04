import React, { useEffect, useState  } from "react";

import avatar4 from "../assets/img/4.jpg";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LanguageIcon from '@mui/icons-material/Language';
import { Tooltip } from "@mui/material";
const Topbar = () => {
  const { loginUser, setLoginUser } = useAppContext();
  console.log("🚀 ~ Topbar ~ loginUser:", loginUser)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        setLoginUser(JSON.parse(user));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, [setLoginUser]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setLoginUser(null);
    setIsDropdownOpen(false);
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    if (loginUser?.Data?.TenantId) {
      navigate(`/profile?id=${loginUser.Data.TenantId}`);
    }
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.header-profile2')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

    return (  
  <div className="header " >
    <div className="header-content">
      <nav className="navbar navbar-expand">
        <div className="collapse navbar-collapse justify-content-end">
        
          <ul className="navbar-nav header-right">
          <li className="nav-item" >
            <Tooltip title="Open Website" placement="bottom">
              <button 
                className="btn btn-link p-0 border-0"
                onClick={() =>
                navigate('/')
                }
              >
                <LanguageIcon />
              </button>
            </Tooltip>
          </li>
              <li className="nav-item ps-3">
                <div className={`dropdown header-profile2 ${isDropdownOpen ? 'show' : ''}`}>
                  <button
                    className="nav-link btn btn-link p-0 border-0"
                    type="button"
                    onClick={toggleDropdown}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    aria-label="User profile menu"
                  >
                    <div className="header-info2 d-flex align-items-center z-3">
                      <div className="header-media">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                          style={{ width: '30px', height: '30px',  }}
                        >
                          {loginUser?.Data?.CompanyName?.charAt(0) }
                        </div>
                      </div>
                      <div className="header-info text-left">
                        <h6 className="text-white mb-0" style={{textAlign:"left"}}>
                          {loginUser?.Data?.CompanyName}
                        </h6>
                        <p className="text-white mb-0 small ">
                          {loginUser?.Data?.Email}
                        </p>
                      </div>
                    </div>
                  </button>
                  <div
                    className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`}
                    style={{
                      position: "absolute",
                      top: "133%",
                      right: 0,
                      zIndex: 1000,
                      minWidth: "200px"
                    }}
                  >
                    <div className="card border-0 mb-0">
                      <div className="card-body px-0 py-2">
                        <button 
                          className="dropdown-item ai-icon d-flex align-items-center w-100 border-0 bg-transparent"
                          onClick={handleProfileClick}
                          style={{ padding: '0.5rem 1rem' }}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="me-2"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M11.9848 15.3462C8.11714 15.3462 4.81429 15.931 4.81429 18.2729C4.81429 20.6148 8.09619 21.2205 11.9848 21.2205C15.8524 21.2205 19.1543 20.6348 19.1543 18.2938C19.1543 15.9529 15.8733 15.3462 11.9848 15.3462Z"
                              stroke="var(--primary)"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M11.9848 12.0059C14.5229 12.0059 16.58 9.94779 16.58 7.40969C16.58 4.8716 14.5229 2.81445 11.9848 2.81445C9.44667 2.81445 7.38857 4.8716 7.38857 7.40969C7.38 9.93922 9.42381 11.9973 11.9524 12.0059H11.9848Z"
                              stroke="var(--primary)"
                              strokeWidth="1.42857"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>Profile</span>
                        </button>
                      </div>
                      <div className="card-footer px-0 py-2">
                        <button 
                          className="dropdown-item ai-icon d-flex align-items-center w-100 border-0 bg-transparent"
                          onClick={handleLogout}
                          style={{ padding: '0.5rem 1rem' }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--primary)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="me-2"
                          >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                          </svg>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
        </div>
      </nav>
    </div>
  </div>
);}

export default Topbar;
