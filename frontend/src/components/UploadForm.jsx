import { useState } from "react";
import api from "../services/api";

export default function UploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await api.post("/evidence/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Evidence uploaded successfully!");

      setFile(null);
      onUploadSuccess(); // refresh evidence list
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
      <h2 className="text-xl mb-4">Upload Evidence</h2>

      <form onSubmit={handleUpload}>
        <input
          type="file"
          className="mb-4 block w-full text-white"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
