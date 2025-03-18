import { useAuth } from "../context/AuthProvider";

const Home = () => {
  const { user } = useAuth();
  const role = user?.auth?.role || "user";

  return (
    <div className="max-w-6xl mx-auto">
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Mana Library</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Your digital gateway to knowledge and literature. Explore our collection, manage your readings, and enjoy a seamless library experience.
        </p>
      </section>
    </div>
  );
};

export default Home;
