"use client"

import React, { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        checkUserLoggedIn()
    }, [])

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/login`, { email, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            const { user } = response.data.data
            console.log(response)
            localStorage.setItem("user", JSON.stringify(user))
            localStorage.setItem('token', JSON.stringify(response.data.data.token))
            if (user?.isAdmin == true) {
                router.push("/admin");
            }
            // console.log('user', user)
            // console.log('data', response.data)
            setUser(user)
            console.log(user)
            router.push('/dashboard')
            toast.dismiss();
            return user
        } catch (error) {
            console.error("Login error:", error)
            toast.error('Login error:', error)
            throw error
        }
    }

    const register = async (name, cnic, email) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/register`, { name, cnic, email })
            console.log(response)
            const { user } = response.data.data
            localStorage.setItem("user", JSON.stringify(user))
            setUser(user)
            router.push('/update-password')
            toast.success('Account Registered! update your password!')
            toast.dismiss();
            return user
        } catch (error) {
            console.error("Register error:", error)
            toast.error('Register error:', error)
            throw error
        }
    }

    const logout = () => {
        toast.success('Logged out!')
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/");
        setUser('')
    }

    const checkUserLoggedIn = async () => {
        const isUser = localStorage.getItem("user")
        if (isUser) {
            setUser(JSON.parse(isUser))
        }
        setLoading(false)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, register }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
