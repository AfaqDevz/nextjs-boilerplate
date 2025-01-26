"use client"

import React, { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, { email, password })
            const { token, user } = response.data
            localStorage.setItem("token", token)
            setUser(user)
            return user
        } catch (error) {
            console.error("Login error:", error)
            throw error
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
        router.push("/login")
    }

    const checkUserLoggedIn = async () => {
        const token = localStorage.getItem("token")
        if (token) {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUser(response.data.user)
            } catch (error) {
                console.error("Auth check error:", error)
                localStorage.removeItem("token")
            }
        }
        setLoading(false)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
