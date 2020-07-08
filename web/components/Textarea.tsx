import * as React from "react";
import TextareaAutosize from "react-autosize-textarea";
import { StyleProp, View, ViewStyle, Text } from "react-native";
import { Shadow, Colors, Typography } from "theme";

interface TextareaProps {
  onChangeText: (e: string) => void;
  value: string;
  placeholder: string;
  textLimit: number;
  style?: StyleProp<ViewStyle>;
}

export default function Textarea({
  onChangeText,
  value,
  placeholder,
  textLimit,
  style,
}: TextareaProps) {
  const hasTextOverflow = value.length > textLimit;
  return (
    <View
      style={[
        Shadow.large,
        { padding: 16, paddingBottom: 0, borderRadius: 16 },
        style,
      ]}
    >
      <TextareaAutosize
        onChange={(e) => onChangeText(e.currentTarget.value)}
        placeholder={placeholder}
        value={value}
        rows={2}
        style={{
          fontSize: 16,
          fontWeight: 400,
          fontFamily: "Inter",
          border: "none",
          resize: "none",
          outline: "none",
        }}
      />
      <Text
        style={[
          Typography.small,
          {
            textAlign: "right",
            paddingVertical: 8,
            color: hasTextOverflow ? Colors.red[500] : Colors.grey[600],
          },
        ]}
      >
        {value.length}/{textLimit}
      </Text>
    </View>
  );
}
