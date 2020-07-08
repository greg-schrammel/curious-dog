import * as React from "react";
import { View } from "react-native";
import Header from "./Header";

const Layout = ({ children }) => (
  <View style={{ alignItems: "center" }}>
    <View style={{ maxWidth: 768, width: "100%", padding: 32 }}>
      <Header />
      {children}
    </View>
  </View>
);

export default Layout;
