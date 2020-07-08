import * as React from "react";
import { onAuthStateChanged } from "lib/auth";
import { User, observeUser } from "lib/user";

const AuthUserContext = React.createContext<User>(null);

export const AuthUserProvider = ({ user, children }) => (
  <AuthUserContext.Provider value={user}>{children}</AuthUserContext.Provider>
);
export const useAuthUser = (): User => {
  const currentCtxUser = React.useContext(AuthUserContext);
  const [authUser, setAuthUser] = React.useState(currentCtxUser);
  React.useEffect(() => {
    let stopUserObserver;
    const stopAuthStateObserver = onAuthStateChanged((u) => {
      if (u) {
        stopUserObserver = observeUser(u.uid, setAuthUser);
      } else setAuthUser(null);
    });
    return () => {
      if (stopUserObserver) stopUserObserver();
      stopAuthStateObserver();
    };
  }, []);

  return authUser;
};
