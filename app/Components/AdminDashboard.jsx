"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Card from "./Card"
import { useAuth } from "../Context/authcontext"
import axios from "axios"
import toast from "react-hot-toast"
import { Info } from "lucide-react"

const AdminDashboard = () => {
    const [applications, setApplications] = useState([])
    const [filters, setFilters] = useState({ city: "", country: "" })
    const [error, setError] = useState("")
    const router = useRouter()
    const { user } = useAuth()
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        if (!user?.isAdmin) {
            router.push("/")
        } else {
            fetchApplications()
        }
    }, [user])


    const fetchApplications = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/loans/admin`);
            console.log(response)
            // console.log(data)
            // console.log(applications)
            setApplications(response.data.data)
        } catch (err) {
            console.log(err);

            setError("An error occurred. Please try again.")
        }
    }

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }

    // const filteredApplications = applications.filter(
    //     (app) =>
    //         (filters.city === "" || app.city === filters.city) && (filters.country === "" || app.country === filters.country),
    // )

    // const handleStatusUpdate = async (id, status) => {
    //     try {
    //         const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/loans/admin`, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${localStorage.getItem("token")}`,
    //             },
    //             body: JSON.stringify({ id, status }),
    //         })
    //         if (res.ok) {
    //             fetchApplications(localStorage.getItem("token"))
    //         } else {
    //             setError("Failed to update application status")
    //         }
    //     } catch (err) {
    //         setError("An error occurred. Please try again.")
    //     }
    // }

    const allDetails = async (app) => {
        setSelectedApp(app)
    }

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/loans/admin`,
                { id, status },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            fetchApplications(localStorage.getItem("token"));
            toast.success('Updated!')
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    return (
        <>
            {user?.isAdmin && (
                <Card className="bg-green-800">
                    <h1 className="text-3xl font-bold mb-6 text-center text-white">Admin Dashboard</h1>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold mb-4 text-white">Loan Applications</h2>
                        {/* <div className="flex gap-4 mb-4">
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
                        </div> */}
                        {applications.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-white">CNIC</th>
                                            <th className="text-white">Category</th>
                                            <th className="text-white">Loan Amount</th>
                                            <th className="text-white">Monthly Payment</th>
                                            <th className="text-white">Intial Depoist</th>
                                            <th className="text-white">Intial Period</th>
                                            <th className="text-white">Status</th>
                                            <th className="text-white">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map((app) => (
                                            <tr key={app._id}>
                                                <td className="text-white">{app.cnic}</td>
                                                <td className="text-white">{app.category} - {app.subcategory}</td>
                                                <td className="text-white">PKR {app.loanAmount.toLocaleString()}</td>
                                                <td className="text-white">PKR {app.monthlyPayment.toLocaleString()}</td>
                                                <td className="text-white">PKR {app.initialDeposit.toLocaleString()}</td>
                                                <td className="text-white">{app.loanPeriod.toLocaleString()} Years</td>
                                                <td className="text-white capitalize">{app.status}</td>
                                                <td>
                                                    <select
                                                        className="select select-bordered bg-green-800 text-white"
                                                        onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                                        value={app.status}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="approved">Approved</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <label htmlFor="my_modal_6" className="btn" onClick={() => { allDetails(app) }}><Info /></label>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-white">No applications found.</p>
                        )}
                    </div>
                </Card>
            )}

            {selectedApp && (
                <>
                    <input type="checkbox" id="my_modal_6" className="modal-toggle" />
                    <div className="modal" role="dialog">
                        <div className="modal-box bg-green-700">
                            <h3 className="text-lg font-bold">CNIC: {selectedApp.cnic}</h3>
                            <h3 className="text-lg font-medium mb-5">Status: {selectedApp.status}</h3>

                            <h3 className="text-md font-bold">Category: {selectedApp.category}</h3>
                            <h3 className="font-medium">Sub-Category: {selectedApp.subcategory}</h3>
                            <h3 className="font-medium">Address: {selectedApp.address}</h3>
                            <h3 className="font-medium mb-5">Phone Number: {selectedApp.phoneNumber}</h3>

                            <p>Loan Amount: PKR {selectedApp.loanAmount}</p>
                            <p>Monthly Amount: PKR {selectedApp.monthlyPayment}</p>
                            <p>Initial Deposit: PKR {selectedApp.initialDeposit}</p>
                            <p className="mb-5">Loan Period: {selectedApp.initialDeposit} Years</p>

                            <div>
                                <h3 className="font-bold mb-5">Guarantor 1 details:</h3>
                                <p>Name: {selectedApp.guarantor1.name}</p>
                                <p>Email: {selectedApp.guarantor1.email}</p>
                                <p>Address: {selectedApp.guarantor1.location}</p>
                                <p>CNIC: {selectedApp.guarantor1.cnic}</p>
                            </div>

                            <div>
                                <h3 className="font-bold mt-5 mb-5">Guarantor 2 details:</h3>
                                <p>Name: {selectedApp.guarantor2.name}</p>
                                <p>Email: {selectedApp.guarantor2.email}</p>
                                <p>Address: {selectedApp.guarantor2.location}</p>
                                <p>CNIC: {selectedApp.guarantor2.cnic}</p>
                            </div>

                            <p className="mt-5">Date: {loan.createdAt?.split("T")[0]}</p>

                            <div className="modal-action">
                                <label
                                    htmlFor="my_modal_6"
                                    className="btn"
                                    onClick={() => setSelectedApp(null)}
                                >
                                    Close!
                                </label>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default AdminDashboard

