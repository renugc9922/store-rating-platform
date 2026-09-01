import { Link, useNavigate } from "react-router-dom";
import { getStoredUser } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();

  const user = getStoredUser();
  const isLoggedIn = Boolean(user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
      {/* Website logo / name */}
      <Link to="/" className="text-xl font-bold text-gray-800">
        Store Rating Platform
      </Link>

      {/* Navigation links */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-gray-600 transition hover:text-blue-600"
        >
          Home
        </Link>

        {isLoggedIn ? (
          <>
            <span className="text-sm font-medium text-gray-700">
              Welcome, {user?.name || user?.email || "User"}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-600 transition hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
