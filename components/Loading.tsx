import { ActivityIndicator, View } from "react-native";
import { cn } from "@/lib/utils";
export function Loading({
  className,
  size,
  color,
  ...props
}: {
  className?: string;
  size?: "small" | "large";
  color?: string;
}) {
  return (
    <View
      className={cn(className, "bg-primary flex-1 justify-center items-center")}
    >
      <ActivityIndicator
        size={size || "large"}
        color={color || "#ffff"}
        {...props}
      />
    </View>
  );
}
