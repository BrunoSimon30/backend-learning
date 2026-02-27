import jwt from "jsonwebtoken";
import userModel from "../models/user-model.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    req.user = await userModel
      .findOne({ email: decoded.email })
      .select("-password");
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).send({ message: "Unauthorized" });
  }
};
export { protect };
