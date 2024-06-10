import mongoose from "mongoose"

const connectDb = async () => {
    const connectionState = mongoose.connection.readyState

    if (connectionState === 1) {
        console.log("Already connected")
        return
    }

    if (connectionState === 2) {
        console.log("Connecting ...")
        return
    }
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log("Connected");
    } catch (error: any) {
        console.log("erroor in connectin databse", error)
        throw new Error("Error: ", error);
    }
}

export default connectDb