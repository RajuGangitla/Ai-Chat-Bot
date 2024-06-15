"use client";

import { Paperclip } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import FileUploader from "./uploader";

export default function FileUpload() {
    const [open, setOpen] = useState<boolean>(false);
    const [files, setFiles] = useState<File[]>([]);

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Paperclip className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent
                    className="sm:max-w-xl"
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
                </DialogContent>
            </Dialog>
        </>
    );
}
