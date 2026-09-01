import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    api.get(`/admin/users/${id}`)
      .then((response) => {
        if (isCurrent) {
          setUser(response.data.user);
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);

        if (isCurrent) {
          setMessage(
            error.response?.data?.message ||
            "Unable to fetch user details."
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
  }, [id]);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Back button */}
        <button
          onClick={() => navigate("/admin/users")}
          className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Users
        </button>

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            User Details
          </h1>

          <p className="mt-2 text-gray-600">
            View complete information about this user.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-gray-600">
            Loading user details...
          </p>
        )}

        {/* Error */}
        {message && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">
            {message}
          </div>
        )}

        {/* User details */}
        {!loading && user && (
          <>
            <div className="rounded-lg bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h2>

                  <p className="mt-1 text-gray-500">
                    Registered Platform User
                  </p>
                </div>

                <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
                  {user.role}
                </span>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Email
                  </p>

                  <p className="mt-1 text-gray-900">
                    {user.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Address
                  </p>

                  <p className="mt-1 text-gray-900">
                    {user.address || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Role
                  </p>

                  <p className="mt-1 text-gray-900">
                    {user.role}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    User ID
                  </p>

                  <p className="mt-1 text-gray-900">
                    {user.id}
                  </p>
                </div>

              </div>

            </div>

            {/* Owner store details */}
            {user.role === "OWNER" && (
              <div className="mt-8">

                <h2 className="text-xl font-semibold text-gray-800">
                  Store Details
                </h2>

                {user.stores && user.stores.length > 0 ? (
                  <div className="mt-4 space-y-4">

                    {user.stores.map((store) => (
                      <div
                        key={store.id}
                        className="rounded-lg bg-white p-5 shadow-sm"
                      >
                        <h3 className="text-lg font-semibold text-gray-900">
                          {store.name}
                        </h3>

                        <p className="mt-3 font-medium text-yellow-600">
                          ⭐ Average Rating:{" "}
                          {store.average_rating
                            ? `${Number(store.average_rating).toFixed(2)}/5`
                            : "No ratings yet"}
                        </p>

                      </div>
                    ))}

                  </div>
                ) : (
                  <div className="mt-4 rounded-lg bg-white p-5 shadow-sm">
                    <p className="text-gray-600">
                      This owner does not have a store yet.
                    </p>
                  </div>
                )}

              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}

export default AdminUserDetails;
