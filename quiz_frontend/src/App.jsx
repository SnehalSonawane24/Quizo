import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import QuizPage from './pages/QuizPage'
import EditQuizPage from './pages/EditQuizPage'
import QuizDetailPage from './pages/QuizDetailPage'
import ResultPage from './pages/ResultPage'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import CreateQuizPage from "./pages/CreateQuizPage";


export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create-quiz"
          element={
            <ProtectedRoute>
              <CreateQuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:quizId"
          element={
            <ProtectedRoute>
              <QuizDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:quizId/edit"
          element={
            <ProtectedRoute>
              <EditQuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results/:id"
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}