import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
    permissions: {type: String, enum: ["candidate", "admin","superadmin"], default: "candidate"},
    isActive: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}

})



userSchema.pre("save", async function() {
    if(!this.isModified("password")) return;

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
});

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}


const userModel = mongoose.model("user", userSchema)

export default userModel;