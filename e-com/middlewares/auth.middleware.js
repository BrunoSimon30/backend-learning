import userModel from "../models/user.model.js";
import BlacklistModel from "../models/blacklist.model.js";
import { verifyToken } from "../utils/generateToken.js";

const authenticateUser = async (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const isBlacklisted = await BlacklistModel.findOne({ token });
        if(isBlacklisted){
            return res.status(400).json({ message: "Token is blacklisted" });
        }
        const decoded = verifyToken(token);
        const user = await userModel.findById(decoded._id);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }
    catch(err){
        next(err.message);
    }
}

const isAuthenticatedSeller = async (req, res, next)=>{
    try{
        const user = req.user;
        if(user.role !== "seller"){
            return res.status(400).json({ message: "User is not a seller" });
        }
        next();
    }
    catch(err){
        next(err.message);
    }
}

export { authenticateUser, isAuthenticatedSeller };