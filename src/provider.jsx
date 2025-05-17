import { HeroUIProvider } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export function Provider({ children }){
  const navigate = useNavigate();

  return <HeroUIProvider navigate={navigate}>{children}</HeroUIProvider>;
}
