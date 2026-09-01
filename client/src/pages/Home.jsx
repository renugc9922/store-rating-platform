import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
          Discover and Rate Your Favorite Stores
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Find stores, share your experience, and help others make better
          choices through honest ratings.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            to="/register"
            className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="rounded-md border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;