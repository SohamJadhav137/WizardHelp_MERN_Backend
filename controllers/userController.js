import User from "../models/user.js";

export const getUserDetails = async(req, res) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId);
        res.status(200).json({ user });
    } catch(error){
        console.error("CUSTOM ERROR!\n", error);
        res.status(500).json({ message: "Server side error occured!" });
    }
};