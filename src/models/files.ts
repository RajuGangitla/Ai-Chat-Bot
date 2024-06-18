import mongoose from "mongoose";



const FileSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        requried: true
    },
    isVectorised: {
        type: Boolean,
        required: false,
        default: false
    }
},
    {
        timestamps: true
    }
)

export default mongoose.models?.Files || mongoose.model("Files", FileSchema)