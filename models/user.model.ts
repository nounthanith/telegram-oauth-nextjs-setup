import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
    {
        telegramId: { type: String, required: true, unique: true },
        name: String,
        username: String,
        image: String,
        telegramUserId: Number,
        chatId: Number,
        botStarted: { type: Boolean, default: false },
        role: { type: String, enum: ["user", "owner", "admin"], default: "user" },
    },
    { timestamps: true }
)

export const User = mongoose.models.User ?? mongoose.model("User", UserSchema)