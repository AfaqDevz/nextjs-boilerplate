"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "../Context/authcontext";
import Card from "../Components/Card";
import LoanRequestForm from "../Components/LoanRequestForm";
import toast from "react-hot-toast";

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [loans, setLoans] = useState([]);
    const [fetchingLoans, setFetchingLoans] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
        else if (user?.isAdmin == true) {
            router.push("/admin");
        }
        else if (user) {
            fetchLoans();
        }
    }, [user, loading, router]);

    const fetchLoans = async () => {
        try {
            // const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            // if (!token) {
            //     setError("Token not found. Please log in again.");
            //     setFetchingLoans(false);
            //     return;
            // }

            // const userData = localStorage.getItem('user')
            console.log(user)
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/loans/details/${user._id}`);
            setLoans(response.data.data || []);
            setFetchingLoans(false);
        } catch (err) {
            console.error("Error fetching loans:", err);
            setError("Failed to fetch loans. Please try again later.");
            setFetchingLoans(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-white">User Dashboard</h1>
            <div className="w-full">
                <Card>
                    <h2 className="text-2xl font-semibold mb-4 text-white">Your Loan Requests</h2>
                    {fetchingLoans ? (
                        <p className="text-white">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : loans.length === 0 ? (
                        <p className="text-white">You have no loan requests yet.</p>
                    ) : (
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {loans.map((loan) => (
                                <li key={loan._id} className="bg-green-700 bg-opacity-40 p-4 rounded-lg">
                                    <p className="text-green-950 text-lg font-bold mb-5">Status: {loan.status || "Pending"}</p>

                                    <h2 className="text-lg font-bold text-white">
                                        {loan.category}
                                    </h2>
                                    <h2 className="text-lg font-medium text-white mb-5">
                                        {loan.subcategory}
                                    </h2>

                                    <h2>Address: {loan.address}</h2>
                                    <h2 className="mb-5">Phone Number: {loan.phoneNumber}</h2>


                                    <p className="text-white">Loan Amount: PKR {loan.loanAmount.toLocaleString()}</p>
                                    <p className="text-white">Monthly Payment: PKR {loan.monthlyPayment.toLocaleString()}</p>
                                    <p className="text-white">Initial Deposit: PKR {loan.initialDeposit.toLocaleString()}</p>
                                    <p className="text-white mb-3">Loan Period: {loan.loanPeriod.toLocaleString()} Years</p>

                                    <div>
                                        <h3 className="font-bold mb-2">Guarantor 1 details:</h3>
                                        <p>Name: {loan.guarantor1.name}</p>
                                        <p>Email: {loan.guarantor1.email}</p>
                                        <p>Address: {loan.guarantor1.location}</p>
                                        <p>CNIC: {loan.guarantor1.cnic}</p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold mt-5 mb-2">Guarantor 2 details:</h3>
                                        <p>Name: {loan.guarantor2.name}</p>
                                        <p>Email: {loan.guarantor2.email}</p>
                                        <p>Address: {loan.guarantor2.location}</p>
                                        <p>CNIC: {loan.guarantor2.cnic}</p>
                                    </div>

                                    <p className="mt-5">Date: {loan.createdAt?.split("T")[0]}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                {/* <Card>
                    <h2 className="text-2xl font-semibold mb-4 text-white">Submit New Loan Request</h2>
                    <LoanRequestForm onSubmitSuccess={fetchLoans} />
                </Card> */}
            </div>
        </div>
    );
}
