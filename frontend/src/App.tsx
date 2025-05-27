import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import PrivateRoute from './components/PrivateRoute'
import { API_BASE_URL } from "./utils/api"
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUser, clearUser } from './store/authSlice'

function App() {
  
  const dispatch = useDispatch()
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/auth/session`, {
          withCredentials: true,
        })
        dispatch(setUser(res.data.user))
      } catch {
        dispatch(clearUser())
      }
    }

    initAuth()
  }, [])
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
