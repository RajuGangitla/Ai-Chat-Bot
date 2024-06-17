import Dropzone, {
    type DropzoneProps,
    type FileRejection,
} from "react-dropzone";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "../ui/use-toast";
import React from "react";
import { UploadIcon } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import FileCard from "./file-card";

interface IUploader {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    maxFiles: number;
    maxSize: number;
    multiple?: boolean;
    accept?: DropzoneProps["accept"];
}

export default function FileUploader({
    files,
    setFiles,
    maxFiles,
    maxSize,
    multiple,
    accept,
}: IUploader) {
    const onDrop = React.useCallback(
        (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
                toast({
                    title: "Cannot upload more than 1 file at a time",
                });
                return;
            }

            if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
                toast({
                    title: `Cannot upload more than ${maxFiles} files`,
                });
                return;
            }

            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );

            const updatedFiles = files ? [...files, ...newFiles] : newFiles;

            setFiles(updatedFiles);

            if (rejectedFiles.length > 0) {
                rejectedFiles.forEach(({ file }) => {
                    toast({
                        title: `File ${file.name} was rejected`,
                    });
                });
            }
        },

        [files, setFiles]
    );

    function onRemove(index: number) {
        if (!files) return;
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
    }

    const isDisabled = (files?.length ?? 0) >= maxFiles;

    return (
        <>
            <div className="relative flex flex-col gap-6 overflow-hidden">
                <Dropzone
                    onDrop={onDrop}
                    accept={accept}
                    maxSize={maxSize}
                    maxFiles={maxFiles}
                    multiple={maxFiles > 1 || multiple}
                    disabled={isDisabled}
                >
                    {({ getRootProps, getInputProps, isDragActive }) => (
                        <div
                            {...getRootProps()}
                            className={cn(
                                "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
                                "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                isDragActive && "border-muted-foreground/50",
                                isDisabled && "pointer-events-none opacity-60"
                            )}
                        >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                                    <div className="rounded-full border border-dashed p-3">
                                        <UploadIcon
                                            className="size-7 text-muted-foreground"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <p className="font-medium text-muted-foreground">
                                        Drop the files here
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                                    <div className="rounded-full border border-dashed p-3">
                                        <UploadIcon
                                            className="size-7 text-muted-foreground"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="space-y-px">
                                        <p className="font-medium text-muted-foreground">
                                            Drag {`'n'`} drop files here, or click to select files
                                        </p>
                                        <p className="text-sm text-muted-foreground/70">
                                            You can upload
                                            {maxFiles > 1
                                                ? ` ${maxFiles === Infinity ? "multiple" : maxFiles}
                      files (up to ${formatBytes(maxSize)} each)`
                                                : ` a file with ${formatBytes(maxSize)}`}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Dropzone>
                {files?.length ? (
                    <ScrollArea className="h-fit w-full px-3">
                        <div className="max-h-48 space-y-4">
                            {files?.map((file, index) => (
                                <FileCard
                                    key={index}
                                    file={file}
                                    onRemove={() => onRemove(index)}
                                // progress={progresses?.[file.name]}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                ) : null}
            </div>
        </>
    );
}
