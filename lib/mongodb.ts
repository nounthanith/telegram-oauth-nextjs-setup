import mongoose from "mongoose"

const cached = (global as any).mongooseCache ?? ((global as any).mongooseCache = { conn: null, promise: null })

export async function connectDB() {
  if (cached.conn) return cached.conn
  cached.promise ??= mongoose.connect(process.env.MONGODB_URI!)
  cached.conn = await cached.promise
  return cached.conn
}