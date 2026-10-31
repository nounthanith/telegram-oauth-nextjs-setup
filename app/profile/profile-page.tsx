import { redirect } from "next/navigation"
import { auth, signOut } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/user.model"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  await connectDB()
  const user: any = await User.findById((session.user as any).id).lean()
  if (!user) redirect("/")

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl border border-white/10 p-6 text-center">
        <img
          src={user.image}
          alt={user.name}
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
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
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
    </main>
  )
}