import { Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/LoginScreen.jsx';
import Dashboard from './components/Dashboard.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;