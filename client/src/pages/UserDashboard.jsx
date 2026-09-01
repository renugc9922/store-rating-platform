import { useEffect, useState } from "react";
import api from "../services/api";
import PasswordUpdateForm from "../components/PasswordUpdateForm";

function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);

  const fetchStores = async (filters = {}) => {
    try {
      setLoading(true);
      setMessage("");

      const params = {};

      if (filters.name) {
        params.name = filters.name;
      }

      if (filters.address) {
        params.address = filters.address;
      }

      const response = await api.get("/stores", { params });
      setStores(response.data.stores || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to fetch stores. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isCurrent = true;

    api.get("/stores")
      .then((response) => {
        if (isCurrent) {
          setStores(response.data.stores || []);
        }
      })
      .catch((error) => {
        if (isCurrent) {
          setMessage(
            error.response?.data?.message ||
            "Unable to fetch stores. Please try again."
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

  const handleSearch = () => {
    fetchStores({
      name: searchName.trim(),
      address: searchAddress.trim()
    });
  };

  const handleReset = () => {
    setSearchName("");
    setSearchAddress("");
    fetchStores();
  };

  const handleRateStore = (store) => {
    setSelectedStore(store);
    setSelectedRating(store.user_rating ? Number(store.user_rating) : 0);
    setMessage("");
  };

  const handleSubmitRating = async () => {
    if (!selectedStore) return;

    if (selectedRating < 1 || selectedRating > 5) {
      setMessage("Please select a rating between 1 and 5.");
      return;
    }

    try {
      setRatingLoading(true);
      setMessage("");

      if (selectedStore.user_rating_id) {
        await api.put(`/ratings/${selectedStore.user_rating_id}`, {
          rating: selectedRating
        });

        setMessage("Rating updated successfully! ⭐");
      } else {
        await api.post("/ratings", {
          store_id: selectedStore.id,
          rating: selectedRating
        });

        setMessage("Rating submitted successfully! ⭐");
      }

      setSelectedStore(null);
      setSelectedRating(0);
      fetchStores({
        name: searchName.trim(),
        address: searchAddress.trim()
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to submit rating. Please try again."
      );
    } finally {
      setRatingLoading(false);
    }
  };

  const handleCancelRating = () => {
    setSelectedStore(null);
    setSelectedRating(0);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            User Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Discover stores and share your ratings.
          </p>
        </div>

        <PasswordUpdateForm />

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Find a Store
          </h2>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              type="text"
              value={searchName}
              onChange={(event) => setSearchName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search by store name..."
              className="rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              type="text"
              value={searchAddress}
              onChange={(event) => setSearchAddress(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search by store address..."
              className="rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleSearch}
              className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Search
            </button>

            {(searchName || searchAddress) && (
              <button
                onClick={handleReset}
                className="rounded-md border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {message}
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Available Stores
          </h2>

          {loading && (
            <p className="mt-4 text-gray-600">
              Loading stores...
            </p>
          )}

          {!loading && stores.length === 0 && (
            <div className="mt-4 rounded-lg bg-white p-6 shadow-sm">
              <p className="text-gray-600">
                No stores found.
              </p>
            </div>
          )}

          {!loading && stores.length > 0 && (
            <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="rounded-lg bg-white p-5 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {store.name}
                  </h3>

                  <p className="mt-2 text-sm text-gray-600">
                    {store.address}
                  </p>

                  <p className="mt-4 font-medium text-yellow-600">
                    ⭐ Average Rating:{" "}
                    {store.average_rating !== null && store.average_rating !== undefined
                      ? `${Number(store.average_rating).toFixed(2)}/5`
                      : "No ratings yet"}
                  </p>

                  {store.user_rating !== null && store.user_rating !== undefined ? (
                    <p className="mt-2 text-sm text-gray-600">
                      Your Rating: {Number(store.user_rating).toFixed(0)}/5
                    </p>
                  ) : null}

                  <button
                    onClick={() => handleRateStore(store)}
                    className="mt-5 w-full rounded-md border border-blue-600 py-2 font-medium text-blue-600 transition hover:bg-blue-50"
                  >
                    {store.user_rating !== null && store.user_rating !== undefined
                      ? "Update Rating"
                      : "Rate Store"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedStore && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900">
                Rate {selectedStore.name}
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Select a rating from 1 to 5.
              </p>

              <div className="mt-6 flex justify-between gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(rating)}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border font-semibold transition
                      ${
                        selectedRating === rating
                          ? "border-yellow-500 bg-yellow-400 text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    {rating}
                  </button>
                ))}
              </div>

              {selectedRating > 0 && (
                <p className="mt-5 text-center font-medium text-gray-700">
                  Your rating: ⭐ {selectedRating}/5
                </p>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleCancelRating}
                  disabled={ratingLoading}
                  className="flex-1 rounded-md border border-gray-300 py-3 font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmitRating}
                  disabled={ratingLoading}
                  className="flex-1 rounded-md bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {ratingLoading
                    ? "Submitting..."
                    : selectedStore.user_rating !== null && selectedStore.user_rating !== undefined
                      ? "Update Rating"
                      : "Submit Rating"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default UserDashboard;
