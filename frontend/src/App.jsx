import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import ManageEvents from './pages/ManageEvents';
import EventForm from './pages/EventForm';
import ViewRegistrations from './pages/ViewRegistrations';
import StudentDashboard from './pages/StudentDashboard';
import EventsPage from './pages/EventsPage';
import EventDetails from './pages/EventDetails';
import MyRegistrations from './pages/MyRegistrations';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-surface-500 dark:text-surface-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <RegisterPage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/events" element={<ProtectedRoute role="admin"><ManageEvents /></ProtectedRoute>} />
        <Route path="/admin/events/new" element={<ProtectedRoute role="admin"><EventForm /></ProtectedRoute>} />
        <Route path="/admin/events/edit/:id" element={<ProtectedRoute role="admin"><EventForm /></ProtectedRoute>} />
        <Route path="/admin/events/:eventId/registrations" element={<ProtectedRoute role="admin"><ViewRegistrations /></ProtectedRoute>} />

        {/* Student routes */}
        <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/student/registrations" element={<ProtectedRoute role="student"><MyRegistrations /></ProtectedRoute>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/student') : '/login'} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName="!rounded-xl !shadow-lg"
      />
    </div>
  );
}

export default App;
