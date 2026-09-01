import { useEffect, useState } from "react";
import api from "../services/api";
import PasswordUpdateForm from "../components/PasswordUpdateForm";

function OwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    api.get("/owner/store")
      .then((storeResponse) => {
        const ownerStores = storeResponse.data.stores || [];

        return api.get("/owner/ratings")
          .then((ratingsResponse) => ({
            ownerStores,
            storeRatings: ratingsResponse.data.stores || []
          }));
      })
      .then(({ ownerStores, storeRatings }) => {
        if (isCurrent) {
          const mergedStores = ownerStores.map((store) => {
            const storeDetails = storeRatings.find((item) => item.id === store.id);

            return {
              ...store,
              average_rating: storeDetails?.average_rating ?? null,
              ratings: storeDetails?.ratings || []
            };
          });

          setStores(mergedStores);
        }
      })
      .catch((error) => {
        if (isCurrent) {
          setMessage(
            error.response?.data?.message ||
            "Unable to load dashboard. Please try again."
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Owner Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your store and view customer ratings.
          </p>
        </div>

        <PasswordUpdateForm />

        {loading && (
          <p className="text-gray-600">
            Loading dashboard...
          </p>
        )}

        {message && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">
            {message}
          </div>
        )}

        {!loading && stores.length === 0 && !message && (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-gray-600">
              You do not have any stores assigned yet.
            </p>
          </div>
        )}

        {!loading && stores.length > 0 && (
          <div className="space-y-8">
            {stores.map((store) => (
              <div key={store.id} className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {store.name}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    {store.address}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {store.email}
                  </p>

                  <div className="mt-5 rounded-lg bg-yellow-50 p-4">
                    <p className="text-lg font-semibold text-yellow-700">
                      ⭐ Average Rating:{" "}
                      {store.average_rating !== null && store.average_rating !== undefined
                        ? `${Number(store.average_rating).toFixed(2)}/5`
                        : "No ratings yet"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-xl font-semibold text-gray-800">
                    Customer Ratings
                  </h3>

                  {store.ratings && store.ratings.length > 0 ? (
                    <div className="space-y-4">
                      {store.ratings.map((rating) => (
                        <div
                          key={rating.id}
                          className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {rating.user_name}
                              </h4>
                              <p className="mt-1 text-sm text-gray-500">
                                Customer Rating
                              </p>
                            </div>

                            <div className="text-lg font-semibold text-yellow-600">
                              ⭐ {rating.rating}/5
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <p className="text-gray-600">
                        No ratings received yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default OwnerDashboard;
