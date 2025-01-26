// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import axios from "axios"
// import { useAuth } from "../Context/authcontext"
// import Card from "../components/Card"
// import LoanRequestForm from "../components/LoanRequestForm"

// export default function Dashboard() {
//     const { user, getToken } = useAuth()
//     const router = useRouter()
//     const [loans, setLoans] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState("")

//     useEffect(() => {
//         if (!user) {
//             router.push("/login")
//         } else {
//             fetchLoans()
//         }
//     }, [user, router])

//     const fetchLoans = async () => {
//         try {
//             const token = await getToken()

//             if (!token) {
//                 throw new Error("No authentication token found")
//             }
//             const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/loans/details`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             })
//             if (response.data && response.data.data) {
//                 setLoans(response.data.data)
//             } else {
//                 throw new Error("Invalid response format")
//             }
//             setLoading(false)
//         } catch (err) {
//             console.error("Error fetching loans:", err)
//             setError("Failed to fetch loans. Please try again.")
//             setLoading(false)
//         }
//     }

//     if (!user) return null

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-3xl font-bold mb-8 text-center text-white">User Dashboard</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <Card>
//                     <h2 className="text-2xl font-semibold mb-4 text-white">Your Loan Requests</h2>
//                     {loading ? (
//                         <p className="text-white">Loading...</p>
//                     ) : error ? (
//                         <p className="text-red-500">{error}</p>
//                     ) : loans.length === 0 ? (
//                         <p className="text-white">You have no loan requests yet.</p>
//                     ) : (
//                         <ul className="space-y-4">
//                             {loans.map((loan) => (
//                                 <li key={loan._id} className="bg-white bg-opacity-10 p-4 rounded-lg">
//                                     <h3 className="text-lg font-semibold text-white">
//                                         {loan.category} - {loan.subcategory}
//                                     </h3>
//                                     <p className="text-white">Amount: PKR {loan.amount.toLocaleString()}</p>
//                                     <p className="text-white">Status: {loan.status || "Pending"}</p>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </Card>
//                 <Card>
//                     <h2 className="text-2xl font-semibold mb-4 text-white">Submit New Loan Request</h2>
//                     <LoanRequestForm onSubmitSuccess={fetchLoans} />
//                 </Card>
//             </div>
//         </div>
//     )
// }

