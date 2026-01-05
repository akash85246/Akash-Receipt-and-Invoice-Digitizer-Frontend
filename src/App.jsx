import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import Receipt from "./pages/Receipt";
import Scan from "./pages/Scan";
import Welcome from "./pages/Welcome";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import MainLayout from "./layouts/main.layout.jsx";
import axios from "axios";

axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <Routes>
       
        <Route element={<MainLayout />}>
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="home" element={<Home />} />
            <Route path="history" element={<History />} />
            <Route path="receipt/:id" element={<Receipt />} />
            <Route path="scan" element={<Scan />} />
          </Route>

          {/* Public routes */}
          <Route path="welcome" element={<Welcome />} />
          <Route path="*" element={<Welcome />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;