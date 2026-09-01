import { useState } from "react";
import api from "../services/api";

function PasswordUpdateForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const currentPassword = formData.currentPassword.trim();
    const newPassword = formData.newPassword.trim();
    const confirmNewPassword = formData.confirmNewPassword.trim();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setMessage("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setMessage("New password must be different from the current password.");
      return;
    }

    if (
      newPassword.length < 8 ||
      newPassword.length > 16 ||
      !/[A-Z]/.test(newPassword) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    ) {
      setMessage(
        "New password must be between 8 and 16 characters, contain at least one uppercase letter and one special character."
      );
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await api.put("/auth/update-password", {
        currentPassword,
        newPassword
      });

      setMessage("Password updated successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Something went wrong while updating your password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">
        Update Password
      </h2>

      <p className="mt-2 text-sm text-gray-600">
        Enter your current password and choose a new secure password.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Current Password
          </label>

          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter your current password"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            New Password
          </label>

          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter a new password"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>

          <input
            type="password"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            placeholder="Re-enter the new password"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {message && (
          <div className="rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Updating Password..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

export default PasswordUpdateForm;
