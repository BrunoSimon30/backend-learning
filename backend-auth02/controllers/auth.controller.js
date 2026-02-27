import userModel from "../models/user-model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const registerUser = async (req, res) => {
   
  const { username, email, password } = req.body;
  let user = await userModel.findOne({ email: email });
  
  try {
    if (user) {
      return res.status(400).send({ message: "User already exists" });
    }
    let salt = await bcrypt.genSalt(8);
    let hash = await bcrypt.hash(password, salt);
    
    user = await userModel.create({ username, email, password: hash ,profilePicture: req.file.path});
    let token = generateToken({ email });
  
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      // 30 days - 24 hours - 60 minutes - 60 seconds - 1000 milliseconds
    });

    res.status(201).send({ message: "User created successfully", user });
  } catch (error) {
    console.log(error.message);
    return res.status(400).send({ message: error.message });
    // res.status(500).send({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email });
  try {
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    let result = await bcrypt.compare(password, user.password);
    if (result) {
      let token = generateToken({ email });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        // 30 days - 24 hours - 60 minutes - 60 seconds - 1000 milliseconds
      });
      res.status(201).send({ message: "User login successfully", user });
    } else {
      res.status(400).send({ message: "Invalid password" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal server error" });
  }
};

const logoutUser = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        // 30 days - 24 hours - 60 minutes - 60 seconds - 1000 milliseconds
      });
      res.status(200).send({ message: "User Logout successfully", user: req.user });
};

const getUserProfile = (req, res) => {
    res.send(req.user);
};

export { registerUser, loginUser, logoutUser, getUserProfile };
