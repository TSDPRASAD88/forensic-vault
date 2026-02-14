import api from "./api";

export const refreshUserRole = async () => {
  try {
    const res = await api.get("/auth/me");

    const newRole = res.data.data.role;
    const oldRole = localStorage.getItem("role");

    // ✅ If role changed → notify
    if (oldRole && newRole !== oldRole) {
      alert(`⚠️ Your permissions changed to "${newRole}"`);

      localStorage.setItem("role", newRole);

      // If role removed admin access → reload UI
      window.location.reload();
    }

  } catch (err) {
    console.error("Role refresh failed");
  }
};
