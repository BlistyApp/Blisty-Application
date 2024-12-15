import { TextInput, TextInputProps } from "react-native";
import { styled } from "nativewind";
import { forwardRef, RefObject } from "react";

const StyledTextInput = styled(TextInput);

interface InputProps extends TextInputProps {
  ref?: RefObject<TextInput>;
}

const InputComponent = forwardRef<TextInput, InputProps>(
  ({ ...props }, ref) => {
    return (
      <StyledTextInput
        ref={ref}
        style={{ borderWidth: 2, borderColor: "black" }}
        className="web:flex h-10 native:h-12 web:w-full border-2 border-black rounded-md bg-background px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2"
        keyboardType="default"
        {...props}
      />
    );
  }
);

InputComponent.displayName = "Input";

export const Input = InputComponent;
