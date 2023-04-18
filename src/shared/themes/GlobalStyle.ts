import { createGlobalStyle } from 'styled-components';

interface IPropsTheme {
  theme: {
    primaryColor: string,
    secondaryColor: string,
    backgroundColor: string,
    textColor: string,
    borderRadius: string,
  }
}

export const GlobalStyle = createGlobalStyle<IPropsTheme>`
  *{
    margin: 0;
    padding: 0;
  }

  body {
    background: ${props => props.theme.backgroundColor};
    font-family: sans-serif;
  }
`

