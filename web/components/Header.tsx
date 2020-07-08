import * as React from "react";
import Popover from "react-popover";
import { TouchableOpacity, Image, View, Text } from "react-native";
import { useHover, useFocus } from "react-native-web-hooks";

import { logout } from "lib/auth";
import { Colors, Typography } from "theme";

import Link from "components/Link";
import { useAuthUser } from "components/AuthUserProvider";
import { MenuItem, Menu } from "components/Menu";
import { LoginWithTwitterButton } from "components/LoginWithTwitterButton";

function AvatarMenu({ photoURL, userId }) {
  const ref = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const isHovered = useHover(ref);
  const isFocused = useFocus(ref);
  return (
    <Popover
      tipSize={0.01}
      isOpen={isOpen}
      preferPlace="below"
      onOuterAction={() => setIsOpen(false)}
      body={
        <Menu>
          <Link href="/u/[id]" as={`/u/${userId}`}>
            <MenuItem style={{ paddingTop: 8 }}>
              <Text style={Typography.body}>Meu Perfil</Text>
            </MenuItem>
          </Link>
          <MenuItem onPress={logout} style={{ paddingBottom: 8 }}>
            <Text style={[Typography.body, { color: Colors.red[500] }]}>
              Sair
            </Text>
          </MenuItem>
        </Menu>
      }
    >
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        activeOpacity={1}
        ref={ref}
      >
        <Image
          source={photoURL}
          accessibilityLabel="profile"
          style={{
            borderRadius: 1000,
            height: 48,
            width: 48,
            borderColor: isFocused ? Colors.indigo[200] : Colors.grey[300],
            opacity: isHovered && !isOpen ? 0.75 : 1,
            borderWidth: 4,
          }}
        />
      </TouchableOpacity>
    </Popover>
  );
}

const UnrepliedCounterBadge = ({ unrepliedCount }) => {
  const ref = React.useRef(null);
  const isHovered = useHover(ref);
  return (
    <Link href="/messages">
      <TouchableOpacity
        ref={ref}
        style={{
          borderRadius: 8,
          backgroundColor: isHovered ? Colors.grey[200] : Colors.grey[300],
          paddingVertical: 4,
          paddingHorizontal: 8,
          marginRight: 24,
        }}
      >
        <Text
          style={[Typography.small, { color: Colors.grey[600] }]}
        >{`${unrepliedCount} Mensagens`}</Text>
      </TouchableOpacity>
    </Link>
  );
};

export default function Header() {
  const authUser = useAuthUser();
  return (
    <View
      accessibilityTraits="header"
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 32,
        flexDirection: "row",
      }}
    >
      <Image
        source={require("public/dog-emoji.png")}
        accessibilityLabel="dog emoji"
        style={{ borderRadius: 1000, height: 48, width: 48 }}
      />
      {authUser ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <UnrepliedCounterBadge unrepliedCount={authUser.unrepliedCount} />
          <AvatarMenu photoURL={authUser.photoURL} userId={authUser.id} />
        </View>
      ) : (
        <LoginWithTwitterButton />
      )}
    </View>
  );
}
