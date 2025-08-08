import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate  } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { getRolePermission } from "../APIS/auth";
import * as MuiIcons from '@mui/icons-material';

const Sidebar = ({ isSidebarOpen = true }) => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const { loginUser, rolePermission, setRolePermission, setLoginUser } = useAppContext();
  const navigate = useNavigate();
  const [getPermissionLoading, setGetPermissionLoading] = useState(false);

  const getRolePermissionData = async (id) => {
    setGetPermissionLoading(true);
    const response = await getRolePermission(id);
    setRolePermission(
      response?.data?.SelectedMenuAccess?.filter(
        (permission) => permission.isactive === true
      ) || []
    );
    setGetPermissionLoading(false);
  };

  useEffect(() => {
    if (loginUser?.Data?.RoleId) {
      getRolePermissionData(loginUser?.Data?.RoleId);
    }
  }, [loginUser]);

  // Step 1: Map flat list with icons and keys
  const menuItemsRaw = rolePermission
    .filter(permission => permission.menu)
    .map((permission) => {
      const iconNameRaw = permission.menu.FontAwesome;
      const iconName = iconNameRaw?.replace(/Icon$/, ""); // Remove 'Icon' suffix
      const IconComponent = MuiIcons[iconName] || MuiIcons['HelpOutline'];

      return {
        key: permission.menu.Name.toLowerCase(),
        label: permission.menu.Name,
        href: permission.menu.ActionName,
        icon: <IconComponent />,
        parentId: permission.menu.ParentId,
        menuId: permission.menu.MenuId,
        order: permission.menu.OrderBy || 0,
      };
    });

  // Step 2: Build parent-child hierarchy
  const menuMap = {};
  menuItemsRaw.forEach(item => {
    menuMap[item.menuId] = { ...item, submenu: [] };
  });

  const menuItems = [];
  menuItemsRaw.forEach(item => {
    if (item.parentId) {
      menuMap[item.parentId]?.submenu.push(item);
    } else {
      menuItems.push(menuMap[item.menuId]);
    }
  });

  // Optional: sort by order
  menuItems.sort((a, b) => a.order - b.order);
  menuItems.forEach(item => {
    item.submenu?.sort((a, b) => a.order - b.order);
  });

  // Handle submenu open on page load
  useEffect(() => {
    const activeParent = menuItems.find(
      (item) =>
        item.submenu &&
        item.submenu.some((sub) => location.pathname === sub.href)
    );
    if (activeParent) setOpenSubmenu(activeParent.key);
  }, [location.pathname]);

  return (
    <div className="deznav position-fixed">
      <div className="deznav-scroll">
        <ul className="metismenu" id="menu">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            const isSubActive = item.submenu?.some(
              (sub) => location.pathname === sub.href
            );
            const isOpen = openSubmenu === item.key;

            if (!item.submenu || item.submenu.length === 0) {
              return (
                <li key={item.key} className="linkSide">
                  <Link
                    to={item.href || "#"}
                    onClick={() => setOpenSubmenu(null)}
                    className={isActive ? "active" : ""}
                    style={{
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span style={{ marginLeft: "8px", marginRight: "8px" }}>
                      {item.icon}
                      {isSidebarOpen && (
                        <span className="menu-title">{item.label}</span>
                      )}
                    </span>
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
                  <span style={{ marginLeft: "8px" }}>
                    {item.icon}
                    {isSidebarOpen && (
                      <span
                        style={{ marginLeft: "7px" }}
                        className="menu-title text-white"
                      >
                        {item.label}
                      </span>
                    )}
                  </span>
                </div>
                <ul>
                  {item.submenu?.map((sub) => {
                    const subActive = location.pathname === sub.href;
                    return (
                      <li key={sub.href} className="linkSide">
                        <Link
                          to={sub.href || "#"}
                          className={`submenu-link ${subActive ? "active" : ""}`}
                          style={{
                            padding: "8px 20px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            position: "relative",
                          }}
                        >
                          {isSidebarOpen ? (
                            <>
                              <div className="subMenu" />
                              <span className="subMenu-text">{sub.label}</span>
                            </>
                          ) : (
                            <div
                              className="submenu-line"
                              title={sub.label}
                            ></div>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
