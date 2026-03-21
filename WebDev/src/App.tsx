import { Routes, Route, Navigate } from 'react-router-dom';
import LoginView from './Login-Signup/LoginView';

// These are temporary UI placeholders until we build the actual Map files
const GuestMap = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>📍 Guest Map View</h1>
    <p>This is where the public map will go.</p>
    <button onClick={() => window.location.href='/login'}>Back to Login</button>
  </div>
);

const MainMap = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>🎓 Student Main Map</h1>
    <p>Welcome to the full U-Nav experience!</p>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Set Login as the default starting page */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      <Route path="/login" element={<LoginView />} />
      <Route path="/guest-map" element={<GuestMap />} />
      <Route path="/main-map" element={<MainMap />} />

      {/* If the user types a wrong URL, send them back to Login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
