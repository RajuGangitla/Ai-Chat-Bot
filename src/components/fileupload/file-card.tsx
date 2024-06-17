import { formatBytes } from "@/lib/utils";
import { Button } from "../ui/button";
import Image from "next/image";
import { X } from "lucide-react";
import { FaFileImage, FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt } from "react-icons/fa";

interface IFileCard {
    key: number;
    file: File;
    onRemove: () => void;
}

export default function FileCard({ file, onRemove }: IFileCard) {
    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith("image/")) {
            return <FaFileImage className="w-12 h-12 text-blue-500" />;
        } else if (fileType === "application/pdf") {
            return <FaFilePdf className="w-12 h-12 text-red-500" />;
        } else if (fileType === "application/msword" || fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            return <FaFileWord className="w-12 h-12 text-blue-700" />;
        } else if (fileType === "application/vnd.ms-excel" || fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            return <FaFileExcel className="w-12 h-12 text-green-500" />;
        } else {
            return <FaFileAlt className="w-12 h-12 text-gray-500" />;
        }
    };

    return (
        <div className="relative flex items-center space-x-4">
            <div className="flex flex-1 space-x-4">
                {file?.type.startsWith("image/") ? (
                    <Image
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        width={48}
                        height={48}
                        loading="lazy"
                        className="aspect-square shrink-0 rounded-md object-cover"
                    />
                ) : (
                    getFileIcon(file.type)
                )}
                <div className="flex w-full flex-col gap-2">
                    <div className="space-y-px">
                        <p className="line-clamp-1 text-sm font-medium text-foreground/80">
                            {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {formatBytes(file.size)}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={onRemove}
                >
                    <X className="size-4" aria-hidden="true" />
                    <span className="sr-only">Remove file</span>
                </Button>
            </div>
        </div>
    );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
    return "preview" in file && typeof file.preview === "string";
}
