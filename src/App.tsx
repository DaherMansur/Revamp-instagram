
import { AppRoutes } from './routes/web'
import { AppThemeProvider } from './shared/contexts/ThemeContext'

function App() {
  return (
    <AppThemeProvider>
      <AppRoutes />
    </AppThemeProvider>
  )
}

export default App
