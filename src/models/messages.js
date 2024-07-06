import mongoose from "mongoose";
import { nanoid } from "nanoid";

const messageSchema = mongoose.Schema({
    id: {
        type: String,
        unique: true,
    },
    users: {
        type: Array,
    },
    chat: {
        type: Array,
    }
})

const Message = mongoose.model("Messages", messageSchema);

export default Message;