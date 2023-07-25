import { Routes, Route, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/LandingPage';
import { useEffect, useState } from 'react';
import AdminLoginPage from './pages/AdminLoginPage';
import UserLoginPage from './pages/UserLoginPage';
import AdminPage from './pages/AdminPage';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProfile from './components/admin/AdminProfile';

function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate();
  

  useEffect(() => {
    navigate('/admin')
  }, []);

  return (
    <Routes>
      <Route path="/">
        <Route index element={<LoginPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path='/admin' element={<AdminPage />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>
      <Route path="/user">
        <Route path="login" element={<UserLoginPage />} />
      </Route>
    </Routes>
  );
}

export default App;
