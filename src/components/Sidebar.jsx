import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
const Sidebar = () => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const {loginUser} = useAppContext();
  const activeColor = "#77993d";
  const inactiveColor = "#888";

  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      icon: (color) => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M2.5 7.5L10 1.67L17.5 7.5V16.67C17.5 17.11 17.32 17.53 17.01 17.85C16.7 18.16 16.28 18.33 15.83 18.33H4.17C3.72 18.33 3.3 18.16 2.99 17.85C2.68 17.53 2.5 17.11 2.5 16.67V7.5Z"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.5 18.33V10H12.5V18.33"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    ...(loginUser?.Data?.RoleId !== 2 ? [
      {
        key: "packages",
        label: "Packages",
        href: "/package",
        icon: (color) => (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.5 2.53H7.41C5.5 2.52 3.94 4.04 3.9 5.95V15.77C3.85 17.71 5.39 19.31 7.33 19.36H14.73C16.65 19.28 18.17 17.69 18.15 15.77V7.37L13.5 2.53Z"
              stroke={color}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.27 2.52V5.19C13.27 6.49 14.32 7.54 15.62 7.55H18.15"
              stroke={color}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.1 14.08H8.15"
              stroke={color}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.22 10.64H8.15"
              stroke={color}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        key: "tenant",
        label: "Tenant",
        href: "/tenant",
        icon: (color) => (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M10.99 14.07C7.44 14.07 4.41 14.6 4.41 16.75C4.41 18.9 7.42 19.45 10.99 19.45C14.53 19.45 17.56 18.91 17.56 16.77C17.56 14.62 14.55 14.07 10.99 14.07Z"
              stroke={color}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.99 11C13.31 11 15.2 9.12 15.2 6.79C15.2 4.47 13.31 2.58 10.99 2.58C8.66 2.58 6.77 4.47 6.77 6.79C6.76 9.11 8.64 11 10.96 11H10.99Z"
              stroke={color}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
    ] : []),
   
      {
        key: "companies",
        label: "Companies",
        href: "/companies",
        icon: (color) => (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M6.46932 12.2102H0.693665" stroke={color} stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M9.04547 3.32535H14.8211" stroke={color} stroke-linecap="round" stroke-linejoin="round"/>
							<path fill-rule="evenodd" clip-rule="evenodd" d="M4.99912 3.27573C4.99912 2.08805 4.02914 1.125 2.8329 1.125C1.63667 1.125 0.666687 2.08805 0.666687 3.27573C0.666687 4.46342 1.63667 5.42647 2.8329 5.42647C4.02914 5.42647 4.99912 4.46342 4.99912 3.27573Z" stroke={color} stroke-linecap="round" stroke-linejoin="round"/>
							<path fill-rule="evenodd" clip-rule="evenodd" d="M15.3333 12.1743C15.3333 10.9866 14.3641 10.0235 13.1679 10.0235C11.9709 10.0235 11.0009 10.9866 11.0009 12.1743C11.0009 13.3619 11.9709 14.325 13.1679 14.325C14.3641 14.325 15.3333 13.3619 15.3333 12.1743Z" stroke={color} stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
        ),
      },
  
    {
      key: "transaction",
      label: "Transaction",
      href: "/transaction",
      icon: (color) => (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M6.64 13.55L9.38 9.98L12.51 12.44L15.2 8.98"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <ellipse
            cx="18.33"
            cy="3.85"
            rx="1.76"
            ry="1.76"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.68 2.86H7.02C4.26 2.86 2.55 4.82 2.55 7.58V14.98C2.55 17.74 4.22 19.69 7.02 19.69H14.91C17.67 19.69 19.38 17.74 19.38 14.98V8.53"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "setting",
      label: "Setting",
      icon: (color) => (
        <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.8067 7.62358L20.1842 6.54349C19.6577 5.62957 18.4907 5.31429 17.5755 5.83869V5.83869C17.1399 6.09531 16.6201 6.16812 16.1307 6.04106C15.6413 5.91399 15.2226 5.59749 14.9668 5.16134C14.8023 4.88412 14.7139 4.56836 14.7105 4.24601V4.24601C14.7254 3.72919 14.5304 3.22837 14.17 2.85764C13.8096 2.48691 13.3145 2.27783 12.7975 2.27805H11.5435C11.037 2.27804 10.5513 2.47988 10.194 2.83891C9.83669 3.19795 9.63717 3.68456 9.63961 4.19109V4.19109C9.6246 5.23689 8.77248 6.07678 7.72657 6.07667C7.40421 6.07332 7.08846 5.98491 6.81123 5.82038V5.82038C5.89606 5.29598 4.72911 5.61126 4.20254 6.52519L3.53435 7.62358C3.00841 8.53636 3.3194 9.70258 4.23 10.2323V10.2323C4.8219 10.574 5.18653 11.2056 5.18653 11.889C5.18653 12.5725 4.8219 13.204 4.23 13.5458V13.5458C3.32056 14.0719 3.00923 15.2353 3.53435 16.1453V16.1453L4.16593 17.2346C4.41265 17.6798 4.8266 18.0083 5.31619 18.1474C5.80578 18.2866 6.33064 18.2249 6.77462 17.976V17.976C7.21108 17.7213 7.73119 17.6515 8.21934 17.7822C8.70749 17.9128 9.12324 18.233 9.37416 18.6716C9.5387 18.9489 9.62711 19.2646 9.63046 19.587V19.587C9.63046 20.6435 10.487 21.5 11.5435 21.5H12.7975C13.8505 21.5 14.7055 20.6491 14.7105 19.5961V19.5961C14.7081 19.088 14.9089 18.6 15.2682 18.2407C15.6275 17.8814 16.1155 17.6806 16.6236 17.6831C16.9452 17.6917 17.2596 17.7797 17.5389 17.9394V17.9394C18.4517 18.4653 19.6179 18.1543 20.1476 17.2437V17.2437L20.8067 16.1453C21.0618 15.7075 21.1318 15.186 21.0012 14.6963C20.8706 14.2067 20.5502 13.7893 20.111 13.5366V13.5366C19.6718 13.2839 19.3514 12.8665 19.2208 12.3769C19.0902 11.8873 19.1603 11.3658 19.4154 10.9279C19.5812 10.6383 19.8214 10.3982 20.111 10.2323V10.2323C21.0161 9.70286 21.3264 8.54346 20.8067 7.63274V7.63274V7.62358Z"
                    stroke={color}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12.1751"
                    cy="11.889"
                    r="2.63616"
                    stroke={color}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
      ),
      submenu: [
        { label: "Email", href: "/email" },
        { label: "QB", href: "/qb" },
        { label: "Company", href: "/company" },
        { label: "Google Map", href: "/google-map" },
        ...(loginUser?.Data?.RoleId === 1 ? [{ label: "Stripe", href: "/stripe" }] : []),
        // { label: "Term And Privacy", href: "/term-and-privacy" }
      ],
    },
  ];
  useEffect(() => {
    const activeParent = menuItems.find(
      (item) =>
        item.submenu &&
        item.submenu.some((sub) => location.pathname === sub.href)
    );
    if (activeParent) setOpenSubmenu(activeParent.key);
  }, [location.pathname]);

  return (
    <div className="deznav position-fixed" >
      <div className="deznav-scroll">
        <ul className="metismenu" id="menu">
          {/* <li className="menu-title" style={{marginLeft:"30px",fontSize:"15px"}}>Earthco</li> */}
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            const isSubActive = item.submenu?.some(
              (sub) => location.pathname === sub.href
            );
            const isOpen = openSubmenu === item.key;

            if (!item.submenu) {
              return (
                <li key={item.key} className="linkSide">
                  <Link
                    to={item.href}
                    onClick={() => setOpenSubmenu(null)}
                    className={isActive ? "active" : ""}
                    style={{
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                  <span style={{marginLeft:"8px",marginRight:"8px"}}>  {item.icon(isActive ? activeColor : inactiveColor)}
                    <span className="menu-title">{item.label}</span></span>
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.key}>
                <div
                  onClick={() => setOpenSubmenu(isOpen ? null : item.key)}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    backgroundColor: "transparent",
                  }}
                >
                 <span style={{marginLeft:"8px"}}> {item.icon(inactiveColor)}
                  <span style={{marginLeft:"7px"}} className="menu-title text-white" >{item.label}</span></span>
                </div>
                {/* {isOpen && ( */}
                  <ul>
                    {item.submenu.map((sub) => {
                      const subActive = location.pathname === sub.href;
                      return (
                        <li key={sub.href} className="linkSide">
                          <Link
                            to={sub.href}
                            className={`submenu-link ${subActive ? "active" : ""}`}
                            style={{
                              padding: "8px 20px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              // backgroundColor: subActive ? "#e6f0ff" : "transparent",
                              position: "relative",
                            }}
                          >
                            <div className="subMenu" />
                        <span className="subMenu-text">    {sub.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                {/* )} */}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
