"use client";

import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
// import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = "123456";
        const storedUser = sessionStorage.getItem("user");

        if (token && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Failed to parse user data from sessionStorage:", error);
            }
        }
    }, []);

    async function auth(url, data) {
        console.log("url => ", process.env.NEXT_PUBLIC_BACKEND_URL, url, data);
        try {
            const res = await axios.post(
                process.env.NEXT_PUBLIC_BACKEND_URL + url,
                data
            );
            console.log("res=>", res.data);
            // toast.success(res.data.message);
            sessionStorage.setItem("user", JSON.stringify(res.data.data));
            setUser(res.data.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Error => ", error?.response?.data);
                // toast.error(error?.response?.data?.message);
            } else {
                console.log("Error => ", error);
            }
        }
    }

    const logout = useCallback(() => {
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("user");
        setUser(null);
        // toast.success("You have been successfully logged out.");
    }, []);

    return (
        <AuthContext.Provider value={{ user, auth, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
