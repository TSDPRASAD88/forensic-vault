import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      await api.post("/auth/register", form);

      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/"), 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">

      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Create Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            className="w-full p-3 rounded bg-gray-700 text-white"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-700 text-white"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-700 text-white"
            onChange={handleChange}
            required
          />

          {/* Role selection */}
          <select
            name="role"
            className="w-full p-3 rounded bg-gray-700 text-white"
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-semibold"
          >
            Register
          </button>
        </form>

        <p
          onClick={() => navigate("/")}
          className="text-center text-sm text-gray-400 mt-4 cursor-pointer"
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}
