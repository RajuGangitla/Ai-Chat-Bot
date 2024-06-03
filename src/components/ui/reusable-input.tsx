import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Input } from "./input";

interface IResubaleInputProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>; // Generic type for control
    name: Path<TFieldValues>; // Ensure name is a valid path in TFieldValues
    required: boolean;
    placeholder: string;
    type: string;
    validationRules?: Record<string, any>;
    disabled?: boolean;
}

const ReusableInput = <TFieldValues extends FieldValues>({
    control,
    name,
    required,
    placeholder,
    type,
    validationRules,
    disabled
}: IResubaleInputProps<TFieldValues>) => {
    return (
        <Controller
            control={control}
            name={name}
            rules={{
                ...(required && { required: `${name} is required` }), // Add required rule if required prop is true
                ...validationRules, // Add additional validation rules
            }}
            render={({ field }) => (
                <Input
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...field}
                />
            )}
        />
    );
}

export default ReusableInput;