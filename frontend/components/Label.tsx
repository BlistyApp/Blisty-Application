import { Text } from "react-native";

export function Label({ children, className, ...props }: { children: React.ReactNode, className?: string }) {
  return (
    <Text
      className= {`native:text-lg text-foreground font-medium px-0.5 py-1.5 leading-none text-sm text-foreground native:text-base web:peer-disabled:cursor-not-allowed web:peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </Text>
  );
}
