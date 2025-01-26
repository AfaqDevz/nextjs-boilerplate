"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Card from "../Components/Card";
import toast from "react-hot-toast";

const UpdatePasswordForm = () => {
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    toast.loading('Updating password.')

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/update-password`, {
        email,
        tempPassword,
        newPassword,
      });

      if (response.status === 200) {
        router.push("/dashboard");
        toast.dismiss();
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while updating the password");
    }
  };

  return (
    <Card>
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold mb-2">Update Password</h2>
        <p className="text-sm text-base-content/70">Check your email for temp pass and update your password</p>
        <form onSubmit={handleSubmit} className="space-y-1">
          <div className="form-control text-white">
            <label className="label" htmlFor="email">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 bg-green-600 rounded-md text-white"
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="tempPassword">
              <span className="label-text">Temporary Password</span>
            </label>
            <input
              type="text"
              id="tempPassword"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              required
              className="w-full p-2 bg-green-600 rounded-md text-white"
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="newPassword">
              <span className="label-text">New Password</span>
            </label>
            <input
              type="text"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-2 bg-green-600 rounded-md text-white"
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="confirmPassword">
              <span className="label-text">Confirm New Password</span>
            </label>
            <input
              type="text"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 bg-green-600 rounded-md text-white"
            />
          </div>
          {error && (
            <div className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}
          <div className="form-control mt-6">
            <button type="submit" className="btn w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default UpdatePasswordForm;
