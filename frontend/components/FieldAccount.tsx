import { Text } from "react-native";

export function FieldAccount({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <>
      <Text className="text-2xl font-bold text-[#3e009c] mt-3 mb-2">
        {label}
      </Text>
      <Text className="text-lg">{value}</Text>
    </>
  );
}
