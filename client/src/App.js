import { Routes, Route, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from './pages/LandingPage';
import AdminPage from './pages/admin/AdminPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEditTest from './pages/admin/AdminEditTest';
import UserDashboard from './pages/user/UserDashboard';
import UserTestPage from './pages/user/UserTestPage';
import ViewResults from './pages/user/ViewResults';
import ScoreBoard from './pages/admin/ScoreBoard';
import useLocalStorageUser from './components/common/useLocalStorageUser';
import PageNotFound from './pages/PageNotFound';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import UserPage from './pages/user/UserPage';
import { AppContext } from './contexts'
import WatchTest from './pages/admin/WatchTest';


function App() {
  const { user, setUser } = useLocalStorageUser();
  const navigate = useNavigate()

  const handleLogout = () => {
    // Logout logic here...
    setUser(null); // Clear user data on logout
    localStorage.removeItem('token');
    navigate('/login')
  };

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/">
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
        <Route path='/admin' element={<AdminPage />} >
          <Route path="dashboard" element={<AdminDashboard logout={handleLogout} />} />
          <Route path="test/edit/:testid" element={<AdminEditTest />} />
          <Route path="test/watch/:testid" element={<WatchTest />} />
          <Route path="test/details/:testid" element={<ScoreBoard />} />
        </Route>
        <Route path="/user" element={<UserPage />}>
          <Route index path='dashboard' element={<UserDashboard logout={handleLogout} />} />
        </Route>
        <Route path="/test">
          <Route path='write/:regid' element={<UserTestPage />} />
          <Route path='results/:regid' element={<ViewResults />} />
          <Route path="view/:testid" element={<WatchTest />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AppContext.Provider >
  );
}

export default App;
