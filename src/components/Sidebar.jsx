import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);

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
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M10.53 2.56H7.11C4.29 2.56 2.52 4.55 2.52 7.38V15C2.52 17.82 4.28 19.82 7.11 19.82H15.2C18.02 19.82 19.78 17.82 19.78 15V11.3"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.09 10.01L14.94 3.16C15.8 2.31 17.18 2.31 18.03 3.16L19.15 4.28C20 5.13 20 6.51 19.15 7.37L12.26 14.25C11.89 14.62 11.39 14.83 10.86 14.83H7.42L7.51 11.37C7.52 10.86 7.73 10.37 8.09 10.01Z"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.9 4.22L18.09 8.4"
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
    <div className="deznav">
      <div className="deznav-scroll">
        <ul className="metismenu" id="menu">
          <li className="menu-title" style={{marginLeft:"30px",fontSize:"15px"}}>Earthco</li>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            const isSubActive = item.submenu?.some(
              (sub) => location.pathname === sub.href
            );
            const isOpen = openSubmenu === item.key;

            // Non-submenu links like Transaction/Packages
            if (!item.submenu) {
              return (
                <li key={item.key} >
                  <Link
                    to={item.href}
                    onClick={() => setOpenSubmenu(null)}
                    style={{
                      backgroundColor: isActive ? "#e6f0ff" : "transparent",
                      color: isActive ? activeColor : inactiveColor,
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                  <span style={{marginLeft:"8px"}}>  {item.icon(isActive ? activeColor : inactiveColor)}
                    <span className="menu-title">{item.label}</span></span>
                  </Link>
                </li>
              );
            }

            // Parent with submenu (Tasks)
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
                    color: inactiveColor,
                  }}
                >
                 <span style={{marginLeft:"8px"}}> {item.icon(inactiveColor)}
                  <span style={{marginLeft:"7px"}} className="menu-title">{item.label}</span></span>
                </div>
                {isOpen && (
                  <ul>
                    {item.submenu.map((sub) => {
                      const subActive = location.pathname === sub.href;
                      return (
                        <li key={sub.href}>
                          <Link
                            to={sub.href}
                            className={`submenu-link ${
                              subActive ? "active" : ""
                            }`}
                            style={{
                              padding: "8px 20px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              color: subActive ? activeColor : inactiveColor,
                              backgroundColor: subActive
                                ? "#e6f0ff"
                                : "transparent",
                              position: "relative",
                            }}
                          >
                            <div className="subMenu" />
                            {sub.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
