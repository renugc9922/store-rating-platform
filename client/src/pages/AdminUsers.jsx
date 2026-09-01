import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createMessage, setCreateMessage] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER"
  });

  // Filter states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");

  // Sorting states
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("asc");

  // ==================== FETCH USERS ====================

  const fetchUsers = async (customParams = {}) => {
    try {
      setLoading(true);
      setMessage("");

      const params = {
        sortBy,
        order,
        ...customParams,
      };

      if (name.trim()) {
        params.name = name.trim();
      }

      if (email.trim()) {
        params.email = email.trim();
      }

      if (address.trim()) {
        params.address = address.trim();
      }

      if (role) {
        params.role = role;
      }

      const response = await api.get("/admin/users", {
        params,
      });

      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to fetch users."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================== LOAD USERS ====================

  useEffect(() => {
    let isCurrent = true;

    api.get("/admin/users", {
      params: {
        sortBy: "id",
        order: "asc"
      }
    })
      .then((response) => {
        if (isCurrent) {
          setUsers(response.data.users || []);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);

        if (isCurrent) {
          setMessage(
            error.response?.data?.message ||
            "Unable to fetch users."
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

  // ==================== SEARCH USERS ====================

  const handleSearch = () => {
    fetchUsers();
  };

  // ==================== RESET FILTERS ====================

  const handleReset = async () => {
    try {
      setLoading(true);
      setMessage("");

      // Reset frontend state
      setName("");
      setEmail("");
      setAddress("");
      setRole("");
      setSortBy("id");
      setOrder("asc");

      // Fetch default user list directly
      const response = await api.get("/admin/users", {
        params: {
          sortBy: "id",
          order: "asc",
        },
      });

      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error resetting users:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to reset users."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setCreateLoading(true);
    setCreateMessage("");

    try {
      const response = await api.post("/admin/users", newUser);

      setCreateMessage(response.data.message);
      setNewUser({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "USER"
      });
      await fetchUsers();
    } catch (error) {
      setCreateMessage(
        error.response?.data?.message || "Unable to create user."
      );
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* PAGE HEADING */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="mb-5 text-sm font-medium text-blue-600 transition hover:text-blue-800"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            User Management
          </h1>

          <p className="mt-2 text-gray-600">
            Search, filter, sort, and manage all registered users.
          </p>
        </div>

        {/* CREATE USER */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-gray-800">
            Create User
          </h2>

          <form onSubmit={handleCreateUser} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Full name"
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              />

              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Email address"
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              />

              <input
                type="text"
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                placeholder="Address"
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              />

              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Password"
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              />

              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              >
                <option value="USER">Normal User</option>
                <option value="ADMIN">Admin User</option>
              </select>
            </div>

            {createMessage && (
              <p className="text-sm text-gray-600">{createMessage}</p>
            )}

            <button
              type="submit"
              disabled={createLoading}
              className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createLoading ? "Creating user..." : "Create User"}
            </button>
          </form>
        </div>

        {/* SEARCH AND FILTER SECTION */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-xl font-semibold text-gray-800">
            Search & Filter Users
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            {/* NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Search by name"
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Search by email"
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address
              </label>

              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Search by address"
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {/* ROLE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Role
              </label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              >
                <option value="">All Roles</option>
                <option value="USER">Normal User</option>
                <option value="OWNER">Store Owner</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

          </div>

          {/* SORTING */}
          <div className="mt-5 grid gap-4 md:grid-cols-2">

            {/* SORT BY */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sort By
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              >
                <option value="id">User ID</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="address">Address</option>
                <option value="role">Role</option>
                <option value="created_at">Registration Date</option>
              </select>
            </div>

            {/* ORDER */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Order
              </label>

              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-6 flex flex-wrap gap-3">

            <button
              onClick={handleSearch}
              disabled={loading}
              className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Search Users
            </button>

            <button
              onClick={handleReset}
              disabled={loading}
              className="rounded-md border border-gray-300 px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reset
            </button>

          </div>

        </div>

        {/* ERROR MESSAGE */}
        {message && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
            {message}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <p className="text-gray-600">
            Loading users...
          </p>
        )}

        {/* USERS TABLE */}
        {!loading && users.length > 0 && (
          <div className="overflow-x-auto rounded-lg bg-white shadow-sm">

            <table className="w-full">

              <thead className="border-b bg-gray-50">
                <tr>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                    Address
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                    Role
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b last:border-none hover:bg-gray-50"
                  >

                    <td className="px-5 py-4 text-gray-800">
                      {user.name}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {user.email}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {user.address}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">

                      <button
                        onClick={() =>
                          navigate(`/admin/users/${user.id}`)
                        }
                        className="rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                      >
                        View Details
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

        {/* NO USERS */}
        {!loading && users.length === 0 && !message && (
          <div className="rounded-lg bg-white p-6 shadow-sm">

            <p className="text-gray-600">
              No users found matching your search.
            </p>

          </div>
        )}

      </div>
    </main>
  );
}

export default AdminUsers;
