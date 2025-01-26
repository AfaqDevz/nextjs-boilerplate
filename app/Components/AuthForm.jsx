"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Card from "./Card"
import { useAuth } from "../Context/authcontext"

const AuthForm = ({ isLogin }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        cnic: "",
        password: "",
    })
    const [error, setError] = useState("")
    const router = useRouter()
    const { login } = useAuth()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const endpoint = isLogin ? "login" : "register"
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${endpoint}`, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const data = response.data
            if (isLogin) {
                login(data.token) // Use the login function from useAuth
                if (data.isFirstLogin) {
                    router.push("/update-password")
                } else {
                    router.push("/dashboard")
                }
            } else {
                router.push("/update-password")
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred. Please try again.")
        }
    }

    return (
        <Card>
            <h1 className="text-3xl font-bold mb-6 text-center text-white">{isLogin ? "Login" : "Register"}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-white" htmlFor="name">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                className="w-full p-2 bg-white bg-opacity-20 rounded-md text-white"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-white" htmlFor="cnic">
                                CNIC
                            </label>
                            <input
                                id="cnic"
                                type="text"
                                name="cnic"
                                className="w-full p-2 bg-white bg-opacity-20 rounded-md text-white"
                                value={formData.cnic}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                )}
                <div>
                    <label className="block text-sm font-medium mb-1 text-white" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        className="w-full p-2 bg-white bg-opacity-20 rounded-md text-white"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                {isLogin && (
                    <div>
                        <label className="block text-sm font-medium mb-1 text-white" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            className="w-full p-2 bg-white bg-opacity-20 rounded-md text-white"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                {error && <p className="text-red-500 mt-4">{error}</p>}
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        {isLogin ? "Login" : "Register"}
                    </button>
                </div>
            </form>
        </Card>
    )
}

export default AuthForm

