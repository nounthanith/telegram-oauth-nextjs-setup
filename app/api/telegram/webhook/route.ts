import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/user.model"
import { sendMessage } from "@/lib/telegram"

export async function POST(req: Request) {
  if (
    req.headers.get("x-telegram-bot-api-secret-token") !==
    process.env.TELEGRAM_WEBHOOK_SECRET
  ) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const update = await req.json()
  const msg = update.message

  if (msg?.text?.startsWith("/start")) {
    await connectDB()
    await User.findOneAndUpdate(
      { telegramUserId: msg.from.id },
      { $set: { chatId: msg.chat.id, botStarted: true } }
    )
    await sendMessage(msg.chat.id, "Welcome! You will now get notifications here.")
  }

  return NextResponse.json({ ok: true })
}