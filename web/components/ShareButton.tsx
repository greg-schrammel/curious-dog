import * as React from "react";

import { TouchableOpacity, Text, Share } from "react-native";

import { Typography, Colors } from "theme";
import { useHover } from "react-native-web-hooks";
import { useAlert } from "./Alert";

export default function ShareButton({ onShared = undefined }) {
  const ref = React.useRef(null);
  const isHovered = useHover(ref);
  const alert = useAlert();
  const onShare = () => {
    Share.share({
      message: "Me envie algo anonimamente!",
    }).then(
      (result) => {
        if (result.action === Share.sharedAction) onShared(result);
      },
      (e: Error) => {
        if (e.message.includes("Share is not supported in this browser"))
          return alert.error("Não da para compartilhar por este navegador :/");
        alert.error("Opa deu algo errado :(");
      }
    );
  };
  return (
    <>
      <TouchableOpacity
        onPress={onShare}
        ref={ref}
        style={{
          borderRadius: 8,
          borderColor: Colors.black,
          backgroundColor: isHovered ? Colors.grey[200] : "transparent",
          borderWidth: 1,
          paddingVertical: 8,
          paddingHorizontal: 16,
          alignSelf: "flex-start",
        }}
      >
        <Text style={Typography.body}>Compartilhar Perfil</Text>
      </TouchableOpacity>
    </>
  );
}
