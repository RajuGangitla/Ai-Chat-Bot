import { formatBytes } from "@/lib/utils";
import { Button } from "../ui/button";
import Image from "next/image";
import { Loader, X } from "lucide-react";
import { getFileIcon } from "@/utils/get-fileIcon";


interface IFileCard {
    key: number;
    file: File;
    onRemove: () => void;
    progress: number;
}

export default function FileCard({ file, onRemove, progress }: IFileCard) {

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
                    getFileIcon(file.type, 12)
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
            {progress >= 0 && (
                <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                        <div
                            style={{ width: `${progress}%` }}
                            className="bg-blue-500 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                        ></div>
                    </div>
                    <span>{progress}%</span>
                </div>
            )}
            {progress === 100 && (
                <div className="flex items-center justify-center">
                    <Loader className="w-5 h-5 animate-spin text-gray-500" />
                </div>
            )}
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
