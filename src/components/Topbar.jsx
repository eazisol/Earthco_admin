import React, { useEffect } from "react";

import avatar4 from "../assets/img/4.jpg";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Topbar = () => {
  const { loginUser, setLoginUser  } = useAppContext();
useEffect(() => {
  const user = localStorage.getItem('user');
  if (user) {
    setLoginUser(JSON.parse(user));
  }
}, [])
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  }
    return (  
  <div className="header">
    <div className="header-content">
      <nav className="navbar navbar-expand">
        <div className="collapse navbar-collapse justify-content-between">
          <div className="header-left">
            {/* <div className="input-group search-area">
                     <span className="input-group-text">
                       <a href="javascript:void(0)">
                         <svg
                           width="19"
                           height="19"
                           viewBox="0 0 19 19"
                           fill="none"
                           xmlns="http://www.w3.org/2000/svg"
                         >
                           <circle
                             cx="8.78605"
                             cy="8.78605"
                             r="8.23951"
                             stroke="white"
                             strokeLinecap="round"
                             strokeLinejoin="round"
                           />
                           <path
                             d="M14.5168 14.9447L17.7471 18.1667"
                             stroke="white"
                             strokeLinecap="round"
                             strokeLinejoin="round"
                           />
                         </svg>
                       </a>
                     </span>
                     <input
                       type="text"
                       className="form-control"
                       placeholder="Search"
                     />
                   </div> */}
          </div>
          <ul className="navbar-nav header-right">
           
            {/* <li className="nav-item dropdown notification_dropdown">
              <a
                className="nav-link"
                href="javascript:void(0);"
                role="button"
                data-bs-toggle="dropdown"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 14H5V8l7 4 7-4v10zm-7-5L5 9h14l-7 4z"
                    fill="white"
                  />
                </svg>
              </a>
            </li> */}
            <li className="nav-item ps-3">
              <div className="dropdown header-profile2">
                <a
                  className="nav-link"
                  href="javascript:void(0);"
                  role="button"
                  onClick={() => {
                    const dropdown = document.querySelector(
                      ".header-profile2 .dropdown-menu"
                    );
                    dropdown.classList.toggle("show");
                  }}
                >
                  <div className="header-info2 d-flex align-items-center z-3">
                    <div className="header-media">
                      <img src={avatar4} alt="" />
                    </div>
                    <div className="header-info">
                      <h6 className="text-white">{loginUser?.Data?.FirstName} {loginUser?.Data?.LastName}</h6>
                      <p className="text-white">{loginUser?.Data?.Email}</p>
                    </div>
                  </div>
                </a>
                <div
                  className="dropdown-menu dropdown-menu-end"
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    zIndex: 1000,
                  }}
                >
                  <div className="card border-0 mb-0">
                    <div className="card-body px-0 py-2">
                      <a href="" className="dropdown-item ai-icon " onClick={() => {
                        navigate(`/profile?id=${loginUser?.Data?.TenantId}`);
                      }}>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.9848 15.3462C8.11714 15.3462 4.81429 15.931 4.81429 18.2729C4.81429 20.6148 8.09619 21.2205 11.9848 21.2205C15.8524 21.2205 19.1543 20.6348 19.1543 18.2938C19.1543 15.9529 15.8733 15.3462 11.9848 15.3462Z"
                            stroke="var(--primary)"
                            stroke-width="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.9848 12.0059C14.5229 12.0059 16.58 9.94779 16.58 7.40969C16.58 4.8716 14.5229 2.81445 11.9848 2.81445C9.44667 2.81445 7.38857 4.8716 7.38857 7.40969C7.38 9.93922 9.42381 11.9973 11.9524 12.0059H11.9848Z"
                            stroke="var(--primary)"
                            stroke-width="1.42857"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <span className="ms-2">Profile </span>
                      </a>
                      
                    </div>
                    <div className="card-footer px-0 py-2">
                     
                      <a href="" className="dropdown-item ai-icon" onClick={handleLogout}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--primary)"
                          stroke-width="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span className="ms-2" >Logout </span>
                      </a>
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
