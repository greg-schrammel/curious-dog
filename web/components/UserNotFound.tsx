import * as React from "react";
import { Text } from "react-native";
import Layout from "components/Layout";

const UserNotFound = () => (
  <Layout>
    <Text style={{ textAlign: "center", paddingVertical: 64 }}>
      Esse usuario não existe
    </Text>
  </Layout>
);

export default UserNotFound;
