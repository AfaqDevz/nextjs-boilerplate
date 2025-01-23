"use client"

import { useState } from "react"
import { Eye, EyeOff, LogIn, ScanFace } from "lucide-react"

export default function EnhancedLoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async => {

    }

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
            <div className="card w-full max-w-md shadow-2xl bg-base-100">
                <div className="card-body">
                    <h2 className="card-title text-3xl font-bold mb-6 text-center">
                        <ScanFace size={40} />Login
                    </h2>
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="alert alert-error mb-6 animate-shake">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="stroke-current shrink-0 h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="form-control">
                            <label className="label" htmlFor="email">
                                <span className="label-text">Email:</span>
                            </label>
                            <div className="input-group">
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="email@example.com"
                                    className="input input-bordered w-full"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-control mt-4">
                            <label className="label" htmlFor="password">
                                <span className="label-text">Password</span>
                            </label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="••••••••"
                                    className="input input-bordered w-full pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-8 bottom-44 px-3 bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" className={`btn btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                                {!loading && <LogIn size={18} className="ml-2" />}
                            </button>
                        </div>
                    </form>

                    <p className="text-center mt-6">
                        Don't have an account?{" "}
                        <a href="#" className="link link-primary">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

