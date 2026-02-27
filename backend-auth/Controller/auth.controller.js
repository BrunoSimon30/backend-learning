import {
  loginValidator,
  registerValidator,
  verifyOtpValidator,
} from "../Utils/Validator/UserValidator.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateToken } from "../Utils/generateToken.js";
import User from "../Models/user.model.js";
import FileUpload from "../Models/fileUpload.model.js";
import OTP from "../Models/otp.model.js";
import { sendEmail } from "../Utils/SendEmail.js";

const login = async (req, res) => {
  try {
     
    const result = loginValidator.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message:
          Object.values(result.error.flatten().fieldErrors)
            .flat()
            .find(Boolean) ?? "Invalid input",
      });
    }
 
    
    const { email, password } = result.data;
    const user = await User.findOne({ email });
 
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
    const token = await generateToken({ id: user._id });
    const userData = await User.findById(user._id)
    const data = userData.transform();
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: data,
        token,
      },
    });
  } catch (err) {
    console.log(err.message  );
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const register = async (req, res) => {
  try {
    const result = registerValidator.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message:
          Object.values(result.error.flatten().fieldErrors)
            .flat()
            .find(Boolean) ?? "Invalid input",
      });
    }

    const { email, password, userType } = result.data;

    // 🔹 Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 🔹 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Create user first
    const user = await User.create({
      fullName: req.body.fullName || req.body.name || "",
      email,
      password: hashedPassword,
      userType: userType || "user",
    });

    // 🔹 Handle file (clean URL path)
    if (req.file) {
      const fileData = await FileUpload.create({
        file: `/uploads/${req.file.filename}`, // ✅ clean path
        fileType: req.file.mimetype,
        User: user._id,
      });

      user.image = fileData._id;
      await user.save();
    }
    const otpcode = crypto.randomInt(1000, 10000);
    if (otpcode) {
      const otp = await OTP.create({
        otpKey: otpcode,
        user: user._id,
        expireAt: Date.now() + 1000 * 60 * 5,
        reason: "register",
      });
      user.otp = otp._id;
      await user.save();
    }
    await sendEmail(user.email, "OTP Verification", otpcode, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Email not sent",
        });
      }
    });

    // 🔹 Generate token
    const token = await generateToken({ id: user._id });

    const userData = await User.findById(user._id);
    const data = userData.transform();
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: data,
        token,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const user = req.user;
    const result = verifyOtpValidator.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message:
          Object.values(result.error.flatten().fieldErrors)
            .flat()
            .find(Boolean) ?? "Invalid input",
      });
    }

    const { otp, reason } = result.data;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Reason is required",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp) {
      return res.status(400).json({
        success: false,
        message: "No OTP found for this user. Please register again.",
      });
    }

    const otpRef = await OTP.findById(user.otp);
    if (!otpRef) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    if (otpRef.otpUsed) {
      return res.status(400).json({
        success: false,
        message: "OTP already used",
      });
    }

    if (new Date() > otpRef.expireAt) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (String(otp) !== String(otpRef.otpKey)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    otpRef.otpUsed = true;
    otpRef.reason = reason;
    await otpRef.save();

    user.isVerified = true;
    await user.save();

    const token = await generateToken({ id: user._id });
    const userData = await User.findById(user._id);
    const data = userData.transform();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: {
        user: data,
        token,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export { register, verifyOtp, login };
