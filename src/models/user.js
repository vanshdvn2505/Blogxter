import mongoose from 'mongoose'


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        default: ""
    },

    height: {
        type: String,
        default : ""
    },

    dob: {
        type: String,
        // default : ""
    },

    from: {
        type: String,
        // default : ""
    },

    work: {
        type: String,
        default : ""
    },
    image: {
        type: String,
        required: false,
        default: "default.png"
    },
    friends: {
        type: Array,
    },
    friendRequests: {
        type: Array,
    },
    
})

const User = mongoose.model("Users", userSchema);

export default User