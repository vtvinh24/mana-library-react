import { useState, useEffect } from "react";
import { FaUserCircle, FaEdit, FaSave, FaTimes, FaBook, FaCalendarAlt } from "react-icons/fa";
import Spinner from "../../components/Spinner";
import { useUser } from "../../context/UserProvider";
import { format } from "date-fns";

const ProfilePage = () => {
  const { user, updateProfile, getProfile, loading: userLoading, error: userError } = useUser();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user profile through the context
        const response = await getProfile();
        if (response.error) {
          throw new Error(response.error);
        }

        setProfile(response.user || response);
        setFormData(response.user || response);
      } catch (err) {
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [getProfile]);

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

      // Prepare update data structure
      const updateData = {
        profile: {
          firstName: formData.profile?.firstName,
          lastName: formData.profile?.lastName,
          phone: formData.profile?.phone,
          preferredLanguage: formData.profile?.preferredLanguage,
          address: formData.profile?.address,
        },
      };

      const response = await updateProfile(updateData);
      if (response.error) {
        throw new Error(response.error);
      }

      setProfile(response.user || formData);
      setEditMode(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading || userLoading) {
    return <Spinner />;
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-4">
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md dark:bg-red-900/50 dark:text-red-200">{error || userError || "Failed to load profile data"}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>

      {(error || userError) && <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-md">{error || userError}</div>}

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-r from-[#a000c3] to-[#004bc2] rounded-full flex items-center justify-center text-white">
            {profile.profile?.firstName?.charAt(0) || ""}
            {profile.profile?.lastName?.charAt(0) || ""}
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {profile.profile?.firstName} {profile.profile?.lastName}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{profile.auth?.email}</p>
            <p className="text-gray-500 dark:text-gray-400">Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}</p>
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
                  name="profile.firstName"
                  value={formData.profile?.firstName || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                <input
                  type="text"
                  name="profile.lastName"
                  value={formData.profile?.lastName || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="auth.email"
                  value={formData.auth?.email || ""}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-70 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="profile.phone"
                  value={formData.profile?.phone || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                <input
                  type="text"
                  name="profile.address.street"
                  value={formData.profile?.address?.street || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                <input
                  type="text"
                  name="profile.address.city"
                  value={formData.profile?.address?.city || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State/Province</label>
                <input
                  type="text"
                  name="profile.address.state"
                  value={formData.profile?.address?.state || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP/Postal Code</label>
                <input
                  type="text"
                  name="profile.address.zipCode"
                  value={formData.profile?.address?.zipCode || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                <input
                  type="text"
                  name="profile.address.country"
                  value={formData.profile?.address?.country || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a000c3] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Language</label>
                <select
                  name="profile.preferredLanguage"
                  value={formData.profile?.preferredLanguage || "English"}
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
                      {profile.profile?.firstName} {profile.profile?.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Email</span>
                    <span className="text-gray-900 dark:text-white font-medium">{profile.auth?.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Phone</span>
                    <span className="text-gray-900 dark:text-white font-medium">{profile.profile?.phone || "Not provided"}</span>
                  </div>
                  {profile.profile?.address && (
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Address</span>
                      <span className="text-gray-900 dark:text-white font-medium text-right">
                        {profile.profile.address.street && `${profile.profile.address.street}, `}
                        {profile.profile.address.city && `${profile.profile.address.city}, `}
                        {profile.profile.address.state && `${profile.profile.address.state} `}
                        {profile.profile.address.zipCode && `${profile.profile.address.zipCode}, `}
                        {profile.profile.address.country}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">Preferred Language</span>
                    <span className="text-gray-900 dark:text-white font-medium">{profile.profile?.preferredLanguage || "English"}</span>
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
                  {profile.library?.cardNumber && (
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Card Number</span>
                      <span className="text-gray-900 dark:text-white font-medium">{profile.library.cardNumber}</span>
                    </div>
                  )}
                  {profile.library?.membershipStatus && (
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Membership Status</span>
                      <span
                        className={`px-2 py-1 ${
                          profile.library.membershipStatus === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        } text-xs font-semibold rounded-full`}
                      >
                        {profile.library.membershipStatus}
                      </span>
                    </div>
                  )}
                  {profile.library?.membershipType && (
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Membership Type</span>
                      <span className="text-gray-900 dark:text-white font-medium">{profile.library.membershipType}</span>
                    </div>
                  )}
                  {profile.library?.accountBalance !== undefined && (
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Account Balance</span>
                      <span className="text-gray-900 dark:text-white font-medium">${profile.library.accountBalance}</span>
                    </div>
                  )}
                  {profile.library?.expirationDate && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600 dark:text-gray-400">Expiration Date</span>
                      <span className="text-gray-900 dark:text-white font-medium">{new Date(profile.library.expirationDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {!profile.library && <div className="py-4 text-center text-gray-500 dark:text-gray-400">No membership information available</div>}
                </div>
              </div>
            </div>
          </div>

          {profile.recentActivity && profile.recentActivity.length > 0 && (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-6">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
                  <FaCalendarAlt className="mr-2" /> Recent Activity
                </h3>
              </div>
              <div className="p-6">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {profile.recentActivity.map((activity, index) => (
                    <div
                      className="py-3"
                      key={index}
                    >
                      <p className="text-gray-900 dark:text-white font-medium">{activity.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.date ? new Date(activity.date).toLocaleDateString() : "Date not available"}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;
