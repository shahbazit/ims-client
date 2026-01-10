import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard.tsx";
import User from "../pages/Users.tsx";
import Students from "../pages/Students.tsx";
import Login from "../pages/Login.tsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<User />} />
              <Route path="/students" element={<Students />} />
              {/* Catch all redirect to dashboard or login */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        } />
      </Route>
    </Routes>
  );
}
