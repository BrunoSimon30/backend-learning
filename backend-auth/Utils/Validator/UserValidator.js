import { z } from "zod";

const loginValidator = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string(),
});

// Signup/Register Validator
 const registerValidator = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  userType: z.enum(["admin", "user"]).optional(),
   
});

const verifyOtpValidator = z.object({
  otp: z.string().min(4, "OTP must be 4 digits"),
  reason: z.enum(["verification", "register", "forgetPassword"]),
});


export { registerValidator ,verifyOtpValidator , loginValidator };