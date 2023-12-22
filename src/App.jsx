import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/Login';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';
import StudentDashboard from './Pages/StudentDashboard/StudentDashboard';
import AuthGuard from './authGuard/authGuard';
import AdminGuard from './authGuard/adminGuard';

function App() {
  return (
    <Routes>
      {/* Public route accessible to all users */}
      <Route path="/" element={<Login />} />

      {/* Admin route with AdminGuard */}
      <Route path="/admin/*" element={<AdminGuard><AdminDashboard /></AdminGuard>} />

      {/* Student route with AuthGuard */}
      <Route path="/dashboard/*" element={<AuthGuard><StudentDashboard /></AuthGuard>} />
    </Routes>
  );
}

export default App;
