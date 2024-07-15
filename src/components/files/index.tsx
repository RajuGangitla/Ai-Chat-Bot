"use client"

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query"
import { Button } from "../ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import FileListRow from "./list-row";


export default function FilesList() {

    const fetchFilesList = async () => {
        const response = await api.get("/uploadFiles");
        return response.data;
    }

    const { data: getAllFiles, isLoading } = useQuery({
        queryKey: ['getAllFiles'],
        queryFn: fetchFilesList,
    })



    return (
        <>
            <div className="h-[80vh] flex items-center justify-center gap-2">
                <div className="bg-background rounded-lg border p-6 w-full max-w-4xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">File Manager</h2>
                        <Button variant="outline">
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Add File
                        </Button>
                    </div>
                    <div className="grid gap-4">
                        {
                            getAllFiles?.files?.map((file: any) => (
                                <>
                                    <FileListRow file={file} />
                                </>
                            ))
                        }
                    </div>
                </div>
            </div>

        </>
    )
}