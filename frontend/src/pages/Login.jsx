import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================
  // Redirect if already logged in
  // ==========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // ==========================
  // Decode JWT safely
  // ==========================
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (err) {
      console.error("Token decode failed", err);
      return null;
    }
  };

  // ==========================
  // Handle Login
  // ==========================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.token;

      // Save token
      localStorage.setItem("token", token);
      // fetch latest role from backend
      const userRes = await api.get("/auth/me");

      // Extract role & userId from JWT
      const decoded = decodeToken(token);

      if (decoded) {
        localStorage.setItem("role", userRes.data.data.role);
        localStorage.setItem("userId", userRes.data.data._id);

      }

      navigate("/dashboard");

    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message === "Network Error") {
        setError("Cannot connect to server.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">

      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96">

        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          Forensic Evidence Vault
        </h2>

        <p className="text-gray-400 text-sm text-center mb-6">
          Secure Evidence Integrity & Verification
        </p>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* ✅ Register link */}
        <p
          onClick={() => navigate("/signup")}
          className="text-center text-sm text-gray-400 mt-4 cursor-pointer hover:text-gray-200"
        >
          Don't have an account? Register
        </p>

        <p className="text-gray-500 text-xs text-center mt-4">
          Role-based secure access enabled
        </p>

      </div>
    </div>
  );
}
