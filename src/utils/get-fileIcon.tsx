import { FaFileImage, FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt } from "react-icons/fa";


export const getFileIcon = (fileType: string, size: number) => {
    if (fileType.startsWith("image/")) {
        return <FaFileImage className={`w-${size} h-${size} text-blue-500`} />;
    } else if (fileType === "application/pdf") {
        return <FaFilePdf className={`w-${size} h-${size} text-red-500`} />;
    } else if (fileType === "application/msword" || fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return <FaFileWord className={`w-${size} h-${size} text-blue-700`} />;
    } else if (fileType === "application/vnd.ms-excel" || fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        return <FaFileExcel className={`w-${size} h-${size} text-green-500`} />;
    } else {
        return <FaFileAlt className={`w-${size} h-${size} text-gray-500`} />;
    }
};