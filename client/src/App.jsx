import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import LoginRegister from './components/LoginRegister';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import useAuth
import { TaskProvider } from './context/TaskContext';
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  return currentUser ? children : <Navigate to="/" />; // Redirect to login if not authenticated
};

function App() {
  return (
    <AuthProvider>
      <TaskProvider>

      <Router>
        <div className="main">
          <div className="gradient" />
        </div>

        <div className="app">
          <NavBar />
          <Routes>
            <Route path="/" element={<LoginRegister />} />
            <Route path="/tasks" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/create-task" element={<PrivateRoute><Home /></PrivateRoute>} />

          </Routes>
        </div>
      </Router>
      </TaskProvider>

    </AuthProvider>
  );
}

export default App;
