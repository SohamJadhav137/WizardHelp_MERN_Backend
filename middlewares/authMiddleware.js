import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {

    let token = req.cookies?.token;

    // if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    //     token = req.headers.authorization.split(" ")[1];
    // }

    if(!token){
        return res.status(401).json({message: "Not authorized"});
    }

    try{
        const jwt_payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(jwt_payload.id).select("-password");
        next();
    } catch (error) {
        return res.status(401).json({message: "Not authorized, token failed"});
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message: `Role ${req.user.role} not allowed`});
        }
        next();
    };
};