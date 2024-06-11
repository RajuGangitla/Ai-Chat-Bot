import mongoose, { model, models } from "mongoose"


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
})


// const Users = models.Users || model('Users', userSchema);
export default mongoose.models?.Users || mongoose.model('Users', userSchema)

// export default Users