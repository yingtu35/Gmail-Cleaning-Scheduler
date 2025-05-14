import Image from "next/image";
import logo from "@/public/logo.svg";
import { LandingLogo } from "./constants/landing";
export default function Logo() {
  return (
    <Image
      src={logo}
      alt={LandingLogo.alt}
      width={LandingLogo.width}
      height={LandingLogo.height}
    />
  )
}