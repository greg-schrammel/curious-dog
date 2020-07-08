import * as React from "react";
import { Message } from "lib/message";
import { User } from "lib/user";
import { useRouter } from "next/router";
import {
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import { Shadow, Colors } from "theme";
import { FontAwesome } from "@expo/vector-icons";
import { UserInfo } from "./UserInfo";
import { Reply } from "./LastReplies";

export default function OpenMessage({
  message,
  user,
  onClose,
}: {
  message: Message;
  user: User;
  onClose: () => void;
}) {
  const router = useRouter();
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: false,
    }).start();
    const originalPath = router.asPath;
    if (!router.query.m)
      router.push(
        `${router.pathname}?m=${message.id}`,
        `${router.asPath}?m=${message.id}`,
        { shallow: true }
      );
    return () => {
      router.push(`${router.pathname}`, originalPath, { shallow: true });
    };
  }, []);
  const close = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start(() => onClose());
  };
  return (
    <TouchableWithoutFeedback onPress={close}>
      <BlurView tint="light" intensity={50} style={[StyleSheet.absoluteFill]}>
        <TouchableWithoutFeedback>
          <Animated.View
            style={[
              { transform: [{ scale: scaleAnim }] },
              {
                position: "absolute",
                top: 32,
                left: 32,
                right: 32,
                margin: "auto",
                maxWidth: 600,
              },
            ]}
          >
            <View
              style={[
                Shadow.large,
                {
                  backgroundColor: Colors.white,
                  borderRadius: 12,
                  padding: 24,
                  justifyContent: "space-between",
                  flexDirection: "row",
                },
              ]}
            >
              <View>
                <View style={{ paddingBottom: 8 }}>
                  <UserInfo user={user} />
                </View>
                <Reply message={message} />
              </View>
              <TouchableOpacity onPress={close} style={{ height: 24 }}>
                <FontAwesome name="close" size={24} color={Colors.black} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </BlurView>
    </TouchableWithoutFeedback>
  );
}
