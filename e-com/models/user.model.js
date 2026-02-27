import mongoose from "mongoose";


const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "seller"],
        default: "user"
    },
     
}, { timestamps: true })

const User = mongoose.model("User", userModel);
export default User;