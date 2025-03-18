import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Spinner from "./components/Spinner";
import "./index.css";
import NotFound from "./routes/NotFound";
import Demo from "./pages/Demo";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyCode from "./pages/auth/VerifyCode";
import TwoFactorSetup from "./pages/auth/TwoFactorSetup";
import TwoFactorAuth from "./pages/auth/TwoFactorAuth";
import { useTheme } from "./hooks/useTheme";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import BooksPage from "./pages/books/BooksPage";
import Favorites from "./pages/books/Favorites";
import ReservedBooks from "./pages/books/ReservedBooks";
import BorrowedBooks from "./pages/books/BorrowedBooks";
import MyBooksPage from "./pages/books/MyBooksPage";
import BookHistory from "./pages/books/BookHistory";
import ProfilePage from "./pages/user/ProfilePage";
import SettingsPage from "./pages/user/SettingsPage";
import NotificationsPage from "./pages/user/NotificationsPage";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  // if (!isAuthenticated) {
  //   return (
  //     <Navigate
  //       to="/login"
  //       state={{ from: location.pathname }}
  //       replace
  //     />
  //   );
  // }

  return children;
};

// Dashboard protected route with layout
const DashboardProtectedRoute = ({ children }) => {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
};

// Auth redirect component (redirects if already logged in)
const AuthRedirect = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/";

  if (loading) {
    return <Spinner />;
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to={from}
        replace
      />
    );
  }

  return children;
};

// Alert message component for notifications
const AlertMessage = () => {
  const location = useLocation();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear the message after displaying
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  }, [location]);

  if (!message) return null;

  return <div className="fixed top-20 right-4 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 p-4 rounded-lg shadow-lg max-w-xs z-50">{message}</div>;
};

function AppWrapper() {
  return (
    <div>
      <AlertMessage />
      <Suspense fallback={<Spinner />}>
        <Routes>
          {/* Auth routes - no dashboard layout */}
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRedirect>
                <Register />
              </AuthRedirect>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <AuthRedirect>
                <ForgotPassword />
              </AuthRedirect>
            }
          />
          <Route
            path="/verify-code"
            element={
              <AuthRedirect>
                <VerifyCode />
              </AuthRedirect>
            }
          />
          <Route
            path="/2fa-verify"
            element={<TwoFactorAuth />}
          />
          <Route
            path="/demo"
            element={<Demo />}
          />

          {/* Protected routes with dashboard layout */}
          <Route
            path="/"
            element={
              <DashboardProtectedRoute>
                <Home />
              </DashboardProtectedRoute>
            }
          />

          {/* Book browsing routes */}
          <Route
            path="/books"
            element={
              <DashboardProtectedRoute>
                <BooksPage />
              </DashboardProtectedRoute>
            }
          />

          {/* My Library routes */}
          <Route
            path="/my-books"
            element={
              <DashboardProtectedRoute>
                <MyBooksPage />
              </DashboardProtectedRoute>
            }
          />
          <Route
            path="/my-books/borrowed"
            element={
              <DashboardProtectedRoute>
                <BorrowedBooks />
              </DashboardProtectedRoute>
            }
          />
          <Route
            path="/my-books/reserved"
            element={
              <DashboardProtectedRoute>
                <ReservedBooks />
              </DashboardProtectedRoute>
            }
          />
          <Route
            path="/my-books/favorites"
            element={
              <DashboardProtectedRoute>
                <Favorites />
              </DashboardProtectedRoute>
            }
          />
          <Route
            path="/my-books/history"
            element={
              <DashboardProtectedRoute>
                <BookHistory />
              </DashboardProtectedRoute>
            }
          />

          {/* User account routes */}
          <Route
            path="/profile"
            element={
              <DashboardProtectedRoute>
                <ProfilePage />
              </DashboardProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <DashboardProtectedRoute>
                <NotificationsPage />
              </DashboardProtectedRoute>
            }
          />

          {/* Librarian routes */}
          <Route
            path="/manage-books"
            element={
              <DashboardProtectedRoute>
                <div>Manage Books Page (Librarian)</div>
              </DashboardProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <DashboardProtectedRoute>
                <div>Transactions Page (Librarian)</div>
              </DashboardProtectedRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <DashboardProtectedRoute>
                <div>User Management (Librarian)</div>
              </DashboardProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <DashboardProtectedRoute>
                <div>Reservations Management (Librarian)</div>
              </DashboardProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/dashboard"
            element={
              <DashboardProtectedRoute>
                <div>Admin Dashboard</div>
              </DashboardProtectedRoute>
            }
          />
          <Route
            path="/books/import"
            element={
              <DashboardProtectedRoute>
                <div>Import Books (Admin)</div>
              </DashboardProtectedRoute>
            }
          />
          <Route
            path="/books/export"
            element={
              <DashboardProtectedRoute>
                <div>Export Books (Admin)</div>
              </DashboardProtectedRoute>
            }
          />
          <Route
            path="/system-metrics"
            element={
              <DashboardProtectedRoute>
                <div>System Metrics (Admin)</div>
              </DashboardProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <DashboardProtectedRoute>
                <SettingsPage />
              </DashboardProtectedRoute>
            }
          />

          <Route
            path="/2fa-setup"
            element={
              <DashboardProtectedRoute>
                <TwoFactorSetup />
              </DashboardProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </Suspense>
    </div>
  );
}

// Main App component
function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
