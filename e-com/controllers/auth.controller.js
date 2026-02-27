import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import BlacklistModel from "../models/blacklist.model.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" ,success: false});
    }
    const exisitngUser = await userModel.findOne({ email });
    if (exisitngUser) {
      return res.status(400).json({ message: "User already exists" ,success: false});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    const token = generateToken({ _id: user._id });

    res.status(200).json({ message: "User registered successfully", user,token ,success: true});
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false});
     
  }
};


const loginUser = async (req, res, next)=>{
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" ,success: false});
        }
        const user = await userModel.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "User not found" ,success: false});
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = generateToken({ _id: user._id });
        res.status(200).json({ message: "User logged in successfully", user,token ,success: true});
    }
    catch(err){
        res.status(500).json({ message: "Internal server error", success: false});
    }
}


const logoutUser = async (req, res, next)=>{
    try{
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(400).json({ message: "Token is required" });
        }
        await BlacklistModel.create({ token });
        res.status(200).json({ message: "User logged out successfully" });
    }
    catch(err){
        next(err);
    }
}

const getUser = async (req, res, next)=>{
    try{
        const user = await userModel.findById(req.user._id);
        if(!user){
            return res.status(400).json({ message: "User not found" ,success: false});
        }
        res.status(200).json({ message: "User fetched successfully", user ,success: true});
    }
    catch(err){
        res.status(500).json({ message: "Internal server error", success: false});
    }
}


export { registerUser, loginUser,logoutUser, getUser };
