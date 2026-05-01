import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Releases from './pages/Releases';
import Security from './pages/Security';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import OAuth2Callback from './pages/OAuth2Callback';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="releases" element={<Releases />} />
          <Route path="security" element={<Security />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
