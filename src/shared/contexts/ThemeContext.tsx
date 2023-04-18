import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ThemeProvider } from "styled-components";

import { lightTheme, darkTheme } from '../themes/Theme';
import { GlobalStyle } from '../themes/GlobalStyle';

interface IThemeData {
  themeName: 'light' | 'dark',
  toggleTheme: () => void
}

interface IAppThemeProviderProps {
  children: React.ReactNode
}

const ThemeContext = createContext<IThemeData>({
} as IThemeData);

export const AppThemeContext = () => {
  return useContext(ThemeContext);
};

export const AppThemeProvider: React.FC<IAppThemeProviderProps> = ({
  children
}) => {
  const [themeName, setThemeName] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setThemeName((oldThemeName) => oldThemeName === 'light' ? 'dark' : 'light');
  }, []);

  const theme = useMemo(() => {
    if (themeName === 'light') return lightTheme;
    return darkTheme;
  }, [themeName]);

  return (
    <div>
      <ThemeContext.Provider value={{ themeName, toggleTheme }}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <div>
            {children}
          </div>
        </ThemeProvider>
      </ThemeContext.Provider>
    </div>
  );
};