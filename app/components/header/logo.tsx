import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.svg";
export default function Logo() {
  return (
    <Link href="/">
      <Image
        src={logo}
        alt="logo"
        width={150}
        height={150}
      />
    </Link>
  )
}