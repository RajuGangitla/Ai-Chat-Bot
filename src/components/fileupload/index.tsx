"use client";

import { Paperclip } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import FileUploader from "./uploader";
import { Button } from "../ui/button";
import api from "@/lib/api";
import { toast } from "../ui/use-toast";

export default function FileUpload() {
    const [open, setOpen] = useState<boolean>(false);
    const [files, setFiles] = useState<File[]>([]);


    const handleSubmit = async () => {
        const promises = files.map(async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            const response = await api.post("/uploadFiles", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        });

        try {
            const results = await Promise.all(promises);
            setOpen(false);
            setFiles([]);
            toast({
                title: "Files uploaded successfully",
            });
            console.log(results);
        } catch (error) {
            console.error("Error uploading files:", error);
            toast({
                title: "Error uploading files",
                variant: "destructive",
            });
        }
    }



    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Paperclip className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent
                    className="sm:max-w-xl h-[70vh]"
                    onInteractOutside={(e: any) => {
                        e.preventDefault();
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>Upload files</DialogTitle>
                        <DialogDescription>
                            Drag and drop your files here or click to browse.
                        </DialogDescription>
                    </DialogHeader>
                    <FileUploader
                        files={files}
                        setFiles={setFiles}
                        maxFiles={3}
                        maxSize={1024 * 1024 * 2}
                    />
                    <DialogFooter>
                        <Button disabled={files.length === 0} onClick={handleSubmit} type="submit">Upload</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
