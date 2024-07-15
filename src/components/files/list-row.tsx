import { formatBytes } from "@/lib/utils";
import { getFileIcon } from "@/utils/get-fileIcon";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../ui/use-toast";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "@/types/signup";
import api from "@/lib/api";


export default function FileListRow({ file }: { file: any }) {

    const queryclient = useQueryClient()


    const { mutate: deleteFile, isPending } = useMutation({
        mutationFn: async (data: string) => {
            return await api.delete(`/uploadFiles`, data)
        },
        onSuccess: (data: any) => {
            toast({
                title: "File Deleted Successfully",
            });
            queryclient.refetchQueries({ queryKey: ['getAllFiles'] })
        },
        onError: (error: AxiosError) => {
            if (axios.isAxiosError(error) && error.response?.data) {
                const errorResponse = error.response.data as ErrorResponse; // Type assertion
                toast({
                    title: errorResponse.message,
                });
                console.log(errorResponse.message, "error");
            }
        },
    });
    return (
        <>
            <div className="grid grid-cols-[40px_1fr_80px_80px_40px] items-center gap-4 bg-muted/20 px-4 py-3 rounded-md">
                {getFileIcon(file.type, 5)}
                <div className="flex flex-col">
                    <span className="font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground">{formatBytes(file.size)}
                    </span>
                </div>
                <div className="flex items-center justify-end">
                    {/* <Toggle aria-label="Vectorized" /> */}
                </div>
                <div className="flex items-center justify-end text-xs text-muted-foreground">Vectorized</div>
                <Button variant="ghost" size="icon" className="ml-auto" onClick={() => deleteFile(file?._id)}>
                    <TrashIcon className="w-5 h-5 text-muted-foreground" />
                </Button>
            </div>
        </>
    )
}