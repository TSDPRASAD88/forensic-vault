import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // 🔒 Role Protection
  useEffect(() => {
    if (role !== "admin" && role !== "analyst") {
      alert("Access denied");
      navigate("/dashboard");
    }
  }, [role, navigate]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/audit");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 🎨 Action badge colors
  const getActionColor = (action) => {
    if (action.includes("UPLOAD")) return "bg-blue-600";
    if (action.includes("VERIFY")) return "bg-green-600";
    if (action.includes("TAMPER")) return "bg-red-600";
    return "bg-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
        >
          ← Back
        </button>

        <button
          onClick={fetchLogs}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8">
        Audit Trail
      </h1>

      {/* Loading */}
      {loading && (
        <p className="text-gray-400">Loading audit logs...</p>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-700 sticky top-0">
              <tr>
                <th className="p-4">Action</th>
                <th className="p-4">User</th>
                <th className="p-4">Evidence</th>
                <th className="p-4">Time</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr
                  key={log._id}
                  className="border-t border-gray-700 hover:bg-gray-700 transition"
                >
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getActionColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td className="p-4">
                    {log.performedBy?.name || "Unknown"}
                  </td>

                  <td className="p-4">
                    {log.evidenceId?.fileName || "N/A"}
                  </td>

                  <td className="p-4 text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {logs.length === 0 && (
            <p className="p-6 text-gray-400">
              No audit records found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
