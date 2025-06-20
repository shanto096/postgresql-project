import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import DashboardPage from './page/DashboardPage';
import HomePage from './page/HomePage';
import { AuthProvider } from './context/AuthContext';
import SuperAdminDashboardPage from './page/SuperAdminDashboardPage';
import NotFoundPage from './components/NotFoundPage';

function AppWithHeaderControl() {
  const location = useLocation();
  const hideHeader = location.pathname.startsWith('/dashboard');
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-inter">
      {!hideHeader && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          {/* ড্যাশবোর্ড এবং প্রজেক্ট বিস্তারিত একই রুটে হ্যান্ডেল করা হবে */}
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route path=":projectId" element={<DashboardPage />} /> {/* নেস্টেড রুট */}
          </Route>
           {/* নতুন: সুপার অ্যাডমিন ড্যাশবোর্ড রুট */}
           <Route path="/super-admin-dashboard" element={<SuperAdminDashboardPage />} />
           <Route path="*" element={<NotFoundPage />} />
            </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppWithHeaderControl />
      </AuthProvider>
    </Router>
  );
}

export default App;
