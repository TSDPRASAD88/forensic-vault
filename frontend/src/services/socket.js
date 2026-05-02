import { io } from "socket.io-client";

const getSocketURL = () => {
  const apiBaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8070/api";
  // Remove /api from the end to get the base URL
  return apiBaseURL.replace("/api", "");
};

const socket = io(getSocketURL());

export default socket;
