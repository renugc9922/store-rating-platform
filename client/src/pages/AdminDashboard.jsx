import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [statistics, setStatistics] = useState({
    total_users: 0,
    total_stores: 0,
    total_ratings: 0
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch statistics when page loads
  useEffect(() => {
    let isCurrent = true;

    api.get("/admin/dashboard")
      .then((response) => {
        if (isCurrent) {
          setStatistics(response.data.statistics);
        }
      })
      .catch((error) => {
        console.error("Error fetching dashboard statistics:", error);

        if (isCurrent) {
          setMessage(
            error.response?.data?.message ||
            "Unable to load dashboard statistics."
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Dashboard heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Manage users, stores, and monitor platform activity.
          </p>
        </div>

        {/* Error message */}
        {message && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
            {message}
          </div>
        )}

        {/* Statistics cards */}
        <div className="grid gap-5 md:grid-cols-3">

          {/* Total Users */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Users
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {loading ? "--" : statistics.total_users}
            </h2>
          </div>

          {/* Total Stores */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Stores
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {loading ? "--" : statistics.total_stores}
            </h2>
          </div>

          {/* Total Ratings */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Ratings
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {loading ? "--" : statistics.total_ratings}
            </h2>
          </div>

        </div>

        {/* Management sections */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">

          {/* User Management */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              User Management
            </h2>

            <p className="mt-2 text-gray-600">
              View and manage registered users on the platform.
            </p>

            <button
              onClick={() => navigate("/admin/users")}
              className="mt-5 rounded-md bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              View Users
            </button>
          </div>

          {/* Store Management */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              Store Management
            </h2>

            <p className="mt-2 text-gray-600">
              View stores and monitor their average ratings.
            </p>

            <button
              onClick={() => navigate("/admin/stores")}
              className="mt-5 rounded-md bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              View Stores
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}

export default AdminDashboard;
