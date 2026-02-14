import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadForm from "../components/UploadForm";
import api from "../services/api";
import BlockchainViewer from "../components/BlockchainViewer";

export default function Dashboard() {
  const navigate = useNavigate();

  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMap, setStatusMap] = useState({});
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
      const evidence = res.data.data;

      setEvidenceList(evidence);

      // Fetch integrity status
      fetchIntegrityStatus(evidence);

    } catch (err) {
      console.error(err);
      setError("Failed to load evidence.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Fetch Integrity Status
  // ==========================
  const fetchIntegrityStatus = async (list) => {
    const statusResults = {};

    await Promise.all(
      list.map(async (item) => {
        try {
          const res = await api.get(`/evidence/verify/${item._id}`);
          statusResults[item._id] =
            res.data.forensicReport.overallValid;
        } catch {
          statusResults[item._id] = false;
        }
      })
    );

    setStatusMap(statusResults);
  };

  // ==========================
  // Simulate Tampering
  // ==========================
  const simulateTamper = async (id) => {
    try {
      await api.post(`/evidence/tamper/${id}`);
      fetchEvidence();
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

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/audit")}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Audit Logs
          </button>

          <button
            onClick={logout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
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

          {loading && (
            <p className="text-gray-400">Loading evidence...</p>
          )}

          {error && (
            <p className="text-red-400">{error}</p>
          )}

          {!loading && evidenceList.length === 0 && (
            <p className="text-gray-400">
              No evidence uploaded yet.
            </p>
          )}

          <div className="space-y-4">
            {evidenceList.map((item) => {
              const isValid = statusMap[item._id];

              return (
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
                  <div className="flex items-center gap-3">

                    {/* Integrity Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold
                      ${isValid === undefined
                          ? "bg-gray-500"
                          : isValid
                          ? "bg-green-600"
                          : "bg-red-600"
                        }`}
                    >
                      {isValid === undefined
                        ? "Checking..."
                        : isValid
                        ? "VALID"
                        : "TAMPERED"}
                    </span>

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
                      Tamper
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🔗 Blockchain Explorer Panel */}
        <BlockchainViewer />

      </div>
    </div>
  );
}
