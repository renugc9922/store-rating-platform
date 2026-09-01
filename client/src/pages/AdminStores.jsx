import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const initialFormData = {
  name: "",
  email: "",
  address: "",
  owner_id: ""
};

function AdminStores() {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedStore, setSelectedStore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [formData, setFormData] = useState(initialFormData);

  const fetchStores = async (customParams = {}) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const params = {
        sortBy,
        order,
        ...customParams,
      };

      if (nameFilter.trim()) {
        params.name = nameFilter.trim();
      }

      if (emailFilter.trim()) {
        params.email = emailFilter.trim();
      }

      if (addressFilter.trim()) {
        params.address = addressFilter.trim();
      }

      const response = await api.get("/admin/stores", { params });
      setStores(response.data.stores || []);
    } catch (error) {
      console.error("Error fetching stores:", error);
      setErrorMessage(
        error.response?.data?.message || "Unable to fetch stores."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isCurrent = true;

    api.get("/admin/stores", {
      params: {
        sortBy: "created_at",
        order: "desc"
      }
    })
      .then((response) => {
        if (isCurrent) {
          setStores(response.data.stores || []);
        }
      })
      .catch((error) => {
        console.error("Error fetching stores:", error);

        if (isCurrent) {
          setErrorMessage(
            error.response?.data?.message || "Unable to fetch stores."
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setLoading(false);
        }
      });

    api.get("/admin/users", {
      params: {
        role: "OWNER",
        sortBy: "name",
        order: "asc"
      }
    })
      .then((response) => {
        if (isCurrent) {
          setOwners(response.data.users || []);
        }
      })
      .catch((error) => {
        console.error("Error fetching owners:", error);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const handleSearch = () => {
    fetchStores();
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      setNameFilter("");
      setEmailFilter("");
      setAddressFilter("");
      setSortBy("created_at");
      setOrder("desc");

      const response = await api.get("/admin/stores", {
        params: {
          sortBy: "created_at",
          order: "desc"
        }
      });

      setStores(response.data.stores || []);
    } catch (error) {
      console.error("Error resetting store filters:", error);
      setErrorMessage(
        error.response?.data?.message || "Unable to reset store filters."
      );
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedStore(null);
    setFormData(initialFormData);
    setShowModal(true);
    setErrorMessage("");
  };

  const openEditModal = (store) => {
    setModalMode("edit");
    setSelectedStore(store);
    setFormData({
      name: store.name,
      email: store.email,
      address: store.address,
      owner_id: String(store.owner_id || "")
    });
    setShowModal(true);
    setErrorMessage("");
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStore(null);
    setFormData(initialFormData);
    setErrorMessage("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.address || !formData.owner_id) {
      setErrorMessage("Please complete all store fields before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const payload = {
        ...formData,
        owner_id: Number(formData.owner_id)
      };

      if (modalMode === "create") {
        await api.post("/stores", payload);
        setSuccessMessage("Store created successfully.");
      } else {
        await api.put(`/stores/${selectedStore.id}`, payload);
        setSuccessMessage("Store updated successfully.");
      }

      closeModal();
      await fetchStores();
    } catch (error) {
      console.error("Error saving store:", error);
      setErrorMessage(
        error.response?.data?.message || "Unable to save store."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (storeId) => {
    const confirmed = window.confirm("Are you sure you want to delete this store?");

    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage("");
      await api.delete(`/stores/${storeId}`);
      setSuccessMessage("Store deleted successfully.");
      await fetchStores();
    } catch (error) {
      console.error("Error deleting store:", error);
      setErrorMessage(
        error.response?.data?.message || "Unable to delete store."
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="mb-5 text-sm font-medium text-blue-600 transition hover:text-blue-800"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-gray-900">Store Management</h1>
          <p className="mt-2 text-gray-600">
            Search, sort, and manage all registered stores.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-700">
            {successMessage}
          </div>
        )}

        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-gray-800">
            Search & Filter Stores
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Store Name
              </label>
              <input
                type="text"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder="Search by name"
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="text"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                placeholder="Search by email"
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                value={addressFilter}
                onChange={(e) => setAddressFilter(e.target.value)}
                placeholder="Search by address"
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="address">Address</option>
                <option value="average_rating">Average Rating</option>
                <option value="created_at">Created Date</option>
              </select>
            </div>

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

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Search
            </button>

            <button
              onClick={handleReset}
              className="rounded-md border border-gray-300 bg-white px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Reset
            </button>

            <button
              onClick={openCreateModal}
              className="rounded-md bg-green-600 px-5 py-2 font-medium text-white transition hover:bg-green-700"
            >
              Add New Store
            </button>
          </div>
        </div>

        {loading && (
          <p className="text-gray-600">Loading stores...</p>
        )}

        {!loading && stores.length > 0 && (
          <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">Store Name</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">Store Email</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">Store Address</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">Store Owner Name</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">Average Rating</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>

              <tbody>
                {stores.map((store) => (
                  <tr key={store.id} className="border-b last:border-none hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-800">{store.name}</td>
                    <td className="px-5 py-4 text-gray-600">{store.email}</td>
                    <td className="px-5 py-4 text-gray-600">{store.address}</td>
                    <td className="px-5 py-4 text-gray-600">{store.owner_name || "Unknown owner"}</td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-yellow-600">
                        {store.average_rating !== null && store.average_rating !== undefined
                          ? `⭐ ${Number(store.average_rating).toFixed(2)}/5`
                          : "No ratings yet"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEditModal(store)}
                          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(store.id)}
                          className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && stores.length === 0 && !errorMessage && (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-gray-600">No stores found.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalMode === "create" ? "Add New Store" : "Edit Store"}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                className="text-xl font-medium text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Store Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Store Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Store Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Store Owner
                </label>
                <select
                  name="owner_id"
                  value={formData.owner_id}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                >
                  <option value="">Select owner</option>
                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? modalMode === "create"
                      ? "Creating..."
                      : "Saving..."
                    : modalMode === "create"
                      ? "Create Store"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminStores;
