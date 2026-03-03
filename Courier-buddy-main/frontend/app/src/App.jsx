import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import ContactUs from "./pages/ContactUs";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Verification from "./pages/Verification";
import CreateDelivery from "./pages/CreateDelivery";
import DeliveryList from "./pages/DeliveryList";
import AdminDashboard from "./pages/AdminDashboard";
import UserGuide from "./pages/UserGuide";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/verify"
            element={
              <PrivateRoute>
                <Verification />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-delivery"
            element={
              <PrivateRoute>
                <CreateDelivery />
              </PrivateRoute>
            }
          />
          <Route
            path="/deliveries"
            element={
              <PrivateRoute>
                <DeliveryList />
              </PrivateRoute>
            }
          />
          <Route
            path="/user-guide"
            element={
              <PrivateRoute>
                <UserGuide />
              </PrivateRoute>
            }
          />
          {/* ✅ Contact Us route — now properly inside <Routes> */}
          <Route
            path="/contact"
            element={
              <PrivateRoute>
                <ContactUs />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
