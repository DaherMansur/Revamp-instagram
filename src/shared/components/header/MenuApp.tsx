import styled from "styled-components";

import { SwitchTheme } from "./ToggleTheme";

type MenuAppProps = {
   children: React.ReactNode;
}

export const Container = styled.div`
   height: 60px;
   background: ${props => props.theme.backgroundMenu};
   color: #FFF;
   display: flex;
   align-items: center;
   padding: 0 30px;
   justify-content: space-between;
`

export const MenuApp:React.FC<MenuAppProps> = ({children}) => {
   return (
      <Container>
         {children}
      </Container>
   )
}
