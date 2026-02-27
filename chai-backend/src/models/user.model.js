import mongoose from "mongoose";
import { comparePassword, hashPassword } from "../utils/hashHandler.js";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    profileImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FileUpload",
      required: false,
    },
    coverImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FileUpload",
      required: false,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isVerified: {
      type: Boolean,
      required: false,
      default: false,
    },
    otp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Otp",
      required: false,
      default: null,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);


userSchema.pre("save", async function(){
  try{
    if(!this.isModified("password")) return;
    this.password = await hashPassword(this.password);
  }
  catch(error){
    console.error("Error in pre-save hook:", error);
    throw error;
  }
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await comparePassword(password, this.password);
}



export const User = mongoose.model("User", userSchema);
