import * as React from "react";
import { useAlert } from "react-alert";

import { View, Text, TouchableOpacity } from "react-native";

import Textarea from "components/Textarea";
import { Typography, Colors } from "theme";

export function SendMessageField({ onSend }) {
  const [message, setMessage] = React.useState("");
  const canSubmit = message.length > 0 && message.length < 200;
  const alert = useAlert();
  const send = (msg) => {
    onSend(msg).then(
      () => alert.success("Mensagem enviada!"),
      () => alert.error("Opa deu algo errado :(")
    );
    setMessage("");
  };
  return (
    <View>
      <Text style={Typography.subheader}>Envie algo anonimamente</Text>
      <Textarea
        textLimit={200}
        onChangeText={(text) => setMessage(text)}
        placeholder="Digite algo aqui!!!!!!!!!!!"
        value={message}
        style={{ marginVertical: 12 }}
      />
      <TouchableOpacity
        onPress={() => send(message)}
        disabled={!canSubmit}
        style={{
          marginLeft: "auto",
          borderRadius: 10,
          backgroundColor: Colors.black,
          opacity: canSubmit ? 1 : 0.5,
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
      >
        <Text style={[Typography.body, { color: Colors.white }]}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}
