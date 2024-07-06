import mongoose from "mongoose";

const noteSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    audio: {
        type: String,
        required: false,
    },
    photo: {
        type: String,
        required: false,
        default: "blogxter.jpeg"
    },
    userImg: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: false,
    },
    id: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expireAfterSeconds: 86300
    }
})

noteSchema.index({createdAt: 1}, {expireAfterSeconds: 86300})

const Note = new mongoose.model("Notes", noteSchema);

export default Note;