import { signIn } from "@/lib/auth"

export function LoginButton() {
  return (
    <form action={async () => { "use server"; await signIn("telegram") }}>
      <button type="submit">Login with Telegram</button>
    </form>
  )
}