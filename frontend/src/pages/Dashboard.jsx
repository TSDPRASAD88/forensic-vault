import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadForm from "../components/UploadForm";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================
  // Logout
  // ==========================
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ==========================
  // Fetch Evidence
  // ==========================
  const fetchEvidence = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/evidence");

      // IMPORTANT FIX
      setEvidenceList(res.data.data);

    } catch (err) {
      console.error(err);
      setError("Failed to load evidence.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Simulate Tampering
  // ==========================
  const simulateTamper = async (id) => {
    try {
      await api.post(`/evidence/tamper/${id}`);
      fetchEvidence(); // refresh after tampering
    } catch (err) {
      console.error(err);
      alert("Tampering failed.");
    }
  };

  // ==========================
  // Load On Mount
  // ==========================
  useEffect(() => {
    fetchEvidence();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">
          Forensic Evidence Vault
        </h1>

        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-8 space-y-8">

        {/* Upload Section */}
        <UploadForm onUploadSuccess={fetchEvidence} />

        {/* Evidence Section */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl mb-6 font-semibold">
            Uploaded Evidence
          </h2>

          {/* Loading */}
          {loading && (
            <p className="text-gray-400">Loading evidence...</p>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-400">{error}</p>
          )}

          {/* No Evidence */}
          {!loading && evidenceList.length === 0 && (
            <p className="text-gray-400">
              No evidence uploaded yet.
            </p>
          )}

          {/* Evidence List */}
          <div className="space-y-4">
            {evidenceList.map((item) => (
              <div
                key={item._id}
                className="p-4 bg-gray-700 rounded-lg flex justify-between items-center"
              >
                {/* Left Info */}
                <div>
                  <p className="font-semibold text-lg">
                    {item.fileName}
                  </p>

                  <p className="text-sm text-gray-400">
                    Uploaded by: {item.uploadedBy?.name}
                  </p>

                  <p className="text-sm text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Right Actions */}
                <div className="flex gap-3">

                  {/* Verify Button */}
                  <button
                    onClick={() => navigate(`/verify/${item._id}`)}
                    className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Verify
                  </button>

                  {/* Tamper Button */}
                  <button
                    onClick={() => simulateTamper(item._id)}
                    className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700 transition"
                  >
                    Simulate Tamper
                  </button>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
