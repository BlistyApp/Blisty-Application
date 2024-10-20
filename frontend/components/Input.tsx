import { TextInput } from "react-native";
import { styled } from 'nativewind';

const StyledTextInput = styled(TextInput)

export function Input({ ...props }) {
  return (
    <StyledTextInput
      style={{ borderWidth: 2, borderColor: "black" }}
      className="web:flex h-10 native:h-12 web:w-full border-2 border-black rounded-md bg-background px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2"
      keyboardType="default"
      {...props}
    />
  );
}
