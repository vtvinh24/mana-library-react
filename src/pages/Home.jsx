import { Link } from "react-router-dom";
import { FaBook, FaSearch, FaBookmark, FaHeart, FaUser, FaBell, FaExchangeAlt, FaChartBar, FaFileImport, FaClipboardList, FaCog } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const role = user?.auth?.role || "user";

  const FeatureCard = ({ to, icon, title, description, color }) => (
    <Link
      to={to}
      className={`bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 ${color} flex items-start gap-4`}
    >
      <div className="text-2xl text-gray-700 dark:text-gray-300">{icon}</div>
      <div>
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </Link>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Mana Library</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Your digital gateway to knowledge and literature. Explore our collection, manage your readings, and enjoy a seamless library experience.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5">Books & Discovery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard
            to="/books"
            icon={<FaBook />}
            title="Browse Books"
            description="Explore our entire collection of books organized by categories and genres."
            color="border-blue-500"
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5">Your Library</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard
            to="/my-books/borrowed"
            icon={<FaBook />}
            title="Borrowed Books"
            description="View and manage your currently borrowed books."
            color="border-green-500"
          />
          <FeatureCard
            to="/my-books/reserved"
            icon={<FaBookmark />}
            title="Reserved Books"
            description="Check your book reservations and their status."
            color="border-yellow-500"
          />
          <FeatureCard
            to="/favorites"
            icon={<FaHeart />}
            title="Favorites"
            description="Access your favorite books for quick reference."
            color="border-red-500"
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5">Your Account</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard
            to="/profile"
            icon={<FaUser />}
            title="Profile"
            description="Manage your account information and settings."
            color="border-purple-500"
          />
          <FeatureCard
            to="/notifications"
            icon={<FaBell />}
            title="Notifications"
            description="Stay updated with important library announcements and due date reminders."
            color="border-orange-500"
          />
        </div>
      </section>

      {(role === "librarian" || role === "admin") && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5">Librarian Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard
              to="/manage-books"
              icon={<FaBook />}
              title="Manage Books"
              description="Add, edit, or remove books from the library catalog."
              color="border-teal-500"
            />
            <FeatureCard
              to="/transactions"
              icon={<FaExchangeAlt />}
              title="Transactions"
              description="Monitor book borrowing, returns, and reservations."
              color="border-cyan-500"
            />
          </div>
        </section>
      )}

      {role === "admin" && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5">Administration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard
              to="/dashboard"
              icon={<FaChartBar />}
              title="Dashboard"
              description="View library statistics and analytics data."
              color="border-blue-600"
            />
            <FeatureCard
              to="/books/import"
              icon={<FaFileImport />}
              title="Import Books"
              description="Bulk import books data into the library system."
              color="border-green-600"
            />
            <FeatureCard
              to="/system-metrics"
              icon={<FaClipboardList />}
              title="System Metrics"
              description="Monitor system performance and usage statistics."
              color="border-yellow-600"
            />
            <FeatureCard
              to="/settings"
              icon={<FaCog />}
              title="Settings"
              description="Configure system-wide settings and preferences."
              color="border-gray-600"
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
