'use client'

import { useAuth } from "../Context/authcontext"
import { useEffect } from "react";
import { useRouter } from "next/navigation"


export default function Home() {
    const { user, logOutUser } = useAuth();

    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/home");
        } else {
            router.push("/");
        }
    }, [user]);
    return (
        <div>Home
            <button onClick={() => { logOutUser() }}>Logout</button>
        </div>
    )
}
