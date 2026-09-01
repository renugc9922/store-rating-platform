import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Update form values
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  // Handle login
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      // Send login request to backend
      const response = await api.post("/auth/login", formData);

      // Get token and user information
      const { token, user, message: successMessage } = response.data;

      // Save token
      localStorage.setItem("token", token);

      // Save logged-in user
      localStorage.setItem("user", JSON.stringify(user));

      // Show success message
      setMessage(successMessage);

      // Redirect based on user role
      setTimeout(() => {
        if (user.role === "ADMIN") {
          navigate("/admin-dashboard");
        } else if (user.role === "OWNER") {
          navigate("/owner-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }, 1000);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">

        {/* Heading */}
        <h1 className="text-center text-3xl font-bold text-gray-900">
          Welcome Back
        </h1>

        <p className="mt-2 text-center text-gray-600">
          Login to access your account.
        </p>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Message */}
          {message && (
            <p className="text-sm text-gray-600">
              {message}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </main>
  );
}

export default Login;