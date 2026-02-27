import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    image:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "FileUpload",
        required: false,
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
    userType: {
        type: String,
        required: true,
        enum: ["admin", "user"],
        default: "user",
    },
   
 
}, { timestamps: true });

userSchema.methods.transform = function () {
    const obj = this.toObject();
    const fields = [
      "_id",
      "fullName",
      "email",
      "image",
      "isVerified",
      "userType",
      "createdAt",
      "updatedAt",
    ];
    const transformed = {};
    fields.forEach((field) => {
      if (obj[field] !== undefined) transformed[field] = obj[field];
    });
    return transformed;
  };

const User = mongoose.model("User", userSchema);
export default User;