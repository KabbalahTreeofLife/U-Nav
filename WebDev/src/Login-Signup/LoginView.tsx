import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginView: React.FC = () => {
  const navigate = useNavigate();

  // State for form fields
  const [university, setUniversity] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Handle standard login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in user:", { university, username, password });
    // For now, let's just redirect to the main map upon "success"
    navigate('/main-map');
  };

  // Handle guest login
  const handleGuestLogin = () => {
    navigate('/guest-map');
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>U-Nav Login</h2>
        
        <div style={styles.inputGroup}>
          <label>University</label>
          <select 
            value={university} 
            onChange={(e) => setUniversity(e.target.value)}
            style={styles.input}
            required
          >
            <option value="">Select your University</option>
            <option value="uni-a">University of Science</option>
            <option value="uni-b">Tech Institute</option>
            <option value="uni-c">State College</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label>Username</label>
          <input 
            type="text" 
            placeholder="Student ID or Email"
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={styles.input}
            required 
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Password</label>
          <input 
            type="password" 
            placeholder="••••••••"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={styles.input}
            required 
          />
        </div>

        <button type="submit" style={styles.loginBtn}>
          Login
        </button>

        <div style={styles.divider}>or</div>

        <button 
          type="button" 
          onClick={handleGuestLogin} 
          style={styles.guestBtn}
        >
          Continue as Guest
        </button>
      </form>
    </div>
  );
};

// Quick inline styles for testing (you can move these to loginStyles.css later)
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'sans-serif'
  },
  form: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  title: { textAlign: 'center', marginBottom: '1rem', color: '#333' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  input: { padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' },
  loginBtn: { 
    padding: '0.8rem', 
    backgroundColor: '#007bff', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer',
    fontWeight: 'bold' 
  },
  guestBtn: { 
    padding: '0.8rem', 
    backgroundColor: '#6c757d', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer' 
  },
  divider: { textAlign: 'center', margin: '0.5rem 0', color: '#888', fontSize: '0.9rem' }
};

export default LoginView;
