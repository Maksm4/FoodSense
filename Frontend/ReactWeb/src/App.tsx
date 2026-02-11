import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import IngredientsPage from './Components/Pages/IngredientsPage'
import RecipePage from './Components/Pages/RecipePage'
import AuthPage from './Components/Pages/AuthPage'
import ProtectedRoute from './Components/Auth/ProtectedRoute'
import KitchensPage from './Components/Pages/KitchensPage'
import SessionLikesPage from './Components/Pages/SessionLikedPage'
import SavedRecipesPage from './Components/Pages/SavedRecipesPage'


function RootRedirect() {
  const isAuthenticated = !!localStorage.getItem("jwt_token");

  if (isAuthenticated) {
    return <Navigate to="/kitchens" replace />;
  }
  return <Navigate to="/auth" replace />;
}

export default function App() {

  return (
    <div className='p-4'>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<RootRedirect />} />

          <Route path="/kitchens/:kitchenId" element={
          <ProtectedRoute>
            <IngredientsPage />
          </ProtectedRoute>
        } />

          <Route path="/kitchens" element={
          <ProtectedRoute>
            <KitchensPage />
          </ProtectedRoute>
        } />

        <Route path="/recipes" element={
          <ProtectedRoute>
            <RecipePage />
          </ProtectedRoute>
        } />

        <Route path="/recipes/session-likes" element={
          <ProtectedRoute>
            <SessionLikesPage />
          </ProtectedRoute>
        } />

        <Route path="/recipes/saved" element={
          <ProtectedRoute>
            <SavedRecipesPage />
          </ProtectedRoute>
        } />
      
        <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}