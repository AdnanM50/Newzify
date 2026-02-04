import { createContext, useContext } from "react";

interface UserContextType {
  user: any;
  isLoading: boolean;
  refetch: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    return { user: null, isLoading: false, refetch: () => {}, logout: () => {} };
  }
  return context;
}

export default UserContext

