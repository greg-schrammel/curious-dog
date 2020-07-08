import { StyleSheet } from "react-native";

const fontFamily = "Inter";

export const Typography = StyleSheet.create({
  largeHeader: {
    fontFamily,
    fontSize: 22,
    fontWeight: "700",
  },
  header: {
    fontFamily,
    fontWeight: "600",
    fontSize: 20,
  },
  subheader: {
    fontFamily,
    fontSize: 18,
    fontWeight: "500",
  },
  body: {
    fontFamily,
    fontSize: 16,
    fontWeight: "400",
  },
  small: {
    fontFamily,
    fontSize: 14,
    fontWeight: "400",
  },
});

export const Colors = {
  twitter: "#00acee",
  twitterLight: "rgb(194, 238, 255)",
  black: "#000",
  white: "#fff",
  grey: {
    100: "#fbfbfb",
    200: "#f3f3f3",
    300: "#ececec",
    400: "#dfdfdf",
    600: "#616161",
  },
  red: {
    500: "#F56565",
  },
  green: {
    500: "#48BB78",
  },
  indigo: {
    200: "#C3DAFE",
  },
} as const;

export const Shadow = StyleSheet.create({
  large: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,

    elevation: 5,
  },
});
