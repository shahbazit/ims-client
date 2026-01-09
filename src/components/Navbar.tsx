import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

interface TopNavbarProps {
  onToggleSidebar: () => void;
}

export default function TopNavbar({ onToggleSidebar }: TopNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case "/users":
        return "User Management";
      case "/":
        return "Dashboard";
      default:
        return "";
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    authService.logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 px-4 border-bottom">
      <div className="d-flex align-items-center w-100 justify-content-between">

        <div className="d-flex align-items-center">
          {/* Sidebar Toggle */}
          <button
            type="button"
            className="btn btn-light border-0 me-3"
            onClick={onToggleSidebar}
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          {/* Page Title */}
          <h5 className="m-0 fw-bold text-dark">{getPageTitle(location.pathname)}</h5>
        </div>

        {/* Profile Dropdown */}
        <div className="dropdown" ref={dropdownRef}>
          <a
            className={`d-flex align-items-center link-dark text-decoration-none dropdown-toggle ${isDropdownOpen ? 'show' : ''}`}
            href="#"
            role="button"
            aria-expanded={isDropdownOpen}
            onClick={(e) => {
              e.preventDefault();
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            <div className="avatar-sm bg-primary text-white rounded-circle me-2 d-flex align-items-center justify-content-center fw-bold">
              JD
            </div>
            <span className="fw-medium d-none d-sm-inline">
              John Doe
            </span>
          </a>

          <ul
            className={`dropdown-menu dropdown-menu-end border-0 shadow-sm mt-2 ${isDropdownOpen ? 'show' : ''}`}
            data-bs-popper={isDropdownOpen ? "static" : undefined}
          >
            <li>
              <NavLink
                to="/profile"
                className="dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                <i className="fa-regular fa-user me-2 text-secondary"></i>
                Profile
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/settings"
                className="dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                <i className="fa-solid fa-gear me-2 text-secondary"></i>
                Settings
              </NavLink>
            </li>

            <li><hr className="dropdown-divider" /></li>

            <li>
              <a
                href="#"
                className="dropdown-item text-danger"
                onClick={handleLogout}
              >
                <i className="fa-solid fa-arrow-right-from-bracket me-2"></i>
                Sign Out
              </a>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
}
