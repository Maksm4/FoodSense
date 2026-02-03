import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import IngredientsPage from './Components/Pages/IngredientsPage'
import RecipePage from './Components/Pages/RecipePage'
import AuthPage from './Components/Auth/AuthPage'
import ProtectedRoute from './Components/Auth/ProtectedRoute'

export default function App() {
  return (
    <div className='p-4'>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
  
          <Route path="/" element={
          <ProtectedRoute>
            <IngredientsPage />
          </ProtectedRoute>
        } />
        <Route path="/recipes" element={
          <ProtectedRoute>
            <RecipePage />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}