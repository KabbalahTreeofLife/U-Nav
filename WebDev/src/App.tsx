import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginView } from './login-signup/LoginView';
import { SignupView } from './login-signup/SignupView';
import { MapView } from './map/MapView';
import { DiningView } from './dining/DiningView';
import { AboutView } from './about/AboutView';
import { ProtectedRoute } from './common/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      
      <Route path="/login" element={<LoginView />} />
      <Route path="/signup" element={<SignupView />} />
      
      <Route path="/map" element={
        <ProtectedRoute>
          <MapView />
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

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
