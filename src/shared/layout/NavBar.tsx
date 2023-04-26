import { MenuApp } from "../components/header"
import { SwitchTheme } from "../components/header"
import { Logo } from "../components/header"

export const Navbar = () => {
   return (
      <MenuApp>
         <Logo/>
         <SwitchTheme />
      </MenuApp>
   )
}