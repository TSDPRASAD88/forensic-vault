import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VerifyPage from "./pages/VerifyPage";
import AuditPage from "./pages/AuditPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify/:id" element={<VerifyPage />} />
        <Route path="/audit" element={<AuditPage />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
