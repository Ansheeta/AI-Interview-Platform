import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import AppLayout from './components/layout/AppLayout';
import FullPageLoader from './components/common/FullPageLoader';



// Route-level code splitting: each page (and its heavy dependencies, like
// Chart.js on Analytics/Dashboard) loads only when its route is visited,
// instead of bloating the initial bundle.
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Interview = lazy(() => import('./pages/Interview'));
const QuestionBank = lazy(() => import('./pages/QuestionBank'));
const History = lazy(() => import('./pages/History'));
const InterviewDetail = lazy(() => import('./pages/InterviewDetail'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public-only routes (redirect away if already logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected routes (require auth), rendered inside the app shell */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/question-bank" element={<QuestionBank />} />
            <Route path="/history" element={<History />} />
            <Route path="/history/:id" element={<InterviewDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
