"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "../Context/authcontext"

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()
    const { user, logout } = useAuth()

    const navItems = [
        { name: "Home", href: "/" },
    ];

    if (user?.isAdmin) {
        navItems.push({ name: "Admin", href: "/admin" });
    } else if (user) {
        navItems.push({ name: "Dashboard", href: "/dashboard" });
    } else {
        navItems.push({ name: "Login", href: "/login" });
    }


    if (user) {
        navItems.push({ name: "Logout", href: "#", onClick: logout })
    }

    return (
        <header className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-white">
                        Saylani Microfinance
                    </Link>
                    <nav className="hidden md:flex space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={item.onClick}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${pathname === item.href
                                    ? "bg-white bg-opacity-20 text-white"
                                    : "text-green-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isMenuOpen ? (
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                                />
                            ) : (
                                <path
                                    fillRule="evenodd"
                                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                                />
                            )}
                        </svg>
                    </button>
                </div>
                {isMenuOpen && (
                    <nav className="mt-4 md:hidden">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={(e) => {
                                    if (item.onClick) {
                                        e.preventDefault()
                                        item.onClick()
                                    }
                                    setIsMenuOpen(false)
                                }}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === item.href
                                    ? "bg-white bg-opacity-20 text-white"
                                    : "text-green-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    )
}

export default Header
