import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import authService from "../../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid");
      return;
    }

    try {
      setLoading(true);
      setError("");
      // Call send-code endpoint with email
      await authService.sendResetCode({ email });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-primary-gradient">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-gradient">Reset Password</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Enter your email to receive a reset code</p>
        </div>

        {success ? (
          <div className="text-center space-y-6">
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">Reset code has been sent to your email</div>
            <Link
              to="/verify-code"
              className="btn-primary inline-block"
            >
              Enter Reset Code
            </Link>
            <div className="pt-4">
              <Link
                to="/login"
                className="text-primary-gradient hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaEnvelope />
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-purple-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex justify-center items-center"
                >
                  {loading ? <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span> : "Send Reset Code"}
                </button>
              </div>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-primary-gradient hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
