import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/slices/userSlice";
import axios from "axios";

import { Menu, X, LogOut, ScanLine, Search } from "lucide-react";

import Logo from "../assets/logo.svg";
import GoogleLoginButton from "./GoogleLoginButton";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const user = useSelector((state) => state.user);
  const isLoggedIn = Boolean(user?.id);

  const logoutUser = async () => {
    dispatch(clearUser());
    await axios.post("/api/auth/logout/", {}, { withCredentials: true });
    navigate("/welcome");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    navigate(`/history?search=${search}`);
    setSearch("");
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="w-8 h-8 rounded-full" />
            <span className="hidden md:block font-semibold text-lg bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              Receipt & Invoice Digitizer
            </span>
          </Link>


          {/* Search Bar (only when logged in) */}
          {isLoggedIn && (
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full max-w-md relative"
            >
              <Search size={18} className="absolute left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search receipts or invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-none rounded-full bg-gray-100 text-sm focus:outline-none "
              />
            </form>
          )}

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <Link to="/home" className="nav-link">
                  Home
                </Link>
                <Link to="/history" className="nav-link">
                  History
                </Link>

                <Link to="/scan" className="flex items-center gap-1 nav-link bg-blue-500 text-white px-3 py-1.5 rounded-full hover:bg-blue-600 transition">
                  <ScanLine size={18} /> Scan & Upload
                </Link>

                {/* Logout icon */}
                <button
                  onClick={logoutUser}
                  className="text-red-500 hover:text-red-600 transition"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <GoogleLoginButton />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white shadow-sm">
          <div className="flex flex-col items-center justify-center  gap-4 p-4">
            {isLoggedIn ? (
              <>
                <Link to="/home" onClick={() => setMobileOpen(false)}>
                  Home
                </Link>
                <Link to="/history" onClick={() => setMobileOpen(false)}>
                  History
                </Link>

                <Link
                  to="/scan"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2"
                >
                  <ScanLine size={18} /> Scan & Upload
                </Link>

                <button
                  onClick={logoutUser}
                  className="flex items-center gap-2 text-red-500"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <GoogleLoginButton />
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
