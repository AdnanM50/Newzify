import { useState, useEffect } from "react";
import UserContext from "../context/user";
import { fetchUser } from "../helpers/backend";
import { useFetch } from "../helpers/hooks";

const Providers = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    useEffect(() => {
        const checkToken = () => {
            const current = localStorage.getItem('token');
            setToken(prev => {
                if (prev !== current) return current;
                return prev;
            });
        };

        const interval = setInterval(checkToken, 200);
        window.addEventListener('storage', checkToken);
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', checkToken);
        };
    }, []);

    const { data: user, isLoading, refetch } = useFetch("user", fetchUser, {}, {
        enabled: !!token
    });

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        refetch();
    }

    return (
        <UserContext.Provider value={{ user, isLoading, refetch, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export default Providers
