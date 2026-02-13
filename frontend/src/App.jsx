import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VerifyPage from "./pages/VerifyPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify/:id" element={<VerifyPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
