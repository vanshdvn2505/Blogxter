import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    content: {
        type: String,
        required: false
    },
    photo: {
        type: String,
        required: false
    },
    userImg: {
        type: String,
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: {
        type: Array,
    },
    date: {
        type: Date,
    }
})

const Post = mongoose.model("Posts", postSchema);

export default Post;