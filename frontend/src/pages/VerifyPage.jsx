import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function VerifyPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // Fetch Verification Report
  // ===============================
  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/evidence/verify/${id}`);
      setReport(res.data.forensicReport);

    } catch (err) {
      console.error(err);
      setError("Failed to verify evidence.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  // ===============================
  // Download PDF Report
  // ===============================
  const downloadReport = async () => {
  try {
    const response = await api.get(
      `/evidence/report/${id}`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute(
      "download",
      `forensic-report-${id}.pdf`
    );

    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (err) {
    console.error(err);
    alert("Failed to download report");
  }
};


  // ===============================
  // UI Helpers
  // ===============================
  const StatusBadge = ({ status }) => (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        status
          ? "bg-green-600 text-white"
          : "bg-red-600 text-white"
      }`}
    >
      {status ? "VALID" : "FAILED"}
    </span>
  );

  // ===============================
  // Render
  // ===============================
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">

      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-8">
        Forensic Verification Report
      </h1>

      {/* Loading */}
      {loading && (
        <p className="text-gray-400">Verifying evidence...</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {/* Report */}
      {report && (
        <div className="bg-gray-800 p-8 rounded-xl shadow-xl space-y-6">

          {/* Evidence Info */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Evidence Information
            </h2>

            <p><strong>File Name:</strong> {report.fileName}</p>
            <p><strong>Evidence ID:</strong> {report.evidenceId}</p>
            <p><strong>Uploaded By:</strong> {report.uploadedBy?.name}</p>
            <p><strong>Upload Time:</strong> {new Date(report.uploadTimestamp).toLocaleString()}</p>
          </div>

          <hr className="border-gray-700" />

          {/* Integrity Checks */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Integrity Checks
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between items-center bg-gray-700 p-4 rounded">
                <span>File Integrity (Hash Match)</span>
                <StatusBadge status={report.fileIntegrity} />
              </div>

              <div className="flex justify-between items-center bg-gray-700 p-4 rounded">
                <span>Digital Signature Integrity</span>
                <StatusBadge status={report.signatureIntegrity} />
              </div>

              <div className="flex justify-between items-center bg-gray-700 p-4 rounded">
                <span>Blockchain Integrity</span>
                <StatusBadge status={report.blockchainIntegrity} />
              </div>

              <div className="flex justify-between items-center bg-gray-700 p-4 rounded">
                <span>Block Link Integrity</span>
                <StatusBadge status={report.blockLinkIntegrity} />
              </div>

            </div>
          </div>

          <hr className="border-gray-700" />

          {/* Overall Status */}
          <div className="text-center mt-6">

            {report.overallValid ? (
              <div className="bg-green-700 p-6 rounded-xl">
                <h2 className="text-2xl font-bold">
                  ✅ Evidence Verified Successfully
                </h2>
                <p className="mt-2">
                  No tampering detected. Blockchain integrity intact.
                </p>
              </div>
            ) : (
              <div className="bg-red-700 p-6 rounded-xl">
                <h2 className="text-2xl font-bold">
                  ⚠ Evidence Tampered
                </h2>
                <p className="mt-2">
                  Integrity verification failed. Evidence compromised.
                </p>
              </div>
            )}

          </div>

          {/* Download Report Button */}
          <div className="text-center pt-4">
            <button
              onClick={downloadReport}
              className="bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Download Forensic Report (PDF)
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
