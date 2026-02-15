import api from "./api";

export const refreshUserRole = async () => {
  const token = localStorage.getItem("token");

  // 🚀 stop if not logged in
  if (!token) return null;

  try {
    const res = await api.get("/auth/me");

    const newRole = res.data.data.role;
    localStorage.setItem("role", newRole);

    return newRole;

  } catch (err) {
    console.log("Role refresh skipped (not logged in)");
    return null;
  }
};
