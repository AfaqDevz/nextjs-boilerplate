"use client"

import { useState } from "react"
import axios from "axios"

export default function LoanRequestForm({ onSubmitSuccess }) {
    const [formData, setFormData] = useState({
        category: "",
        subcategory: "",
        amount: "",
        address: "",
        phoneNumber: "",
        guarantor1Name: "",
        guarantor1Email: "",
        guarantor1Location: "",
        guarantor1CNIC: "",
        guarantor2Name: "",
        guarantor2Email: "",
        guarantor2Location: "",
        guarantor2CNIC: "",
    })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError("")

        try {
            const token = localStorage.getItem("token")
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/loans/request`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.data && !response.data.error) {
                setFormData({
                    category: "",
                    subcategory: "",
                    amount: "",
                    address: "",
                    phoneNumber: "",
                    guarantor1Name: "",
                    guarantor1Email: "",
                    guarantor1Location: "",
                    guarantor1CNIC: "",
                    guarantor2Name: "",
                    guarantor2Email: "",
                    guarantor2Location: "",
                    guarantor2CNIC: "",
                })
                onSubmitSuccess()
            } else {
                throw new Error(response.data.message || "Failed to submit loan request")
            }
        } catch (err) {
            console.error("Error submitting loan request:", err)
            setError(err.message || "Failed to submit loan request. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-white">
                    Category
                </label>
                <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-white">
                    Subcategory
                </label>
                <input
                    type="text"
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-white">
                    Amount (PKR)
                </label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            {/* Add fields for guarantors here */}
            {error && <p className="text-red-500">{error}</p>}
            <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {submitting ? "Submitting..." : "Submit Loan Request"}
            </button>
        </form>
    )
}

