import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginView } from './login-signup/LoginView';
import { SignupView } from './login-signup/SignupView';
import { GuestLoginView } from './login-signup/GuestLoginView';
import { MapView3D } from './map/3d/MapView3D';
import { MapView2D } from './map/2d/MapView2D';
import { DiningView } from './dining/DiningView';
import { AboutView } from './about/AboutView';
import { ProtectedRoute } from './common/ProtectedRoute';
import { ProtectedAdminRoute } from './common/ProtectedAdminRoute';
import { AdminDashboard, DiningAdmin, EventsAdmin, UsersAdmin } from './admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      
      <Route path="/login" element={<LoginView />} />
      <Route path="/signup" element={<SignupView />} />
      <Route path="/guest-login" element={<GuestLoginView />} />
      
      <Route path="/map" element={<Navigate to="/map/3d" replace />} />
      <Route path="/map/3d" element={
        <ProtectedRoute>
          <MapView3D />
        </ProtectedRoute>
      } />
      <Route path="/map/2d" element={
        <ProtectedRoute>
          <MapView2D />
        </ProtectedRoute>
      } />
      <Route path="/dining" element={
        <ProtectedRoute>
          <DiningView />
        </ProtectedRoute>
      } />
      <Route path="/about" element={
        <ProtectedRoute>
          <AboutView />
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedAdminRoute>
          <AdminDashboard />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/dining" element={
        <ProtectedAdminRoute>
          <DiningAdmin />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/events" element={
        <ProtectedAdminRoute>
          <EventsAdmin />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedAdminRoute>
          <UsersAdmin />
        </ProtectedAdminRoute>
      } />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
