"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/authcontext";
import Card from "./Card";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"


const loanCategories = {
    "Wedding Loans": {
        subcategories: ["Valima", "Furniture", "Valima Food", "Jahez"],
        maxLoan: 500000,
        maxPeriod: 3,
    },
    "Home Construction Loans": {
        subcategories: ["Structure", "Finishing", "Loan"],
        maxLoan: 1000000,
        maxPeriod: 5,
    },
    "Business Startup Loans": {
        subcategories: ["Buy Stall", "Advance Rent for Shop", "Shop Assets", "Shop Machinery"],
        maxLoan: 1000000,
        maxPeriod: 5,
    },
    "Education Loans": {
        subcategories: ["University Fees", "Child Fees Loan"],
        maxLoan: 1000000,
        maxPeriod: 4,
    },
};

export default function LoanRequestForm() {
    const { user } = useAuth();

    const [parsedData, setParsedData] = useState();
    const [savedparse, setSavedparse] = useState()


    const router = useRouter();



    const [formData, setFormData] = useState({
        userId: user?._id,
        cnic: user?.cnic,
        category: "",
        subcategory: "",
        loanAmount: "   ",
        monthlyPayment: "",
        initialDeposit: "",
        loanPeriod: "",
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

    useEffect(() => {
        const loanData = localStorage.getItem("loanData");
        setSavedparse(JSON.parse(loanData))
        const savedLoanData = localStorage.getItem("loanData")
        if (savedLoanData) {
            const parsedData = JSON.parse(savedLoanData);
            setFormData((prev) => ({
                ...prev,
                category: parsedData.category || "",
                subcategory: parsedData.subcategory || "",
                loanAmount: parsedData.loanBreakdown.loanAmount || "",
                monthlyPayment: parsedData.loanBreakdown.monthlyPayment || "",
                initialDeposit: parsedData.initialDeposit || "",
                loanPeriod: parsedData.loanPeriod || "",
            }));
        }
    }, []);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/loans/request`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && !response.data.error) {
                setFormData({
                    userId: user?._id,
                    cnic: user?.cnic,
                    category: "",
                    subcategory: "",
                    loanAmount: formData?.loanAmount,
                    monthlyPayment: savedparse?.monthlyPayment,
                    initialDeposit: "",
                    loanPeriod: "",
                    guarantor1Name: "",
                    guarantor1Email: "",
                    guarantor1Location: "",
                    guarantor1CNIC: "",
                    guarantor2Name: "",
                    guarantor2Email: "",
                    guarantor2Location: "",
                    guarantor2CNIC: "",
                    address: "",
                    phoneNumber: ""
                });
            } else {
                throw new Error(response.data.message || "Failed to submit loan request");
            }
        } catch (err) {
            console.error("Error submitting loan request:", err);
            setError(err.message || "Failed to submit loan request. Please try again.");
        } finally {
            setSubmitting(false);
            toast.success('loan request submitted!')
            router.push("/dashboard");
            // localStorage.removeItem('loanData');
        }
    };

    return (
        <Card>
            <h1 className="text-3xl font-bold mb-6 text-center">Loan Request</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-white">
                        Loan Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: "" })}
                        required
                        className="w-full p-2 bg-green-600 rounded-md text-white"
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
                        <label htmlFor="subcategory" className="block text-sm font-medium text-white">
                            Loan Subcategory
                        </label>
                        <select
                            id="subcategory"
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleChange}
                            required
                            className="w-full p-2 bg-green-600 rounded-md text-white"
                        >
                            <option value="">Select a subcategory</option>
                            {loanCategories[formData.category]?.subcategories.map((subcat) => (
                                <option key={subcat} value={subcat}>
                                    {subcat}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label htmlFor="initialDeposit" className="block text-sm font-medium text-white">
                        Initial Deposit (PKR)
                    </label>
                    <input
                        type="number"
                        id="initialDeposit"
                        name="initialDeposit"
                        value={formData.initialDeposit}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-green-600 rounded-md text-white"
                    />
                </div>

                <div>
                    <label htmlFor="loanPeriod" className="block text-sm font-medium text-white">
                        Loan Period (years)
                    </label>
                    <input
                        type="number"
                        id="loanPeriod"
                        name="loanPeriod"
                        value={formData.loanPeriod}
                        onChange={handleChange}
                        required
                        max={formData.category ? loanCategories[formData.category]?.maxPeriod : ""}
                        className="w-full p-2 bg-green-600 rounded-md text-white"
                    />
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-white">
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-green-600 rounded-md text-white"
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-white">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-green-600 rounded-md text-white"
                    />
                </div>

                <div>
                    <h2 className="text-center font-bold">Guarantor 1 Details</h2>
                    <label htmlFor="guarantor1Name" className="block text-sm font-medium text-white">
                        Guarantor Name
                    </label>
                    <input
                        type="text"
                        id="guarantor1Name"
                        name="guarantor1Name"
                        value={formData.guarantor1Name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-green-600 rounded-md text-white"
                    />

                    <label htmlFor="guarantor1Email" className="block text-sm font-medium text-white mt-4">
                        Guarantor Email
                    </label>
                    <input
                        type="email"
                        id="guarantor1Email"
                        name="guarantor1Email"
                        value={formData.guarantor1Email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-green-600 rounded-md text-white"
                    />

                    <label htmlFor="guarantor1Location" className="block text-sm font-medium text-white mt-4">
                        Guarantor Address
                    </label>
                    <input
                        type="text"
                        id="guarantor1Location"
                        name="guarantor1Location"
                        value={formData.guarantor1Location}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-green-600 rounded-md text-white"
                    />

                    <label htmlFor="guarantor1CNIC" className="block text-sm font-medium text-white mt-4">
                        Guarantor CNIC
                    </label>
                    <input
                        type="text"
                        id="guarantor1CNIC"
                        name="guarantor1CNIC"
                        value={formData.guarantor1CNIC}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-green-600 rounded-md text-white"
                    />
                </div>

                <div>
                    <h2 className="text-center font-bold">Guarantor 2 Details</h2>
                    <label htmlFor="guarantor2Name" className="block text-sm font-medium text-white">
                        Guarantor Name
                    </label>
                    <input
                        type="text"
                        id="guarantor2Name"
                        name="guarantor2Name"
                        value={formData.guarantor2Name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-green-600 rounded-md text-white"
                    />

                    <label htmlFor="guarantor2Email" className="block text-sm font-medium text-white mt-4">
                        Guarantor Email
                    </label>
                    <input
                        type="email"
                        id="guarantor2Email"
                        name="guarantor2Email"
                        value={formData.guarantor2Email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-green-600 rounded-md text-white"
                    />

                    <label htmlFor="guarantor2Location" className="block text-sm font-medium text-white mt-4">
                        Guarantor Address
                    </label>
                    <input
                        type="text"
                        id="guarantor2Location"
                        name="guarantor2Location"
                        value={formData.guarantor2Location}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-green-600 rounded-md text-white"
                    />

                    <label htmlFor="guarantor2CNIC" className="block text-sm font-medium text-white mt-4">
                        Guarantor CNIC
                    </label>
                    <input
                        type="text"
                        id="guarantor2CNIC"
                        name="guarantor2CNIC"
                        value={formData.guarantor2CNIC}
                        onChange={handleChange}
                        required
                        className="w-full p-2 bg-green-600 rounded-md text-white"
                    />
                </div>


                {error && <p className="text-red-500">{error}</p>}
                <button
                    type="submit    "
                    disabled={submitting}
                    className="w-full py-2 px-4 rounded-md bg-green-700 text-white font-bold hover:bg-green-800"
                >
                    {submitting ? "Submitting..." : "Submit Loan Request"}
                </button>
            </form>
        </Card>
    );
}
