import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import IngredientsPage from './Components/Pages/IngredientsPage'
import RecipePage from './Components/Pages/RecipePage'
import AuthPage from './Components/Pages/AuthPage'
import ProtectedRoute from './Components/Auth/ProtectedRoute'
import KitchensPage from './Components/Pages/KitchensPage'
import SessionLikesPage from './Components/Pages/SessionLikedPage'
import SavedRecipesPage from './Components/Pages/SavedRecipesPage'
import { useAuth } from './context/useAuth'
import JoinKitchenPage from './Components/Pages/JoinKitchenPage'


function RootRedirect() {
const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return isAuthenticated ? <Navigate to="/kitchens" replace /> : <Navigate to="/auth" replace />;
}

export default function App() {

  return (
    <div className='p-4'>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<RootRedirect />} />
          <Route path="/join/:inviteCode" element={<JoinKitchenPage />} />

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