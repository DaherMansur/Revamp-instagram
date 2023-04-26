import styled from "styled-components";
import '../../fonts/fonts.css'

const LogoApp = styled.h1`
  font-family: 'FonteLogo', sans-serif;
  font-size: 2rem;
  color: #000;
  letter-spacing: 2px;
  font-weight: lighter;
  text-transform: uppercase;
`;

export const Logo = () => {
   return (
      <LogoApp>
         snapster
      </LogoApp>
   )
}