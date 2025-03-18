import { useState, useEffect } from "react";
import { FaUserCircle, FaEdit, FaSave, FaTimes, FaBook, FaCalendarAlt } from "react-icons/fa";
import Spinner from "../../components/Spinner";

const ProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    address: {
      street: "123 Library Street",
      city: "Bookville",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    preferredLanguage: "English",
    // Library related fields
    cardNumber: "LIB-2023-0042",
    membershipStatus: "Active",
    membershipType: "Premium",
    accountBalance: "0.00",
    expirationDate: "2024-12-31",
  });

  const [formData, setFormData] = useState({ ...profile });

  useEffect(() => {
    // In a real implementation, fetch user profile from API
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        // Mock API request delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Data would be fetched here in a real implementation
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      // Mock API request delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Update would happen here in a real implementation
      setProfile(formData);
      setEditMode(false);
      setSaving(false);
    } catch (err) {
      setError("Failed to update profile");
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-md">{error}</div>}

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-r from-[#a000c3] to-[#004bc2] rounded-full flex items-center justify-center text-white">
            {profile.firstName?.charAt(0) || ""}
            {profile.lastName?.charAt(0) || ""}
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{profile.email}</p>
            <p className="text-gray-500 dark:text-gray-400">Member since {new Date().toLocaleDateString()}</p>
          </div>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#a000c3] to-[#004bc2] text-white rounded-md hover:opacity-90"
            >
              <FaEdit className="inline mr-2" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-6">
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
                <FaUserCircle className="mr-2" /> Personal Information
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State/Province</label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP/Postal Code</label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Language</label>
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setFormData({ ...profile });
                setEditMode(false);
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
              disabled={saving}
            >
              <FaTimes className="inline mr-2" /> Cancel
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
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
                  <FaUserCircle className="mr-2" /> Personal Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Full Name</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {profile.firstName} {profile.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Email</span>
                    <span className="text-gray-900 dark:text-white font-medium">{profile.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Phone</span>
                    <span className="text-gray-900 dark:text-white font-medium">{profile.phone}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Address</span>
                    <span className="text-gray-900 dark:text-white font-medium text-right">
                      {profile.address.street}, {profile.address.city}, {profile.address.state} {profile.address.zipCode}, {profile.address.country}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">Preferred Language</span>
                    <span className="text-gray-900 dark:text-white font-medium">{profile.preferredLanguage}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
                  <FaBook className="mr-2" /> Library Membership
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Card Number</span>
                    <span className="text-gray-900 dark:text-white font-medium">{profile.cardNumber}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Membership Status</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-semibold rounded-full">{profile.membershipStatus}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Membership Type</span>
                    <span className="text-gray-900 dark:text-white font-medium">{profile.membershipType}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Account Balance</span>
                    <span className="text-gray-900 dark:text-white font-medium">${profile.accountBalance}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">Expiration Date</span>
                    <span className="text-gray-900 dark:text-white font-medium">{profile.expirationDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-6">
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
                <FaCalendarAlt className="mr-2" /> Recent Activity
              </h3>
            </div>
            <div className="p-6">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <div className="py-3">
                  <p className="text-gray-900 dark:text-white font-medium">Borrowed "The Great Gatsby"</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">3 days ago</p>
                </div>
                <div className="py-3">
                  <p className="text-gray-900 dark:text-white font-medium">Returned "To Kill a Mockingbird"</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">5 days ago</p>
                </div>
                <div className="py-3">
                  <p className="text-gray-900 dark:text-white font-medium">Added "1984" to favorites</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
