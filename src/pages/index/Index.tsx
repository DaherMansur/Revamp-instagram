import { Button } from "@mui/material"

//Context
import { AppThemeContext } from "../../shared/contexts/ThemeContext"

export const Index = () => {
   const { toggleTheme } = AppThemeContext()

   return (
      <Button
         variant="contained"
         color="primary"
         onClick={toggleTheme}
      >
         toggleTheme
      </Button>
   )
}