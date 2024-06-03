import { FieldError } from "react-hook-form"
import { Label } from "./label"


interface FormRowProps {
    label: string
    required: boolean
    errors: FieldError | undefined
    name: string
    children: React.ReactNode
    className?: string
}

export default function ReusableFormRow({ label, required, errors, name, children, className }: FormRowProps) {
    return (
        <>
            <div className={`flex flex-col ${className}`}>
                <Label className="mb-4" htmlFor={name}>{label} {required && <span className="text-red-500">*</span>}</Label>
                {children}
                {errors && (
                    <p className="text-xs text-red-500 mt-1">
                        {errors.message}
                    </p>
                )}
            </div>
        </>
    )
}