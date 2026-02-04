import UserContext from "../context/user";
import { fetchUser } from "../helpers/backend";
import { useFetch } from "../helpers/hooks";

const Providers = ({ children }: { children: React.ReactNode }) => {
    const { data: user, isLoading, refetch } = useFetch("user", fetchUser, {}, {
        enabled: !!localStorage.getItem('token')
    });
    const logout = () => {
        localStorage.removeItem('token');
        refetch();
    }
    return (
        <UserContext.Provider value={{ user, isLoading, refetch , logout }}>
            {children}
        </UserContext.Provider>
    )
}

export default Providers
