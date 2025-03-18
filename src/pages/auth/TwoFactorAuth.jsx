import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import authService from "../../services/authService";

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get authentication token from location state
  const { token, email } = location.state || {};

  // Redirect if no token is provided
  if (!token || !email) {
    navigate("/login");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code) {
      setError("Verification code is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await authService.verify2FA({
        email,
        code,
        token,
      });

      // Let the auth service handle token storage based on rememberMe preference
      // The verify2FA method already handles token storage properly

      // Navigate to intended destination or home
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-primary-gradient">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaShieldAlt className="text-6xl text-primary-gradient" />
          </div>
          <h1 className="text-3xl font-bold text-primary-gradient">Two-Factor Authentication</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Enter the code from your authenticator app</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full text-center py-3 text-2xl tracking-widest rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-purple-500"
              placeholder="000000"
              maxLength={6}
              autoFocus
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center"
            >
              {loading ? <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span> : "Verify"}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="text-primary-gradient hover:underline text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
