import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { LandingLogo } from "@/app/constants/landing";
export default function Logo() {
  return (
    <Link href="/">
      <Image
        src={logo}
        alt={LandingLogo.alt}
        width={LandingLogo.width}
        height={LandingLogo.height}
      />
    </Link>
  )
}