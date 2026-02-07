import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {

    // let token = req.cookies?.token;
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }
    else{
        return res.status(401).json({ message: "Authorization header missing or invalid!" })
    }

    if(!token){
        return res.status(401).json({message: "Not authorized"});
    }

    try{
        const jwt_payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(jwt_payload.id).select("-password");
        if (!user) {
            return res.status(401).json({
                message: "User no longer exists"
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({message: "Not authorized, token failed"});
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({
                message: "User not authenticated properly"
            });
        }

        if(!roles.includes(req.user.role)){
            return res.status(403).json({message: `Role ${req.user.role} not allowed`});
        }
        
        next();
    };
};