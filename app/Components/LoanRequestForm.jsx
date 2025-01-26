"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Card from "./Card";
import { useAuth } from "../Context/authcontext";
import UpdatePasswordForm from "../update-password/page";

const loanCategories = {
    "Wedding Loans": ["Valima", "Furniture", "Valima Food", "Jahez"],
    "Home Construction Loans": ["Structure", "Finishing", "Loan"],
    "Business Startup Loans": [
        "Buy Stall",
        "Advance Rent for Shop",
        "Shop Assets",
        "Shop Machinery",
    ],
    "Education Loans": ["University Fees", "Child Fees Loan"],
};

const LoanRequestFormContent = () => {
    const [formData, setFormData] = useState({
        category: "",
        subcategory: "",
        amount: "",
        guarantor1Name: "",
        guarantor1Email: "",
        guarantor1Location: "",
        guarantor1CNIC: "",
        guarantor2Name: "",
        guarantor2Email: "",
        guarantor2Location: "",
        guarantor2CNIC: "",
        address: "",
        phoneNumber: "",
    });

    const [error, setError] = useState("");
    const router = useRouter();
    const { user, getToken, isFirstLogin } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const savedLoanData = localStorage.getItem("loanData");
            if (savedLoanData) {
                const parsedData = JSON.parse(savedLoanData);
                setFormData((prevData) => ({
                    ...prevData,
                    category: parsedData.category || "",
                    subcategory: parsedData.subcategory || "",
                    amount: parsedData.loanBreakdown
                        ? parsedData.loanBreakdown.loanAmount.toString()
                        : "",
                }));
            }
            setIsLoading(false);
        };

        loadData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = getToken();
            if (!token) {
                setError("Authentication token not found. Please log in again.");
                return;
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/loans/request`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 201) {
                localStorage.removeItem("loanData");
                router.push("/dashboard");
            } else {
                setError(response.data.message || "An error occurred. Please try again.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (!user) return <p>Please log in to submit a loan request.</p>;

    if (isFirstLogin) {
        return (
            <Card>
                <h1 className="text-3xl font-bold mb-6 text-center text-white">
                    Update Password
                </h1>
                <p className="mb-4 text-white">
                    Please update your password before submitting a loan request.
                </p>
                <UpdatePasswordForm />
            </Card>
        );
    }

    return (
        <Card>
            <h1 className="text-3xl font-bold mb-6 text-center text-white">
                Loan Request
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        className="block text-sm font-medium mb-1 text-green-100"
                        htmlFor="category"
                    >
                        Loan Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        className="w-full p-2 bg-white bg-opacity-20 rounded-md text-white"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a category</option>
                        {Object.keys(loanCategories).map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {formData.category && (
                    <div>
                        <label
                            className="block text-sm font-medium mb-1 text-green-100"
                            htmlFor="subcategory"
                        >
                            Loan Subcategory
                        </label>
                        <select
                            id="subcategory"
                            name="subcategory"
                            className="w-full p-2 bg-white bg-opacity-20 rounded-md text-white"
                            value={formData.subcategory}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a subcategory</option>
                            {loanCategories[formData.category].map((subcat) => (
                                <option key={subcat} value={subcat}>
                                    {subcat}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label
                        className="block text-sm font-medium mb-1 text-green-100"
                        htmlFor="amount"
                    >
                        Loan Amount (PKR)
                    </label>
                    <input
                        id="amount"
                        type="number"
                        name="amount"
                        className="w-full p-2 bg-white bg-opacity-20 rounded-md text-white"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-4 text-white">
                    Guarantor 1
                </h3>
                {/* Guarantor 1 Fields */}
                {["Name", "Email", "Location", "CNIC"].map((field) => (
                    <div key={`guarantor1${field}`}>
                        <label
                            className="block text-sm font-medium mb-1 text-green-100"
                            htmlFor={`guarantor1${field}`}
                        >
                            {field}
                        </label>
                        <input
                            id={`guarantor1${field}`}
                            name={`guarantor1${field}`}
                            type={field === "Email" ? "email" : "text"}
                            className="w-full p-2 bg-white bg-opacity-20 rounded-md text-white"
                            value={formData[`guarantor1${field}`]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}

                {/* Repeat for Guarantor 2 */}
                <h3 className="text-xl font-semibold mt-6 mb-4 text-white">
                    Guarantor 2
                </h3>
                {["Name", "Email", "Location", "CNIC"].map((field) => (
                    <div key={`guarantor2${field}`}>
                        <label
                            className="block text-sm font-medium mb-1 text-green-100"
                            htmlFor={`guarantor2${field}`}
                        >
                            {field}
                        </label>
                        <input
                            id={`guarantor2${field}`}
                            name={`guarantor2${field}`}
                            type={field === "Email" ? "email" : "text"}
                            className="w-full p-2 bg-white bg-opacity-20 rounded-md text-white"
                            value={formData[`guarantor2${field}`]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}

                <h3 className="text-xl font-semibold mt-6 mb-4 text-white">
                    Personal Information
                </h3>
                {/* Personal Info Fields */}
                <div>
                    <label
                        className="block text-sm font-medium mb-1 text-green-100"
                        htmlFor="address"
                    >
                        Address
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        className="w-full p-2 bg-white bg-opacity-20 rounded-md text-white"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div>
                    <label
                        className="block text-sm font-medium mb-1 text-green-100"
                        htmlFor="phoneNumber"
                    >
                        Phone Number
                    </label>
                    <input
                        id="phoneNumber"
                        type="tel"
                        name="phoneNumber"
                        className="w-full p-2 bg-white bg-opacity-20 rounded-md text-white"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <p className="text-red-500 mt-4">{error}</p>}
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Submit Loan Request
                    </button>
                </div>
            </form>
        </Card>
    );
};

export default LoanRequestFormContent;
