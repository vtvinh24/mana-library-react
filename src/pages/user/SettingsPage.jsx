import { useState } from "react";
import { FaCog, FaBell, FaEye, FaShieldAlt, FaSave, FaTimes } from "react-icons/fa";
import { useTheme } from "../../hooks/useTheme";
import Spinner from "../../components/Spinner";

const SettingsPage = () => {
  const { dark, setDark } = useTheme();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [settings, setSettings] = useState({
    account: {
      language: "English",
      timezone: "UTC-5 (Eastern Time)",
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      notifyBeforeDueDate: true,
      notifyOnOverdue: true,
      notifyOnHoldAvailable: true,
      marketingEmails: false,
    },
    display: {
      theme: dark ? "dark" : "light",
      highContrast: false,
      fontSize: "medium",
    },
    privacy: {
      shareReadingHistory: false,
      allowRecommendations: true,
      storeSearchHistory: true,
    },
  });

  const handleChange = (section, setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value,
      },
    }));

    // Update theme immediately when changed
    if (section === "display" && setting === "theme") {
      setDark(value === "dark");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      // Mock API request delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // In a real app, this would be an API call to save settings
      setSuccess("Settings saved successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-md">{error}</div>}

      {success && <div className="mb-4 p-3 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 rounded-md">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Account Settings */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
              <FaCog className="mr-2" /> Account Settings
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
              <select
                value={settings.account.language}
                onChange={(e) => handleChange("account", "language", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
              <select
                value={settings.account.timezone}
                onChange={(e) => handleChange("account", "timezone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
              >
                <option value="UTC-12 (Baker Island)">UTC-12 (Baker Island)</option>
                <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
                <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                <option value="UTC+0 (Greenwich Mean Time)">UTC+0 (Greenwich Mean Time)</option>
                <option value="UTC+1 (Central European Time)">UTC+1 (Central European Time)</option>
                <option value="UTC+8 (China Standard Time)">UTC+8 (China Standard Time)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
              <FaBell className="mr-2" /> Notification Preferences
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email notifications</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => handleChange("notifications", "emailNotifications", e.target.checked)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="emailNotifications"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notifications.emailNotifications ? "bg-[#a000c3]" : "bg-gray-300 dark:bg-gray-600"}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SMS notifications</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={settings.notifications.smsNotifications}
                    onChange={(e) => handleChange("notifications", "smsNotifications", e.target.checked)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="smsNotifications"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notifications.smsNotifications ? "bg-[#a000c3]" : "bg-gray-300 dark:bg-gray-600"}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notify before due date</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="notifyBeforeDueDate"
                    checked={settings.notifications.notifyBeforeDueDate}
                    onChange={(e) => handleChange("notifications", "notifyBeforeDueDate", e.target.checked)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="notifyBeforeDueDate"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notifications.notifyBeforeDueDate ? "bg-[#a000c3]" : "bg-gray-300 dark:bg-gray-600"}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notify on overdue</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="notifyOnOverdue"
                    checked={settings.notifications.notifyOnOverdue}
                    onChange={(e) => handleChange("notifications", "notifyOnOverdue", e.target.checked)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="notifyOnOverdue"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notifications.notifyOnOverdue ? "bg-[#a000c3]" : "bg-gray-300 dark:bg-gray-600"}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notify when reservations are available</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="notifyOnHoldAvailable"
                    checked={settings.notifications.notifyOnHoldAvailable}
                    onChange={(e) => handleChange("notifications", "notifyOnHoldAvailable", e.target.checked)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="notifyOnHoldAvailable"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notifications.notifyOnHoldAvailable ? "bg-[#a000c3]" : "bg-gray-300 dark:bg-gray-600"}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Receive marketing emails</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="marketingEmails"
                    checked={settings.notifications.marketingEmails}
                    onChange={(e) => handleChange("notifications", "marketingEmails", e.target.checked)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="marketingEmails"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notifications.marketingEmails ? "bg-[#a000c3]" : "bg-gray-300 dark:bg-gray-600"}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
              <FaEye className="mr-2" /> Display Settings
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme</label>
              <select
                value={settings.display.theme}
                onChange={(e) => handleChange("display", "theme", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Font Size</label>
              <select
                value={settings.display.fontSize}
                onChange={(e) => handleChange("display", "fontSize", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="highContrast"
                checked={settings.display.highContrast}
                onChange={(e) => handleChange("display", "highContrast", e.target.checked)}
                className="w-4 h-4 text-[#a000c3] border-gray-300 rounded focus:ring-[#a000c3]"
              />
              <label
                htmlFor="highContrast"
                className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                High Contrast Mode
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
              <FaShieldAlt className="mr-2" /> Privacy Settings
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Share reading history with librarians</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="shareReadingHistory"
                    checked={settings.privacy.shareReadingHistory}
                    onChange={(e) => handleChange("privacy", "shareReadingHistory", e.target.checked)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="shareReadingHistory"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.privacy.shareReadingHistory ? "bg-[#a000c3]" : "bg-gray-300 dark:bg-gray-600"}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Allow personalized book recommendations</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="allowRecommendations"
                    checked={settings.privacy.allowRecommendations}
                    onChange={(e) => handleChange("privacy", "allowRecommendations", e.target.checked)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="allowRecommendations"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.privacy.allowRecommendations ? "bg-[#a000c3]" : "bg-gray-300 dark:bg-gray-600"}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Store search history</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="storeSearchHistory"
                    checked={settings.privacy.storeSearchHistory}
                    onChange={(e) => handleChange("privacy", "storeSearchHistory", e.target.checked)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="storeSearchHistory"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.privacy.storeSearchHistory ? "bg-[#a000c3]" : "bg-gray-300 dark:bg-gray-600"}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
            disabled={saving}
          >
            <FaTimes className="inline mr-2" /> Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-[#a000c3] to-[#004bc2] text-white rounded-md hover:opacity-90"
            disabled={saving}
          >
            {saving ? (
              <>Processing...</>
            ) : (
              <>
                <FaSave className="inline mr-2" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          transform: translateX(0);
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #a000c3;
        }
        .toggle-checkbox {
          right: 0;
          z-index: 1;
          border-color: #a000c3;
          transform: translateX(-100%);
        }
        .toggle-label {
          width: 100%;
          height: 100%;
          transition: background-color 0.2s;
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;
