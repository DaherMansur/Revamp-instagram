
import { ThemeProvider } from '@mui/material'
import { AppRoutes } from './routes/web'
import { LightTheme } from './shared/themes/Light'

function App() {
  return (
    <ThemeProvider theme={LightTheme}>
      <AppRoutes />
    </ThemeProvider>

  )
}

export default App
