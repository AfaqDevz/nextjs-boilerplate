// "use client";

// import axios from "axios";
// import { createContext, useCallback, useContext, useEffect, useState } from "react";
// import toast from "react-hot-toast";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const token = "59230";
//         const storedUser = sessionStorage.getItem("user");

//         if (token && storedUser) {
//             try {
//                 const parsedUser = JSON.parse(storedUser);
//                 setUser(parsedUser);

//             } catch (error) {
//                 console.error("Failed:", error);
//             }
//         }
//     }, []);

//     async function authUser(url, data) {
//         console.log("url", process.env.NEXT_PUBLIC_BACKEND_URL, url, data);
//         try {
//             const res = await axios.post(
//                 process.env.NEXT_PUBLIC_BACKEND_URL + url,
//                 data
//             );
//             console.log("res=>", res.data);


//             toast.success(res.data.message);

//             sessionStorage.setItem("user", JSON.stringify(res.data.data));

//             setUser(res.data.data);
//         } catch (error) {
//             if (axios.isAxiosError(error)) {
//                 console.log("Error => ", error?.response?.data);
//                 toast.error(error?.response?.data?.message);
//             } else {
//                 console.log("Error => ", error);
//             }
//         }
//     }

//     const logOutUser = useCallback(() => {
//         sessionStorage.removeItem("authToken");
//         sessionStorage.removeItem("user");
//         setUser(null);
//         toast.success("Logged out succesfully!");
//     }, []);

//     return (
//         <AuthContext.Provider value={{ user, authUser, logOutUser }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         console.log('useAuth must be used within an AuthProvider')
//     }
//     return context;
// };

"use client"

import React, { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isFirstLogin, setIsFirstLogin] = useState(false)

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("token")
        if (token) {
            axios
                .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    setUser(response.data)
                    setIsFirstLogin(response.data.isFirstLogin)
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error)
                    localStorage.removeItem("token")
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }
    }, [])

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/login`, { email, password })
            const { token, isFirstLogin } = response.data.data
            localStorage.setItem("token", token)
            setUser({ email })
            setIsFirstLogin(isFirstLogin)
            return { isFirstLogin }
        } catch (error) {
            console.error("Login error:", error)
            throw error
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
        setIsFirstLogin(false)
    }

    const getToken = () => {
        return localStorage.getItem("token")
    }

    const updatePassword = async (email, tempPassword, newPassword) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/update-password`, {
                email,
                tempPassword,
                newPassword,
            })
            setIsFirstLogin(false)
            return response.data
        } catch (error) {
            console.error("Update password error:", error)
            throw error
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, getToken, loading, isFirstLogin, updatePassword }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

