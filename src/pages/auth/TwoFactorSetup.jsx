import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaKey } from "react-icons/fa";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthProvider";
import Spinner from "../../components/Spinner";

const TwoFactorSetup = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchQRCode = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await authService.get2FASetup();
        setQrCodeUrl(response.qrCode);
        setSecret(response.secret);
      } catch (err) {
        setError(err.message || "Failed to generate 2FA setup");
      } finally {
        setLoading(false);
      }
    };

    fetchQRCode();
  }, [isAuthenticated, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!verificationCode) {
      setError("Verification code is required");
      return;
    }

    try {
      setVerifying(true);
      setError("");
      // Enable 2FA with the verification code
      await authService.enable2FA({
        code: verificationCode,
        secret,
      });
      setSuccess(true);
      // Redirect after success
      setTimeout(() => {
        navigate("/profile", {
          state: { message: "Two-factor authentication has been enabled" },
        });
      }, 3000);
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-primary-gradient">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-gradient">Two-Factor Authentication</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Enhance your account security</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">Two-factor authentication enabled successfully!</div>}

        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <FaShieldAlt className="text-5xl text-primary-gradient" />
            </div>
            <p className="mb-4">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>

            {qrCodeUrl && (
              <div className="flex justify-center my-6 bg-white p-4 rounded-lg">
                <img
                  src={qrCodeUrl}
                  alt="QR Code for 2FA setup"
                  className="max-w-full h-auto"
                />
              </div>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Or manually enter this code: <span className="font-mono font-bold">{secret}</span>
            </p>
          </div>

          <form
            onSubmit={handleVerify}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium mb-1"
              >
                Verification Code
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaKey />
                </span>
                <input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-purple-500"
                  placeholder="Enter code from authenticator app"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={verifying || success}
                className="btn-primary w-full flex justify-center items-center"
              >
                {verifying ? <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span> : "Verify & Enable 2FA"}
              </button>
            </div>
          </form>

          <div className="text-center">
            <button
              onClick={() => navigate("/profile")}
              className="text-primary-gradient hover:underline"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSetup;
