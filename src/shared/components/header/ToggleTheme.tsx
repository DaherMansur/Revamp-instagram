import { useState } from 'react';
import Switch from 'react-switch';
import { AppThemeContext } from '../../contexts/ThemeContext';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../../themes/Theme';

export const SwitchTheme = () => {
   const { themeName, toggleTheme } = AppThemeContext();
   const [isDarkMode, setIsDarkMode] = useState(themeName === 'dark');

   const handleToggle = () => {
      toggleTheme()
      setIsDarkMode(!isDarkMode);
   };

   const theme = isDarkMode ? darkTheme : lightTheme;

   return (
      <ThemeProvider theme={theme}>
         <Switch
            onChange={handleToggle}
            checked={isDarkMode}
            onColor="#007AFF"
            checkedIcon={false}
            uncheckedIcon={false}
            height={20}
            width={40}
            handleDiameter={16}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
         />
      </ThemeProvider>
   );
};
