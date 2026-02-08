import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';
import { SidebarProvider } from './contexts/SidebarContext';

// Direct imports - simpler, no loading states needed
import HomePage from './pages/HomePage';
import DoctorsListing from './pages/DoctorsListing';
import DoctorProfile from './pages/DoctorProfile';
import ChatPage from './pages/ChatPage';
import DefaultChatPage from './pages/DefaultChatPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DoctorOnboarding from './pages/DoctorOnboarding';

function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/doctors" element={<DoctorsListing />} />
              <Route 
                path="/doctor-profile/:id?" 
                element={
                  <ProtectedRoute>
                    <DoctorProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/doctor-onboarding" 
                element={
                  <ProtectedRoute>
                    <DoctorOnboarding />
                  </ProtectedRoute>
                } 
              />
              <Route path="/chat" element={<DefaultChatPage />} />
              <Route path="/private" element={<DefaultChatPage />} />
              <Route path="/private/:thread_id" element={<ChatPage />} />
              <Route path="/chat/:thread_id" element={<ChatPage />} />
            </Route>
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </Router>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App
