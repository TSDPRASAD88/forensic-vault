import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin") {
      alert("Access denied");
      navigate("/dashboard");
    }
  }, [role, navigate]);

  const fetchUsers = async () => {
    const res = await api.get("/admin");
    setUsers(res.data.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    await api.put(`/admin/${id}`, { role });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/admin/${id}`);
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">

      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 bg-gray-700 px-4 py-2 rounded"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-gray-700">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>

                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateRole(user._id, e.target.value)
                    }
                    className="bg-gray-700 p-2 rounded"
                  >
                    <option value="user">User</option>
                    <option value="analyst">Analyst</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td className="p-4">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
