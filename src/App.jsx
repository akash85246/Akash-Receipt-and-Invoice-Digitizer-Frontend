import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import Receipt from "./pages/Receipt";
import Scan from "./pages/Scan";
import Welcome from "./pages/Welcome";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "./components/ProtectedRoute/PublicRoute.jsx";
import MainLayout from "./layouts/main.layout.jsx";
import axios from "axios";

axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          {/* PUBLIC ROUTES */}
          <Route element={<PublicRoute />}>
            <Route path="/welcome" element={<Welcome />} />
          </Route>

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/receipt/:id" element={<Receipt />} />
            <Route path="/invoice/:id" element={<Receipt />} />
            <Route path="/scan" element={<Scan />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
