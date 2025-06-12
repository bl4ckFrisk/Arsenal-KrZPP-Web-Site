import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { HomePage } from './pages/HomePage/HomePage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { MyTracksPage } from './pages/MyTracksPage/MyTracksPage';
import { WelcomePage } from './pages/WelcomePage/WelcomePage';
import { useAuth } from './hooks/useAuth';
import { Player } from './components/Player/Player';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/welcome" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/welcome"
          element={
            <PublicRoute>
              <WelcomePage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        
        {/* Protected routes with Layout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <HomePage />
                {isAuthenticated && <Player />}
              </Layout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout>
                <ProfilePage />
                {isAuthenticated && <Player />}
              </Layout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/my-tracks"
          element={
            <PrivateRoute>
              <Layout>
                <MyTracksPage />
                {isAuthenticated && <Player />}
              </Layout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <Layout>
                <SearchPage />
                {isAuthenticated && <Player />}
              </Layout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Layout>
                <SettingsPage />
                {isAuthenticated && <Player />}
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Redirect root path to welcome for non-authenticated users */}
        <Route
          path="*"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Navigate to="/welcome" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
