import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
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

export async function GET() {
  const session = await auth()
  const userId = (session?.user as { id?: string } | undefined)?.id

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectDB()
  const user = (await User.findById(userId).lean()) as unknown as (
    | (UserResponse & { _id: { toString(): string } })
    | null
  )

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      image: user.image,
      role: user.role,
      telegramId: user.telegramId,
      botStarted: user.botStarted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  })
}
