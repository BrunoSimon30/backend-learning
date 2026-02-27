import jwt from "jsonwebtoken";


const generateToken = (token)=>{
    const token = jwt.sign(token, process.env.JWT_SECRET);
    return token;
}

const verifyToken = (token)=>{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
}

export { generateToken, verifyToken };