"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Card from "./Card"

const AdminDashboard = () => {
    const [applications, setApplications] = useState([])
    const [filters, setFilters] = useState({ city: "", country: "" })
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/login")
        } else {
            fetchApplications(token)
        }
    }, [router])

    const fetchApplications = async (token) => {
        try {
            const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL} +/admin/applications`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (res.ok) {
                const data = await res.json()
                setApplications(data)
            } else {
                setError("Failed to fetch applications")
            }
        } catch (err) {
            setError("An error occurred. Please try again.")
        }
    }

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }

    const filteredApplications = applications.filter(
        (app) =>
            (filters.city === "" || app.city === filters.city) && (filters.country === "" || app.country === filters.country),
    )

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}+/admin/applications/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ status }),
            })
            if (res.ok) {
                fetchApplications(localStorage.getItem("token"))
            } else {
                setError("Failed to update application status")
            }
        } catch (err) {
            setError("An error occurred. Please try again.")
        }
    }

    return (
        <Card>
            <h1 className="text-3xl font-bold mb-6 text-center text-white">Admin Dashboard</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4 text-white">Loan Applications</h2>
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        name="city"
                        placeholder="Filter by city"
                        className="input input-bordered bg-white bg-opacity-20 text-white"
                        value={filters.city}
                        onChange={handleFilterChange}
                    />
                    <input
                        type="text"
                        name="country"
                        placeholder="Filter by country"
                        className="input input-bordered bg-white bg-opacity-20 text-white"
                        value={filters.country}
                        onChange={handleFilterChange}
                    />
                </div>
                {filteredApplications.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th className="text-white">Name</th>
                                    <th className="text-white">Category</th>
                                    <th className="text-white">Amount</th>
                                    <th className="text-white">Status</th>
                                    <th className="text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplications.map((app) => (
                                    <tr key={app._id}>
                                        <td className="text-green-100">{app.name}</td>
                                        <td className="text-green-100">{app.category}</td>
                                        <td className="text-green-100">PKR {app.amount.toLocaleString()}</td>
                                        <td className="text-green-100 capitalize">{app.status}</td>
                                        <td>
                                            <select
                                                className="select select-bordered bg-white bg-opacity-20 text-white"
                                                onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                                value={app.status}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-green-100">No applications found.</p>
                )}
            </div>
        </Card>
    )
}

export default AdminDashboard

