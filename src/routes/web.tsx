import {
   BrowserRouter as Router,
   Routes as Switch,
   Route,
   Navigate
} from 'react-router-dom'

//Pages
import { Index } from '../pages/index/Index'

export const AppRoutes = () => {
   return (
      <Router>
         <Switch>
            <Route 
               path="/"
               element={<Index/>}
            />
            <Route 
               path="*"
               element={<Navigate to="/"/>}
            />
         </Switch>
      </Router>
   )
}
