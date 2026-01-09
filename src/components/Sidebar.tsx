import { NavLink, useMatch } from "react-router-dom";

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link active" : "nav-link";

  // Detect child routes
  const ecommerceMatch =
    useMatch("/products") ||
    useMatch("/orders") ||
    useMatch("/customers");

  const authMatch =
    useMatch("/login") ||
    useMatch("/register") ||
    useMatch("/lock");

  return (
   <nav id="sidebar" className={`sidebar ${isOpen ? "show-nav" : "active"}`}>

      <div className="sidebar-header">
        <h3>
          <i className="fa-solid fa-layer-group me-2 text-primary"></i>
          <span>Admin</span>
        </h3>
      </div>

      <ul className="list-unstyled components">

        {/* Dashboard */}
        <li>
          <NavLink to="/" end className={linkClass}>
            <i className="fa-solid fa-house"></i>
            <span>Dashboard</span>
          </NavLink>
        </li>

        {/* Users */}
        <li>
          <NavLink to="/users" className={linkClass}>
            <i className="fa-solid fa-users"></i>
            <span>Users</span>
          </NavLink>
        </li>

        {/* Reports */}
        <li>
          <NavLink to="/reports" className={linkClass}>
            <i className="fa-solid fa-chart-line"></i>
            <span>Reports</span>
          </NavLink>
        </li>

        {/* Settings */}
        <li>
          <NavLink to="/settings" className={linkClass}>
            <i className="fa-solid fa-gear"></i>
            <span>Settings</span>
          </NavLink>
        </li>

        {/* E-Commerce */}
        <li className={ecommerceMatch ? "active" : ""}>
          <a
            data-bs-toggle="collapse"
            href="#ecommerceSubmenu"
            className={`nav-link d-flex justify-content-between align-items-center ${
              ecommerceMatch ? "" : "collapsed"
            }`}
            aria-expanded={ecommerceMatch ? "true" : "false"}
          >
            <div className="d-flex align-items-center">
              <i className="fa-solid fa-cart-shopping"></i>
              <span className="ms-2">E-commerce</span>
            </div>
            <i className="fa-solid fa-chevron-down small"></i>
          </a>

          <ul
            id="ecommerceSubmenu"
            className={`collapse list-unstyled ps-4 ${
              ecommerceMatch ? "show" : ""
            }`}
          >
            <li>
              <NavLink to="/products" className={linkClass}>Products</NavLink>
            </li>
            <li>
              <NavLink to="/orders" className={linkClass}>Orders</NavLink>
            </li>
            <li>
              <NavLink to="/customers" className={linkClass}>Customers</NavLink>
            </li>
          </ul>
        </li>

        {/* Authentication */}
        <li className={authMatch ? "active" : ""}>
          <a
            data-bs-toggle="collapse"
            href="#authSubmenu"
            className={`nav-link d-flex justify-content-between align-items-center ${
              authMatch ? "" : "collapsed"
            }`}
            aria-expanded={authMatch ? "true" : "false"}
          >
            <div className="d-flex align-items-center">
              <i className="fa-solid fa-lock"></i>
              <span className="ms-2">Authentication</span>
            </div>
            <i className="fa-solid fa-chevron-down small"></i>
          </a>

          <ul
            id="authSubmenu"
            className={`collapse list-unstyled ps-4 ${
              authMatch ? "show" : ""
            }`}
          >
            <li>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
            </li>
            <li>
              <NavLink to="/register" className={linkClass}>Register</NavLink>
            </li>
            <li>
              <NavLink to="/lock" className={linkClass}>Lock Screen</NavLink>
            </li>
          </ul>
        </li>

        {/* Projects */}
        <li>
          <NavLink to="/projects" className={linkClass}>
            <i className="fa-regular fa-folder-open"></i>
            <span>Projects</span>
          </NavLink>
        </li>

      </ul>
    </nav>
  );
}
