import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginView } from './login-signup/LoginView';
import { SignupView } from './login-signup/SignupView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      
      <Route path="/login" element={<LoginView />} />
      <Route path="/signup" element={<SignupView />} />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
