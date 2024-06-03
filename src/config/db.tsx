import mongoose from "mongoose"

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
    } catch (error) {
        console.log("erroor in connectin databse", error)
    }
}

export default connectDb