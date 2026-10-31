import { LoginButton } from "@/components/LoginButton";
import Link from "next/link";
export default function Home() {
  return (
    <div>
      <LoginButton />
      <Link href={"/users"}>Profile</Link>
    </div>
  );
}
