import { CustomInputProps } from "@/type";
import cn from "clsx";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

const CustomInput = ({
  placeholder = "Enter text",
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = "default",
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View className="w-full">
      <Text className="label">{label}</Text>
      <TextInput
        className={cn("input", isFocused ? "border-primary" : "border-gray-300")}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={isFocused ? "#000" : "#888"}
      />
    </View>
  );
};

export default CustomInput;
