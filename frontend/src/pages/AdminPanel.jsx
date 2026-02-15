import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // protect route
  useEffect(() => {
    if (role !== "admin") {
      alert("Access denied");
      navigate("/dashboard");
    }
  }, [role, navigate]);

  // fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin");
      setUsers(res.data.data);
    } catch (error) {
      console.error("Error fetching users", error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ⭐ update role locally
  const updateRole = async (id, newRole) => {
    try {
      await api.put(`/admin/${id}`, { role: newRole });

      // 🔥 update state instantly
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error updating role", error);
      alert("Failed to update role");
    }
  };

  // ⭐ delete locally
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/admin/${id}`);

      // 🔥 remove user from UI instantly
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user", error);
      alert("Failed to delete user");
    }
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

        {loading ? (
          <p className="p-6 text-center">Loading users...</p>
        ) : (
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
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
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
                        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}
