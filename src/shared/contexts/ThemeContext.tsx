import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ThemeProvider } from '@mui/material'


import { LightTheme } from '../themes/Light'
import { DarkTheme } from '../themes/Dark'
import { Box } from "@mui/system";

interface IThemeData {
   themeName: 'light' | 'dark',
   toggleTheme: () => void
}

interface IAppThemeProviderProps {
   children: React.ReactNode
}

const ThemeContext = createContext<IThemeData>({

} as IThemeData)

export const AppThemeContext = () => {
   return useContext(ThemeContext)
}

export const AppThemeProvider: React.FC<IAppThemeProviderProps> = ({
   children
}) => {

   const [themeName, setThemeName] = useState<'light' | 'dark'>('light')


   const toggleTheme = useCallback(() => {
      setThemeName(oldThemeName => oldThemeName === 'light' ? 'dark' : 'light')
   }, [])

   const theme = useMemo(() => {
      if (themeName === 'light') return LightTheme

      return DarkTheme
   }, [themeName])

   return (
      <div>
         <ThemeContext.Provider value={{ themeName, toggleTheme }}>
            <ThemeProvider theme={theme}>
               <Box width='100vw' height='100vh' bgcolor={theme.palette.background.default}>
                  {children}
               </Box>

            </ThemeProvider>
         </ThemeContext.Provider>
      </div>
   )

}