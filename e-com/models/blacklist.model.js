import mongoose from "mongoose";


const blacklistModel = new mongoose.Schema({
    token: {
        type: String,
        required: true
    }
}, { timestamps: true })

blacklistModel.index({ token: 1 }, { unique: true });

const Blacklist = mongoose.model("Blacklist", blacklistModel);
export default Blacklist;