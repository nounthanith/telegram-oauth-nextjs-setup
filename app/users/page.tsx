import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth, signOut } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/user.model"

type UserResponse = {
  id: string
  name: string | null
  username: string | null
  image: string | null
  role: string
  telegramId: string | null
  botStarted: boolean
  createdAt: Date | null
  updatedAt: Date | null
}

async function UserCard() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const userId = (session.user as { id?: string } | undefined)?.id
  if (!userId) redirect("/")

  await connectDB()
  const user = (await User.findById(userId).lean()) as unknown as (
    | (UserResponse & { _id: { toString(): string } })
    | null
  )
  if (!user) redirect("/")

  return (
    <div className="w-full max-w-sm rounded-xl border border-white/10 p-6 text-center">
      <img
        src={user.image ?? undefined}
        alt={user.name ?? "User"}
        className="mx-auto h-24 w-24 rounded-full object-cover"
      />
      <h1 className="mt-4 text-xl font-semibold">{user.name}</h1>
      {user.username && (
        <a
          href={`https://t.me/${user.username}`}
          className="text-sm opacity-70 hover:opacity-100"
        >
          @{user.username}
        </a>
      )}

      <div className="mt-6 space-y-2 text-sm text-left">
        <div className="flex justify-between">
          <span className="opacity-70">Role</span>
          <span>{user.role}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-70">Joined</span>
          <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}</span>
        </div>
      </div>

      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/" })
        }}
      >
        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium"
        >
          Logout
        </button>
      </form>
    </div>
  )
}

function UserSkeleton() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-white/10 p-6 text-center animate-pulse">
      <div className="mx-auto h-24 w-24 rounded-full bg-white/10" />
      <div className="mx-auto mt-4 h-6 w-32 rounded bg-white/10" />
      <div className="mt-6 space-y-2">
        <div className="h-4 rounded bg-white/10" />
        <div className="h-4 w-24 rounded bg-white/10" />
      </div>
    </div>
  )
}

export default function UsersPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Suspense fallback={<UserSkeleton />}>
        <UserCard />
      </Suspense>
    </main>
  )
}
