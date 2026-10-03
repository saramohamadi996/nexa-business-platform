import AuthProvider from './components/AuthProvider'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
  )
}

export default App