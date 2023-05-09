import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    hash: { type: String, required: true },
    isVerified: { type: Boolean, required: true, default: false },
});

userSchema.virtual("publicProjection").get(function () {
    return {
        id: this._id,
        name: this.name,
    };
});

const User = new mongoose.model("user", userSchema);
export default User;
