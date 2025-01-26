'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Card from "./Card"
import QRCode from "qrcode.react"

export default function Dashboard() {
    const [loans, setLoans] = useState([])
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/login")
        } else {
            fetchLoans(token)
        }
    }, [router])

    const fetchLoans = async (token) => {
        try {
            const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}+/loans/details`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (res.ok) {
                const data = await res.json()
                setLoans(data)
            } else {
                setError("Failed to fetch loans")
            }
        } catch (err) {
            setError("An error occurred. Please try again.")
        }
    }

    return (
        <Card className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
            {error && <p className="text-error mb-4">{error}</p>}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Your Loans</h2>
                {loans.length > 0 ? (
                    <div className="space-y-4">
                        {loans.map((loan) => (
                            <div key={loan._id} className="bg-white bg-opacity-20 p-4 rounded-lg">
                                <h3 className="text-xl font-semibold">
                                    {loan.category} - {loan.subcategory}
                                </h3>
                                <p>Amount: PKR {loan.amount.toLocaleString()}</p>
                                <p>
                                    Status: <span className="capitalize">{loan.status}</span>
                                </p>
                                {loan.appointmentDetails && (
                                    <div className="mt-4">
                                        <h4 className="text-lg font-semibold">Appointment Details</h4>
                                        <p>Date: {new Date(loan.appointmentDetails.date).toLocaleDateString()}</p>
                                        <p>Time: {loan.appointmentDetails.time}</p>
                                        <p>Location: {loan.appointmentDetails.location}</p>
                                        <div className="mt-2">
                                            <QRCode value={`${loan._id}-${loan.appointmentDetails.date}`} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You have no active loans.</p>
                )}
            </div>
        </Card>
    )
}

