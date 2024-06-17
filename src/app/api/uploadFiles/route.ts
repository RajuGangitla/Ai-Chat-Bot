import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";


// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true,
});

export const POST = async (req: NextRequest) => {

    const data = await req.formData();
    const file = await data.get("file") as unknown as File;

    console.log(file, "file")
    const fileBuffer = await file.arrayBuffer();

    var mime = file.type;
    var encoding = 'base64';
    var base64Data = Buffer.from(fileBuffer).toString('base64');
    var fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

    try {

        const uploadToCloudinary = () => {
            return new Promise((resolve, reject) => {

                var result = cloudinary.uploader.upload(fileUri, {
                    resource_type: 'auto',
                    invalidate: true
                })
                    .then((result) => {
                        console.log(result);
                        resolve(result);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    });
            });
        };

        const result: any = await uploadToCloudinary();

        let fileUrl = result.secure_url;

        return NextResponse.json(
            { success: true, fileUrl: fileUrl },
            { status: 200 }
        );
    } catch (error) {
        console.log("server err", error);
        return NextResponse.json({ err: "Internal Server Error" }, { status: 500 });
    }
};